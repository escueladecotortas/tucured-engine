// Archivo: src/components/leads/useManualProspect.js
import { useState } from 'react';
import { MAPS_URL_REGEX, formatWhatsApp } from './ProspectFormUtils';

export const useManualProspect = (formData, onChange, onSubmit) => {
  const [hasMaps, setHasMaps] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleCategoryChange = (newCategory) => {
    onChange({
      ...formData,
      category: newCategory,
      subcategory: "", 
    });
    if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.instagram?.trim()) newErrors.instagram = "El handle de Instagram es obligatorio";

    if (hasMaps) {
      if (!formData.mapsUrl?.trim()) {
        newErrors.mapsUrl = "La URL de Google Maps es obligatoria";
      } else if (!MAPS_URL_REGEX.test(formData.mapsUrl.trim())) {
        newErrors.mapsUrl = "URL inválida. Debe ser de Google Maps";
      }
    } else {
      if (!formData.category) newErrors.category = "Seleccione un rubro";
      if (!formData.city) newErrors.city = "Seleccione una ciudad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    let dataToSubmit = { ...formData };
    if (formData.whatsapp) {
      const formatted = formatWhatsApp(formData.whatsapp);
      dataToSubmit.whatsapp = formatted;
      onChange(dataToSubmit);
    }
    if (typeof onSubmit === 'function') {
      onSubmit(dataToSubmit, hasMaps);
    }
  };

  return {
    hasMaps,
    setHasMaps,
    errors,
    handleChange,
    handleCategoryChange,
    handleSubmit
  };
};
