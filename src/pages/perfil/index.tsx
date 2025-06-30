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
import UserInfoView from "@/features/perfil/UserInfoView";


export default function Home() {
    const [cuenta, setCuenta] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { data: session } = useSession();


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filteredItems, setFilteredItems] = useState<PPartido[]>([]);


    useEffect(() => {
        const fetchDataPartidos = async () => {
       
            
        };
        // fetchData();
        fetchDataPartidos();
    }, []);

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
        <motion.div
            className="container mx-auto max-w-7xl px-4 py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >

            <motion.div variants={itemVariants} className="my-4">
                <UserInfoView />
            </motion.div>

            <motion.div variants={itemVariants} className="my-12">

            </motion.div>

            <motion.div variants={itemVariants}>
                <SubmitCTA />
            </motion.div>
        </motion.div>
    );
}
