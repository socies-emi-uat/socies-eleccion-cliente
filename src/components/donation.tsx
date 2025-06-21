import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Coffee, Heart, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Donation() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="
          fixed bottom-4 right-4 z-50 
          flex items-center gap-2 
          rounded-full p-4 
          bg-[#ffe433]/90 hover:bg-[#ffe433] 
          text-black font-semibold 
          transition-all duration-300 ease-in-out
          hover:scale-105 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-[#ffe433] focus:ring-opacity-50
          group
        "
      >
        <Image
          src="/BuyMyACoffee.svg"
          alt="Buy me a coffee"
          width={30}
          height={30}
          className="transition-transform duration-300 ease-in-out group-hover:rotate-12"
        />
        <span className="hidden sm:inline">Comprame un cafe</span>
      </Button>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#ffe433]/20 to-yellow-100/30 p-6">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Coffee className="h-5 w-5 text-[#ffe433]" />
                Apoya mi trabajo
              </DialogTitle>
              <DialogDescription className="text-base">
                Escanea el QR para enviar una donación por Yape o utiliza el botón para Buy Me a Coffee
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex flex-col items-center justify-center p-6 pt-2">
            {/* QR Code with responsive container */}
            <div className="relative w-full max-w-[250px] aspect-square mb-6 mt-2 mx-auto">
              <div className="absolute inset-0 bg-white rounded-lg shadow-md p-3 flex items-center justify-center">
                <Image
                  src="/yape.png" // Replace with your actual Yape QR image
                  alt="Código QR de Yape"
                  layout="fill"
                  objectFit="contain"
                  className="p-2"
                />
              </div>
            </div>

            {/* Information below QR */}
            <div className="text-center mb-6 space-y-1">
              <p className="font-medium">También puedes donar con:</p>
              <p className="text-sm text-muted-foreground">Yape: +591 67584475</p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href="https://buymeacoffee.com/krypton612"
                target="_blank"
                className="w-full"
              >
                <Button 
                  className="w-full bg-[#ffe433] hover:bg-[#efd000] text-black font-medium"
                >
                  <Image
                    src="/BuyMyACoffee.svg"
                    alt="Buy me a coffee"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Buy Me a Coffee
                  <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
                </Button>
              </Link>
              
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Cerrar
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
          
          {/* Hearts decoration */}
          <div className="absolute -z-10 top-12 -left-6 text-pink-500/20">
            <Heart className="h-24 w-24" />
          </div>
          <div className="absolute -z-10 bottom-12 -right-6 text-pink-500/10">
            <Heart className="h-16 w-16" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}