"use client";

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Vote, 
  UserCircle, 
  BarChart3, 
  LogOut, 
  LogIn,
  Settings,
  Clock,
  CheckCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  if (pathname === "/auth/signin") {
    return null;
  }

  // Si no está autenticado, mostrar botón de login
  if (status === "unauthenticated") {
    return (
      <Button 
        variant="outline" 
        onClick={() => signIn()}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        Iniciar Sesión
      </Button>
    );
  }

  // Si está cargando
  if (status === "loading") {
    return (
      <Button variant="outline" size="icon" disabled>
        <User className="h-[1.2rem] w-[1.2rem] animate-pulse" />
      </Button>
    );
  }

  // Si está autenticado, mostrar menú de usuario
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Usuario"} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name || "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <Vote className="mr-2 h-4 w-4" />
          <span>Votar</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Estado de Voto</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>Resultados</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Clock className="mr-2 h-4 w-4" />
          <span>Historial</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Mi Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}