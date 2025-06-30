'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { IconCheck } from '@tabler/icons-react';
import { Options } from 'nuqs';
import React from 'react';

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SingleFilterBoxProps {
  filterKey: string;
  title: string;
  options: FilterOption[];
  setFilterValue: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  filterValue: string;
}

export function DataTableSingleFilterBox({
  filterKey,
  title,
  options,
  setFilterValue,
  filterValue
}: SingleFilterBoxProps) {
  const handleSelect = (value: string) => {
    if (filterValue === value) {
      setFilterValue(null);
    } else {
      setFilterValue(value);
    }
  };

  const resetFilter = () => setFilterValue(null);

  const selectedOption = options.find((option) => option.value === filterValue);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {selectedOption && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal'
              >
                {selectedOption.label}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                      filterValue === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <IconCheck className='h-4 w-4' aria-hidden='true' />
                  </div>
                  {option.icon && (
                    <option.icon
                      className='text-muted-foreground mr-2 h-4 w-4'
                      aria-hidden='true'
                    />
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {filterValue && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={resetFilter}
                    className='justify-center text-center'
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
