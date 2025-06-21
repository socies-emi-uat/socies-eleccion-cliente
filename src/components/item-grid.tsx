import { Candidato } from "@/hooks/use-readme";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback } from "react";
import ItemCard from "./item-card";

type LayoutType = "compact" | "grid" | "row";

interface ItemGridProps {
  items: Candidato[];
  bookmarkedItems: number[];
  onBookmark: (id: number) => void;
  layoutType: LayoutType;
}

// Standard animations for grid and containers
const standardAnimations = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0 },
  },
  emptyState: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export function ItemGrid({
  items,
  bookmarkedItems,
  onBookmark,
  layoutType = "grid",
}: ItemGridProps) {
  // Get the appropriate grid class based on layout type
  const getGridClasses = useCallback(() => {
    switch (layoutType) {
      case "compact":
        return "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4";
      case "grid":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
      case "row":
        return "grid-cols-1 gap-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
    }
  }, [layoutType]);

  // No items state
  if (items.length === 0) {
    return (
      <motion.div
        {...standardAnimations.emptyState}
        className="text-center py-12 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-4"
        >
          <svg
            className="w-8 h-8 text-neutral-500 dark:text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
        <p className="text-muted-foreground text-lg font-medium">
          No se encontraron items con estos criterios.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Vuelve a ajustar los parametros de busqueda y filtra.
        </p>
      </motion.div>
    );
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={`grid-${layoutType}`}
          className={`grid ${getGridClasses()}`}
          {...standardAnimations.container}
          layout
        >
          {items.map((item) => (
            <ItemCard
              key={`${item.id_candidato}-${layoutType}`}
              item={item}
              isBookmarked={bookmarkedItems.includes(item.id_candidato)}
              onBookmark={onBookmark}
              layoutType={layoutType}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
