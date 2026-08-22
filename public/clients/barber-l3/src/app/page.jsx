// Archivo: src/app/page.jsx
// v11.75-ELEGANT — Sovereign Landing Page with Centralized Booking Modal and Fricción Cero
"use client";
import React, { useState, useEffect } from "react";
import Hero from "@/components/sections/Hero";
import ServiceGrid from "@/components/sections/ServiceGrid";
import Footer from "@/components/layout/Footer";
import NexusScheduler from "@/components/widgets/NexusScheduler";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Silencia advertencias molestas del iframe/sandbox del simulador local
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const msg = args.join(" ");
      if (
        msg.includes("sandbox") ||
        msg.includes("iframe") ||
        msg.includes("allow-top-navigation") ||
        msg.includes("SecurityError")
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const msg = args.join(" ");
      if (
        msg.includes("sandbox") ||
        msg.includes("iframe") ||
        msg.includes("allow-top-navigation")
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Maneja la apertura del modal con soporte para categorías generales o servicios específicos
  const handleOpenModal = (serviceOrCategory = null, specialistId = null, specialistName = null) => {
    if (serviceOrCategory && typeof serviceOrCategory === "object") {
      setSelectedService({
        service: serviceOrCategory,
        specialistId,
        specialistName
      });
      setSelectedCategory(null);
    } else {
      setSelectedCategory(serviceOrCategory);
      setSelectedService(null);
    }
    setIsModalOpen(true);
  };

  // Restablece todos los estados al cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setSelectedService(null);
  };

  return (
    <main className="flex flex-col w-full overflow-x-hidden bg-[#FAF9F6] text-neutral-800">
      <Hero onOpenBooking={() => handleOpenModal(null)} />
      <ServiceGrid onOpenBooking={handleOpenModal} />
      <Footer />

      <NexusScheduler 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialCategoryId={selectedCategory} 
        initialService={selectedService}
      />
    </main>
  );
}