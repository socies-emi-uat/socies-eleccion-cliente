"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import Hero from "@/components/sections/hero";
import ItemList from "@/components/sections/items-list";
import { SubmitCTA } from "@/components/sections/cta-submit";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { PPartido } from "@/models/PPartido";
import { fetchServicios } from "@/hooks/use-readme";
import { isValid, parseISO } from "date-fns";
import { UserIcon } from "lucide-react";
import EstadoVoto from "@/features/estadoVoto/UserViewVoto";
import UserViewConfig from "@/features/configuraciones/UserViewConfig";


export default function PageEstado() {


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
            },
        },
    };

    return (
        <UserViewConfig />
    )
}
