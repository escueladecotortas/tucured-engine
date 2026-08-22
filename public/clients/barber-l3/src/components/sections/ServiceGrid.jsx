// Archivo: src/components/sections/ServiceGrid.jsx
// v11.75-ELEGANT — Boutique Service Selection list synced with Central Booking Modal
"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { getSpecialists } from "@/lib/firebase/specialists";
import { getServices } from "@/lib/firebase/services";
import { getCategories } from "@/lib/firebase/categories";
import ServiceCard from "./ServiceCard";
import { mapCategoryForScheduler, getGroupedHours } from "@/lib/utils/helpers";

const fetchSpecialists = () => getSpecialists();
const fetchServices = () => getServices();
const fetchCategories = () => getCategories();

export default function ServiceGrid({ onOpenBooking }) {
  const { data: specialists, error: specError } = useSWR("specialists-grid", fetchSpecialists);
  const { data: allServices, error: servError } = useSWR("services-grid", fetchServices);
  const { data: categories, error: catError } = useSWR("categories-grid", fetchCategories);

  const [hydratedData, setHydratedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (specialists && allServices && categories) {
      const activeSpecs = specialists.filter(s => s.status === 'active');
      const hierarchy = { 'barberia': 1, 'pestanas': 2, 'unas': 3 };
      const result = [];

      // 1. Normalización robusta de categorías de servicios
      const services = allServices
        .filter(s => s.name && (s.active === true || s.status === 'active'))
        .map(s => {
          let cat = s.category || 'Otros';
          const n = s.name.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          
          if (!s.category || s.category === 'Otros') {
            if (['semipermanente', 'softgel', 'kapping', 'manicuria', 'unas'].some(k => n.includes(k))) cat = 'Uñas';
            else if (['perfilado', 'lifting', 'pestana', 'ceja'].some(k => n.includes(k))) cat = 'Cejas y Pestañas';
            else if (['corte', 'barba'].some(k => n.includes(k))) cat = 'Barbería';
          }
          
          const catLower = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (catLower.includes('una')) cat = 'Uñas';
          else if (catLower.includes('pestana') || catLower.includes('ceja')) cat = 'Cejas y Pestañas';
          else if (catLower.includes('barber') || catLower.includes('corte')) cat = 'Barbería';
          
          return { ...s, category: cat };
        });

      // 2. Mapeo dinámico y asignación de especialistas (con fallback)
      const specServicesMap = {};
      activeSpecs.forEach(spec => {
        specServicesMap[spec.id] = [];
      });

      services.forEach(service => {
        let matchedSpecs = activeSpecs.filter(spec => spec.serviceIds?.includes(service.id));
        
        if (matchedSpecs.length === 0) {
          const catLower = (service.category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const nameLower = (service.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          
          let specId = 'YfasLb0kwkXFuVwatvZY'; // Micaela Sánchez por defecto (Cejas y Pestañas)
          if (catLower.includes('una') || ['semipermanente', 'softgel', 'kapping', 'manicuria', 'unas'].some(k => nameLower.includes(k))) {
            specId = 'rgd1lzY3pqT0eIa7TBX7'; // Victoria García (Uñas)
          } else if (catLower.includes('barber') || catLower.includes('corte') || ['corte', 'barba'].some(k => nameLower.includes(k))) {
            specId = 'InT4FMYqtlAtpf0tseM0'; // Enzo Martínez (Barbería)
          }
          
          const targetSpec = activeSpecs.find(s => s.id === specId);
          if (targetSpec) {
            matchedSpecs = [targetSpec];
          } else if (activeSpecs.length > 0) {
            matchedSpecs = [activeSpecs[0]];
          }
        }

        matchedSpecs.forEach(spec => {
          if (specServicesMap[spec.id]) {
            specServicesMap[spec.id].push(service);
          }
        });
      });

      // 3. Construcción del resultado final estructurado para la grilla
      activeSpecs.forEach(spec => {
        const specServices = specServicesMap[spec.id] || [];
        if (specServices.length === 0) return;

        const rawCategory = specServices[0].category || 'General';
        const catObj = categories.find(c => c.name.toLowerCase() === rawCategory.toLowerCase());
        const visualTitle = catObj?.slug?.toUpperCase() || rawCategory.toUpperCase();
        const categoryKey = visualTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]/g, '');

        // Formatea el nombre completo del especialista para mostrarlo correctamente
        const fullName = `${spec.firstName || ""} ${spec.lastName || ""}`.trim() || spec.displayName || "Profesional";
        const firstNameOnly = fullName.split(' ')[0];
        const hoursObj = getGroupedHours(spec.workingHours);

        result.push({
          id: spec.id,
          firstNameOnly,
          specialistName: fullName,
          visualTitle,
          categoryKey,
          hoursObj,
          services: specServices.map(s => ({
            id: s.id,
            name: s.name,
            price: s.price,
            duration: s.duration,
            category: s.category || rawCategory,
            mostrarPrecioWeb: s.mostrarPrecioWeb !== false,
            mostrarDuracionWeb: s.mostrarDuracionWeb !== false
          }))
        });
      });

      result.sort((a, b) => {
        const slugA = a.categoryKey.toLowerCase();
        const slugB = b.categoryKey.toLowerCase();
        const getRank = (slug) => {
          if (hierarchy[slug]) return hierarchy[slug];
          if (slug.includes('barber')) return 1;
          if (slug.includes('pesta')) return 2;
          if (slug.includes('una')) return 3;
          return 99;
        };
        return getRank(slugA) - getRank(slugB);
      });

      setHydratedData(result);
      setLoading(false);
    }
  }, [specialists, allServices, categories]);

  // Transfiere el servicio seleccionado, especialista asignado y su nombre al gestor de la Landing
  const handleServiceSelect = (service, specialistId, specialistName) => {
    onOpenBooking(service, specialistId, specialistName);
  };

  if (!mounted) return <div className="min-h-screen bg-[#FAF9F6]" />;

  if (specError || servError || catError) {
    return (
      <div className="p-4 bg-red-50 text-red-800 text-xs font-bold uppercase max-w-3xl mx-auto rounded border border-red-200">
        Error de sincronización con el Kernel de Datos.
      </div>
    );
  }

  return (
    <section id="servicios-engine" className="px-4 max-w-3xl mx-auto pt-10 pb-16">
      <h2 className="text-xl md:text-2xl font-semibold text-[#800000] text-center uppercase tracking-[0.3em] mb-10 font-hanken">
        ¡RESERVÁ TU TURNO!
      </h2>
      <div className="flex flex-col gap-6">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="p-6 rounded-lg border-l-4 border-l-neutral-300 animate-pulse bg-white/80 shadow-sm border border-neutral-200/40">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-32 bg-neutral-200 rounded"></div>
                <div className="h-4 w-16 bg-neutral-200 rounded"></div>
              </div>
              <div className="h-4 w-48 mb-6 bg-neutral-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-12 w-full bg-neutral-200 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          hydratedData.map((spec) => (
            <ServiceCard 
              key={spec.id} 
              spec={spec} 
              onServiceSelect={handleServiceSelect} 
            />
          ))
        )}
      </div>
    </section>
  );
}