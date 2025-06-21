"use client";

import { ArrowRight, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function SubmitCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="w-full overflow-hidden my-12">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left space-y-2 lg:space-y-4 max-w-2xl"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            >
              Contribuye a nuestro proyecto
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-muted-foreground max-w-prose"
            >
              Crear un fork del repositorio y contribuir a nuestro proyecto. con sus 
              conocimientos de blockchain y programacion.
            </motion.p>
          </motion.div>
          <motion.div variants={itemVariants} className="w-full lg:w-auto">
            <Button asChild size="lg" className="w-full lg:w-auto text-base">
              <a
                href="https://github.com/socies-emi-uat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Github className="mr-2 h-5 w-5" />
                <span>Contribuir</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
