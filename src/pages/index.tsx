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

interface Category {
  title: string;
  items: PPartido[];
}

// load candidatos
const CONTRACT_ADDRESS = "0x3619F576Ec70d3a2B5147944A1CB4CF76b76a426"; // ruta al contrato inteligente.
const ABI = [
  "function getAdmin() view returns (address)"
];

const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

export default function Home() {
  const [cuenta, setCuenta] = useState<string>("");
  const [admin, setAdmin] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { data: session } = useSession();
  const [isLoadingMeta, setIsLoadingMeta] = useState<boolean>(true);


  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<PPartido[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!window.ethereum) return alert("MetaMask no detectado");
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        const userAddress = await signer.getAddress();
        const adminAddress = await contract.getAdmin();

        setCuenta(userAddress);
        setAdmin(adminAddress);
        setIsAdmin(userAddress.toLowerCase() === adminAddress.toLowerCase());
        setIsLoadingMeta(false);
      } catch (err) {
        console.error("Error al cargar candidatos:", err);
      }
    };


    const fetchDataPartidos = async () => {
      try {
        setIsLoading(true);

        const fetchedResourcesGeting = await fetchServicios();

        if (!fetchedResourcesGeting.data) {
          console.warn("fetchServicios retornó data = null");
          return;
        }
        // filtrar por status
        const fetchedResources = fetchedResourcesGeting.data.filter(resource => resource.estado === true);

        // Agrupar por categoría
        //
        const groupedCategories = fetchedResources.reduce<Record<string, PPartido[]>>((acc, resource) => {
          // Solo agrupar los servicios con status = true
          if (resource.estado && !EXCLUDED_CATEGORIES.includes(resource.sigla)) {
            if (!acc[resource.sigla]) {
              acc[resource.sigla] = [];
            }
            acc[resource.sigla].push(resource);
          }
          return acc;
        }, {});

        const formattedCategories: Category[] = Object.entries(groupedCategories).map(([title, items]) => ({
          title,
          items,
        }));
        
    

        // Filtrar y ordenar
        const eligibleItems = fetchedResources
          .filter((item) => !EXCLUDED_CATEGORIES.includes(item.sigla))
          .sort((a, b) => {
            const dateA = parseISO(a.fechaFundacion);
            const dateB = parseISO(b.fechaFundacion);

            if (!isValid(dateA)) return 1;
            if (!isValid(dateB)) return -1;

            return dateB.getTime() - dateA.getTime();
          });

        setCategories(formattedCategories);
        setFilteredItems(eligibleItems);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      } finally {
        setIsLoading(false);
      }
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
      <motion.div variants={itemVariants}>
        <Hero />
        <p className="text-sm text-muted-foreground mb-2">
          {cuenta ? (
            <>
              Cuenta conectada: {cuenta} {isAdmin && <strong className="text-green-600">(Admin)</strong>}
            </>
          ) : (
            "No se ha conectado ninguna cuenta"
          )}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="my-4">
        <ItemList items={filteredItems} categories={categories} isLoading={isLoading} />
      </motion.div>

      <motion.div variants={itemVariants} className="my-12">
          
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubmitCTA />
      </motion.div>
    </motion.div>
  );
}
