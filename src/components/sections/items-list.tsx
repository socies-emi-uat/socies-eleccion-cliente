"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isValid, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Grid2X2, Grid3X3, List } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

import { SortOption } from "@/components/sort";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { Candidato, Resource } from "@/hooks/use-readme";
import { ItemGrid } from "../item-grid";
import { PaginationControls } from "../pagination-controls";
import { SearchFilterControls } from "../search-filter-controls";
import { Skeleton } from "../ui/skeleton";

const ITEMS_PER_PAGE_OPTIONS = [18, 27, 36, 45];

interface Category {
  title: string;
  items: Candidato[];
}

interface ItemListProps {
  items: Candidato[];
  categories: Category[];
  isLoading?: boolean; // <-- Añade esta línea
}

// Define layout types
type LayoutType = "compact" | "grid" | "row";

export default function ItemList({
  items: initialItems,
  categories,
}: ItemListProps) {
  const [filteredItems, setFilteredItems] = useState<Candidato[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [isLoading, setIsLoading] = useState(true);
  const [layoutType, setLayoutType] = useState<LayoutType>("grid");



  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { bookmarkedItems, toggleBookmark } = useBookmarks();

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.title,
        value: category.title,
      })),
    [categories],
  );

  const sortItems = useCallback(
    (items: Candidato[]): Candidato[] => {
      return [...items].sort((a, b) => {
        const aBookmarked = bookmarkedItems.includes(a.id_candidato);
        const bBookmarked = bookmarkedItems.includes(b.id_candidato);
        if (aBookmarked !== bBookmarked) return aBookmarked ? -1 : 1;

        const [field, direction] = sortOption.split("-") as [
          "date" | "name",
          "asc" | "desc",
        ];

        if (field === "name") {
          const nameA = a.nombre?.toLowerCase() || "";
          const nameB = b.nombre?.toLowerCase() || "";
          const result = nameA.localeCompare(nameB);
          return direction === "asc" ? result : -result;
        } else {
          const dateA =
            a.fecha_creacion && a.fecha_creacion !== "Unknown" ? parseISO(a.fecha_creacion) : new Date(0);
          const dateB =
            b.fecha_creacion && b.fecha_creacion !== "Unknown" ? parseISO(b.fecha_creacion) : new Date(0);

          if (!isValid(dateA) && !isValid(dateB)) return 0;
          if (!isValid(dateA)) return direction === "asc" ? -1 : 1;
          if (!isValid(dateB)) return direction === "asc" ? 1 : -1;

          return direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
      });
    },
    [bookmarkedItems, sortOption],
  );

  const filterAndSortItems = useCallback(() => {
    let filtered = [...initialItems];

    if (debouncedSearchQuery) {
      const lowercaseQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.nombre?.toLowerCase() || "").includes(lowercaseQuery) ||
          (item.apellidos?.toLowerCase() || "").includes(lowercaseQuery),
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.partido),
      );
    }

    const sortedItems = sortItems(filtered);

    setFilteredItems(sortedItems);
    setCurrentPage(1);
  }, [initialItems, debouncedSearchQuery, selectedCategories, sortItems]);

  useEffect(() => {
    filterAndSortItems();
  }, [filterAndSortItems]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      filterAndSortItems();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (option: SortOption) => {
      setSortOption(option);

      const sorted = sortItems(
        filteredItems.filter((item) => {
          if (
            selectedCategories.length > 0 &&
            !selectedCategories.includes(item.partido)
          ) {
            return false;
          }

          if (debouncedSearchQuery) {
            const lowercaseQuery = debouncedSearchQuery.toLowerCase();
            return (
              (item.nombre?.toLowerCase() || "").includes(lowercaseQuery) ||
              (item.apellidos?.toLowerCase() || "").includes(lowercaseQuery)
            );
          }

          return true;
        }),
      );

      setFilteredItems(sorted);
    },
    [filteredItems, sortItems, selectedCategories, debouncedSearchQuery],
  );

  // Layout switching handler
  const handleLayoutChange = useCallback((value: string) => {
    if (value) {
      setLayoutType(value as LayoutType);
    }
  }, []);

  // Get grid column classes based on layout type
  const getGridClasses = useCallback(() => {
    switch (layoutType) {
      case "compact":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      case "grid":
        return "sm:grid-cols-2 lg:grid-cols-3";
      case "row":
        return "grid-cols-1";
      default:
        return "sm:grid-cols-2 lg:grid-cols-3";
    }
  }, [layoutType]);

  // Get item card height based on layout type
  const getCardHeightClass = useCallback(() => {
    switch (layoutType) {
      case "compact":
        return "min-h-[200px]";
      case "grid":
        return "min-h-[250px]";
      case "row":
        return "min-h-[150px] md:min-h-[130px]";
      default:
        return "min-h-[250px]";
    }
  }, [layoutType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <SearchFilterControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryOptions={categoryOptions}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

        <div className="flex items-center justify-end w-full sm:w-auto mt-4 sm:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
          >
            <TooltipProvider delayDuration={300}>
              <ToggleGroup
                type="single"
                value={layoutType}
                onValueChange={handleLayoutChange}
                className="relative border rounded-md bg-background/50 backdrop-blur-sm shadow-sm"
              >
                <motion.div
                  layoutId="activeLayoutIndicator"
                  className="absolute bottom-0 h-[3px] bg-primary z-10 transition-all duration-300"
                  style={{
                    width: "24px",
                    left:
                      layoutType === "compact"
                        ? "6px"
                        : layoutType === "grid"
                          ? "46px"
                          : "86px",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="compact"
                      aria-label="Compact Grid View"
                      className="relative z-20 data-[state=on]:bg-primary/10 data-[state=on]:text-primary hover:bg-muted/70 transition-all"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="font-medium"
                  >
                    Compacto
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="grid"
                      aria-label="Grid View"
                      className="relative z-20 data-[state=on]:bg-primary/10 data-[state=on]:text-primary hover:bg-muted/70 transition-all"
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="font-medium"
                  >
                    Estandar
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="row"
                      aria-label="Row View"
                      className="relative z-20 data-[state=on]:bg-primary/10 data-[state=on]:text-primary hover:bg-muted/70 transition-all"
                    >
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="font-medium"
                  >
                    Vista Lista
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </TooltipProvider>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${isLoading ? "loading" : "loaded"}-${layoutType}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          layout
        >
          {isLoading ? (
            <div className={`grid gap-6 ${getGridClasses()}`}>
              {[...Array(itemsPerPage)].map((_, index) => (
                <Card
                  key={index}
                  className={`flex flex-col h-full ${getCardHeightClass()} overflow-hidden`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <ItemGrid
              items={currentItems}
              bookmarkedItems={bookmarkedItems}
              onBookmark={toggleBookmark}
              layoutType={layoutType}
            />
          )}

        

        </motion.div>
      </AnimatePresence>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        handleItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      />

      <div className="text-sm text-muted-foreground text-center">
        Mostrando {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
        {filteredItems.length} items
      </div>
    </div>
  );
}
