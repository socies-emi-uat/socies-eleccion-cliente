import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ExternalLink, Bookmark, Users, Clock, Info, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { PPartido } from "@/models/PPartido";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

type LayoutType = "compact" | "grid" | "row";

interface ItemCardProps {
  item: PPartido;
  isBookmarked: boolean;
  onBookmark: (id: number) => void;
  layoutType: LayoutType;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Animaciones estándar
const standardAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
};

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isBookmarked,
  onBookmark,
  layoutType = "grid",
}) => {
  const [showHighlight, setShowHighlight] = useState(false);

  // Get styling based on layout type
  const styles = useMemo(() => {
    switch (layoutType) {
      case "compact":
        return {
          card: "h-[240px] group border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300",
          container: "gap-1",
          title:
            "text-sm font-bold group-hover:text-primary transition-colors duration-300",
          badge: "text-xs px-2 py-0 h-5 mt-1",
          description:
            "text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300 min-h-[2.5rem] line-clamp-5",
          date: "text-xs opacity-60",
          button: "text-xs py-1 h-7",
          bookmarkBtn: "h-7 w-7",
          icon: "h-3.5 w-3.5",
          headerPadding: "p-3 pb-1",
          contentPadding: "px-3 py-1.5",
          footerPadding: "px-3 pb-3 pt-1.5",
          headerHeight: "h-[72px]",
          contentHeight: "h-[100px]",
          footerHeight: "h-[68px]",
          logoSize: "w-10 h-10",
        };
      case "row":
        return {
          card: "h-[240px] md:h-[140px] group border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300",
          container: "md:flex-row md:gap-4 gap-2",
          title:
            "text-base md:text-lg font-bold group-hover:text-primary transition-colors duration-300",
          badge: "text-xs md:text-sm",
          description:
            "text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 md:line-clamp-2",
          date: "text-xs opacity-70",
          button: "text-sm",
          bookmarkBtn: "h-9 w-9",
          icon: "h-4 w-4",
          headerPadding: "p-4 md:pb-2",
          contentPadding: "px-4 py-2",
          footerPadding: "p-4 md:pt-2",
          headerHeight: "md:h-full",
          contentHeight: "md:h-full",
          footerHeight: "md:h-full",
          logoSize: "w-12 h-12",
        };
      case "grid":
      default:
        return {
          card: "h-[320px] group border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md dark:hover:shadow-2xl dark:hover:shadow-neutral-900/20 transition-all duration-300",
          container: "gap-3",
          title:
            "text-lg font-bold group-hover:text-primary transition-colors duration-300",
          badge: "text-xs",
          description:
            "text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 min-h-[4.5rem] line-clamp-5",
          date: "text-xs opacity-70",
          button: "text-sm",
          bookmarkBtn: "h-10 w-10",
          icon: "h-4 w-4",
          headerPadding: "p-4 pb-2",
          contentPadding: "px-4 py-2",
          footerPadding: "px-4 pt-2 pb-4",
          headerHeight: "h-[100px]",
          contentHeight: "h-[140px]",
          footerHeight: "h-[80px]",
          logoSize: "w-16 h-16",
        };
    }
  }, [layoutType]);

  const getImageSrc = (base64: string) => {
    return base64?.trim()
      ? base64.startsWith("data:")
        ? base64
        : `data:image/png;base64,${base64}`
      : "";
  };

  useEffect(() => {
    // Show highlight animation
    setTimeout(() => setShowHighlight(true), 300);
  }, []);

  return (
    <motion.div layout {...standardAnimations} className={styles.container}>
      <Card className={cn(`overflow-hidden relative`, styles.card)}>
        {/* Decorative gradient highlight effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
        </div>

        {/* Status indicator for active parties */}
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`h-2 w-2 rounded-full bg-green-500 shadow-lg transition-all duration-300 group-hover:scale-125`}>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col h-full",
            layoutType === "row" ? "md:flex-row md:items-center" : "",
          )}
        >
          <CardHeader
            className={cn(
              styles.headerPadding,
              styles.headerHeight,
              layoutType === "row" ? "md:w-2/5 md:pr-0" : "",
              "transition-all duration-300",
            )}
          >
            {layoutType === "compact" ? (
              // Compact layout - Title and info stacked vertically
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 min-w-0 pr-2">
                  <CardTitle className={styles.title}>{item.nombrePartido}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "shrink-0 transition-all duration-300 w-fit bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold border-0",
                        styles.badge,
                      )}
                    >
                      {item.sigla}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "shrink-0 transition-all duration-300 w-fit",
                        styles.badge,
                      )}
                    >
                      <Users className="w-2 h-2 mr-1" />
                      Partido
                    </Badge>
                  </div>
                </div>
                {item.foto && (
                  <img
                    src={getImageSrc(item.foto)}
                    alt={`Logo de ${item.nombrePartido}`}
                    className={cn(styles.logoSize, "rounded-full object-cover border-2 dark:border-gray-700 border-gray-300 shadow-lg flex-shrink-0")}
                  />
                )}
              </div>
            ) : (
              // Grid and Row layouts - Title and logo side by side
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 min-w-0 pr-4">
                  <CardTitle className={styles.title}>{item.nombrePartido}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={cn("bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold border-0", styles.badge)}>
                      {item.sigla}
                    </Badge>
                    <Badge variant="secondary" className={cn(styles.badge)}>
                      <Users className="w-3 h-3 mr-1" />
                      Partido
                    </Badge>
                  </div>
                </div>
                
                {/* Logo del partido */}
                {item.foto && (
                  <div className="flex-shrink-0 relative">
                    <div className="relative group/logo">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full opacity-0 group-hover/logo:opacity-100 transition-all duration-300 scale-110 blur-sm" />
                      <div className="relative">
                        <img
                          src={getImageSrc(item.foto)}
                          alt={`Logo de ${item.nombrePartido}`}
                          className={cn(styles.logoSize, "rounded-full object-cover border-2 dark:border-gray-700 border-gray-300 shadow-xl transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:shadow-2xl group-hover/logo:border-blue-500")}
                        />
                        <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/0 group-hover/logo:ring-blue-400/60 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {layoutType === "row" && (
              <div className="flex items-center mt-1 text-muted-foreground">
                <Clock className="h-3 w-3 mr-1 opacity-70" />
                <span className={styles.date}>Fundado: {formatDate(item.fechaFundacion)}</span>
              </div>
            )}
          </CardHeader>

          <CardContent
            className={cn(
              "flex-grow",
              styles.contentPadding,
              styles.contentHeight,
              layoutType === "row" ? "md:w-2/5 md:px-0" : "",
              "transition-all duration-300",
            )}
          >
            {/* Lema section */}
            {item.lema && layoutType !== "compact" && (
              <div className="ml-4 mr-10 dark:bg-gradient-to-r dark:from-blue-950/60 dark:to-purple-950/60 rounded-lg p-2 dark:border-l-4 dark:border-blue-400 bg-blue-50 border-l-4 border-blue-200 mb-2">
                <p className={cn("h-full font-medium dark:text-blue-200 text-blue-800 italic", styles.description)}>
                  "{item.lema}"
                </p>
              </div>
            )}
            
            {/* Description */}
            {layoutType === "row" || layoutType === "compact" && (
              <p className={cn("text-muted-foreground leading-relaxed", styles.description)}>
                {item.descripcion}
              </p>
            )}

            {layoutType !== "row" && (
              <motion.div
                className="flex w-auto items-center mt-2 text-muted-foreground dark:bg-black/30 dark:border dark:border-gray-700/50 bg-gray-50 border border-gray-200 rounded-lg p-2 backdrop-blur-sm"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                
                <Clock
                  className={cn(
                    "mr-1",
                    layoutType === "compact" ? "h-3 w-3" : "h-4 w-4",
                  )}
                />
                
                <span className={styles.date}>Fundado: {formatDate(item.fechaFundacion)}</span>
              </motion.div>
            )}
          </CardContent>

          <CardFooter
            className={cn(
              "flex gap-2 items-center",
              styles.footerPadding,
              styles.footerHeight,
              layoutType === "row" ? "md:w-1/5 md:justify-end" : "",
              "transition-all duration-300 mt-auto",
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                key={`bookmark-${isBookmarked}-${layoutType}`}
              >
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size={layoutType === "compact" ? "sm" : "icon"}
                  onClick={() => onBookmark(item.id)}
                  className={cn(
                    "transition-all duration-300 flex-shrink-0",
                    styles.bookmarkBtn,
                    isBookmarked
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black shadow-xl border-0"
                      : "dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-yellow-500/10 dark:border-gray-600 dark:hover:border-yellow-500/50 text-gray-500 hover:text-yellow-500 hover:bg-yellow-100 border border-gray-300 hover:border-yellow-300",
                  )}
                >
                  <Bookmark
                    className={cn(
                      styles.icon,
                      "transition-transform duration-300",
                      isBookmarked ? "scale-110 fill-current" : "",
                    )}
                  />
                </Button>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 w-full">
              {/* Modal Dialog Trigger for Details */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size={layoutType === "compact" ? "sm" : "default"}
                    className={cn(
                      "flex-1",
                      styles.button,
                      "transition-all duration-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50",
                    )}
                  >
                    <Info className={cn("mr-1", styles.icon)} />
                    {layoutType === "compact" ? "Info" : "Detalles"}
                  </Button>
                </DialogTrigger>
                {/* Add your detail modal component here */}
              </Dialog>

              <Button
                asChild
                className={cn(
                  "flex-1 group overflow-hidden relative dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50",
                  styles.button,
                  "transition-all duration-300",
                )}
                variant="outline"
                size={layoutType === "compact" ? "sm" : "default"}
              >
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(item.nombrePartido)}+${encodeURIComponent(item.sigla)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center">
                    {layoutType === "compact" || layoutType === "row" ? "Más info" : "Más información"}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      {layoutType === "compact" ? (
                        <ArrowUpRight className={cn("ml-1", styles.icon)} />
                      ) : (
                        <ExternalLink
                          className={cn(
                            "ml-1.5",
                            styles.icon === "h-5 w-5" ? "h-4 w-4" : styles.icon,
                          )}
                        />
                      )}
                    </span>
                  </span>
                  <span className="absolute inset-0 bg-primary/10 dark:bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </a>
                
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default ItemCard;