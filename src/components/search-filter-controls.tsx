import Sort, { SortOption } from "@/components/sort";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback } from "react";

interface SearchFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryOptions: { label: string; value: string }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function SearchFilterControls({
  searchQuery,
  setSearchQuery,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortOption,
  onSortChange,
}: SearchFilterControlsProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  return (
    <motion.div
      className="flex flex-col lg:flex-row lg:items-center gap-4"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay: 0.2,
          },
        },
      }}
    >
      <div className="w-full lg:w-1/2">
        <Input
          type="text"
          placeholder="Buscar candidato..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      {/* Filtros y ordenamiento centrados */}
      <div className="flex flex-col sm:flex-row w-full justify-center gap-4">
        <div className="flex justify-center w-full sm:w-auto">
          <MultiSelect
            options={categoryOptions}
            value={selectedCategories}
            onValueChange={setSelectedCategories}
            placeholder="Filtrar por partido"
            className="w-full sm:w-64"
          />
        </div>

        {/* Aseguramos que el Sort esté centrado también */}
        <div className="flex justify-center w-full sm:w-auto">
          <Sort sortOption={sortOption} onSortChange={onSortChange} />
        </div>
      </div>
    </motion.div>
  );
}
