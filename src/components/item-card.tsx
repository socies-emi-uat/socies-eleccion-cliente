import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ExternalLink, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

export interface Candidato {
  id_candidato: number;
  nombre: string;
  apellidos: string;
  partido: string;
  logo_partido: string;
  fecha_creacion: string;
}

type LayoutType = "compact" | "grid" | "row";

interface ItemCardProps {
  item: Candidato;
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

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isBookmarked,
  onBookmark,
  layoutType = "grid",
}) => {
  const styles = useMemo(() => {
    switch (layoutType) {
      case "row":
        return "flex-row items-center";
      case "compact":
        return "flex-col h-[200px]";
      default:
        return "flex-col h-[260px]";
    }
  }, [layoutType]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className={`overflow-hidden group border transition-all duration-300 hover:shadow-md ${styles}`}>
        <CardHeader className="flex items-start gap-2 p-4 pb-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{item.nombre} {item.apellidos}</CardTitle>
            <Badge variant="secondary" className="mt-1">{item.partido}</Badge>
          </div>
          {item.logo_partido && (
            <img src={item.logo_partido} alt="Logo partido" className="h-10 w-10 rounded-md object-contain" />
          )}
        </CardHeader>

        <CardContent className="px-4 py-2 text-sm text-muted-foreground">
          Fecha de registro: {formatDate(item.fecha_creacion)}
        </CardContent>

        <CardFooter className="flex gap-2 items-center px-4 pb-4 mt-auto">
          <Button
            onClick={() => onBookmark(item.id_candidato)}
            variant={isBookmarked ? "default" : "outline"}
            size="icon"
            className={cn(
              isBookmarked
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <a
              href={`https://www.google.com/search?q=${item.nombre}+${item.apellidos}+${item.partido}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Más información
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
