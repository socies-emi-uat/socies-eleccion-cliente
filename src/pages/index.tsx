"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import Hero from "@/components/sections/hero";
import ItemList from "@/components/sections/items-list";
import { SubmitCTA } from "@/components/sections/cta-submit";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

// load candidatos
const CONTRACT_ADDRESS = "0x3619F576Ec70d3a2B5147944A1CB4CF76b76a426"; // ruta al contrato inteligente.
const ABI = [
  "function getAdmin() view returns (address)"
];

export default function Home() {
  const [cuenta, setCuenta] = useState<string>("");
  const [admin, setAdmin] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: session } = useSession();

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
        setIsLoading(false);
      } catch (err) {
        console.error("Error al cargar candidatos:", err);
      }
    };

    // fetchData();
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
        <ItemList items={[]} categories={[]} isLoading={isLoading} />
      </motion.div>

      <motion.div variants={itemVariants} className="my-12">
          
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubmitCTA />
      </motion.div>
    </motion.div>
  );
}
