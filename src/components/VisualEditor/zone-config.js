// Archivo: frontend/src/components/VisualEditor/zone-config.js
// Datos estáticos de configuración — diccionario de zonas, grupos y propiedades.
// Extraído del monolito SmartZonePanel.jsx para cumplir Ley de 200 líneas.

import { Layout, Monitor, Layers, Grid, Image, MessageSquare, Phone } from 'lucide-react';

// Configuración visual de las zonas del editor
export const ZONE_VISUALS = {
    'navbar':      { label: 'Barra de Navegación', icon: Layout,       color: 'text-blue-400',   bg: 'bg-blue-500/10' },
    'hero':        { label: 'Sección Hero',         icon: Monitor,      color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    'experiencia': { label: 'Experiencia',           icon: Layers,       color: 'text-pink-400',   bg: 'bg-pink-500/10' },
    'reviews':     { label: 'Testimonios',           icon: MessageSquare,color: 'text-amber-400',  bg: 'bg-amber-500/10' },
    'servicios':   { label: 'Servicios',             icon: Grid,         color: 'text-green-400',  bg: 'bg-green-500/10' },
    'portfolio':   { label: 'Portfolio',             icon: Image,        color: 'text-purple-400', bg: 'bg-purple-500/10' },
    'contacto':    { label: 'Contacto',              icon: Phone,        color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
    'footer':      { label: 'Footer',               icon: Layout,       color: 'text-zinc-400',   bg: 'bg-zinc-500/10' }
};

// Configuración de grupos de edición y sus módulos
export const GROUP_CONFIG = {
    'navbar-brand': {
        label: 'Identidad de Marca',
        containerSelector: '.navbar',
        type: 'container',
        items: [
            { id: 'logo',  label: 'Logotipo',     type: 'image', selector: '.logo img' },
            { id: 'brand', label: 'Nombre Marca', type: 'text',  selector: '.logo' }
        ]
    },
    'navbar-menu': {
        label: 'Menú de Navegación',
        containerSelector: '.nav-links',
        type: 'container',
        items: [
            { id: 'links', label: 'Enlaces',      type: 'text',   selector: 'a' },
            { id: 'cta',   label: 'Botón Acción', type: 'button', selector: '.btn-book' }
        ]
    },
    'hero-main': {
        label: 'Contenido Principal',
        containerSelector: '.hero-content',
        type: 'container',
        items: [
            { id: 'subtitle', label: 'Subtítulo',     type: 'text',   selector: '.subtitle' },
            { id: 'title',    label: 'Título Grande',  type: 'text',   selector: 'h1' },
            { id: 'desc',     label: 'Descripción',    type: 'text',   selector: 'p' },
            { id: 'cta',      label: 'Botón Principal',type: 'button', selector: '.btn-hero' }
        ]
    },
    'hero-visual': {
        label: 'Visual Hero',
        containerSelector: '.hero-image',
        type: 'container',
        items: [{ id: 'image', label: 'Imagen Principal', type: 'image', selector: 'img' }]
    },
    'experiencia-header': {
        label: 'Encabezado',
        containerSelector: '#experiencia .container',
        type: 'container',
        items: [{ id: 'title', label: 'Título Sección', type: 'text', selector: 'h2' }]
    },
    'experiencia-items': {
        label: 'Items de Experiencia',
        containerSelector: '.features',
        type: 'container',
        items: [
            { id: 'item-card', label: 'Item / Tarjeta', type: 'container', selector: '.feat' },
            { id: 'icon',      label: 'Icono',           type: 'text',      selector: '.feat i' },
            { id: 'text',      label: 'Texto',           type: 'text',      selector: '.feat span' }
        ]
    },
    'reviews-content': {
        label: 'Contenido Reviews',
        containerSelector: '#reviews .container',
        type: 'container',
        items: [
            { id: 'title',  label: 'Título',       type: 'text',      selector: 'h2' },
            { id: 'card',   label: 'Tarjeta Review',type: 'container', selector: '.review-card' },
            { id: 'text',   label: 'Texto Opinión', type: 'text',      selector: '.review-text' },
            { id: 'author', label: 'Autor',         type: 'text',      selector: '.review-author' }
        ]
    },
    'servicios-grid': {
        label: 'Grilla de Servicios',
        containerSelector: '#servicios .container',
        type: 'container',
        items: [
            { id: 'title',    label: 'Título Sección',  type: 'text',      selector: 'h2' },
            { id: 'card',     label: 'Tarjeta Servicio',type: 'container', selector: '.service-card' },
            { id: 'image',    label: 'Imagen',           type: 'image',     selector: '.card-img img' },
            { id: 'card-title',label:'Nombre Servicio',  type: 'text',      selector: 'h3' },
            { id: 'card-desc',label: 'Descripción',      type: 'text',      selector: 'p' }
        ]
    },
    'portfolio-content': {
        label: 'Galería de Trabajos',
        containerSelector: '#portfolio .container',
        type: 'container',
        items: [
            { id: 'title',    label: 'Título Sección', type: 'text',           selector: 'h2' },
            { id: 'subtitle', label: 'Subtítulo',      type: 'text',           selector: '.subtitle-emphasis' },
            { id: 'carousel', label: 'Carrusel',       type: 'widget-carousel',selector: '.carousel-wrapper' }
        ]
    },
    'contacto-box': {
        label: 'Caja de Contacto',
        containerSelector: '#contacto .contact-box',
        type: 'container',
        items: [
            { id: 'title', label: 'Título',             type: 'text',   selector: 'h2' },
            { id: 'info',  label: 'Información',         type: 'text',   selector: 'p' },
            { id: 'links', label: 'Enlaces Contacto',    type: 'text',   selector: 'a' },
            { id: 'btn',   label: 'Botón Confirmar',     type: 'button', selector: '#btnConfirm' }
        ]
    },
    'footer-main': {
        label: 'Pie de Página',
        containerSelector: 'footer .container',
        type: 'container',
        items: [
            { id: 'text',     label: 'Texto Legal',      type: 'text', selector: 'p' },
            { id: 'sub-text', label: 'Texto Secundario', type: 'text', selector: '.sub-footer' }
        ]
    }
};

// Propiedades disponibles por tipo de módulo
export const MODULE_PROPS = {
    'text':           ['color','fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','textAlign','textTransform'],
    'image':          ['width','height','borderRadius','objectFit','boxShadow','filter','rotate','opacity'],
    'container':      ['backgroundColor','padding','gap','borderRadius','boxShadow','border','display','alignItems','justifyContent'],
    'button':         ['backgroundColor','color','padding','borderRadius','fontSize','fontWeight','fontFamily','boxShadow','border'],
    'widget-carousel':['width','height','padding','margin','borderRadius','boxShadow']
};

// Configuración de cada propiedad editable
export const PROP_CONFIG = {
    color:          { label: 'Color',         type: 'color' },
    backgroundColor:{ label: 'Fondo',         type: 'color' },
    fontSize:       { label: 'Tamaño',        type: 'size',   unit: 'px', min: 10, max: 100 },
    fontWeight:     { label: 'Peso',          type: 'select', options: ['300','400','500','600','700','800','900'] },
    fontFamily:     { label: 'Fuente',        type: 'font' },
    lineHeight:     { label: 'Interlineado',  type: 'slider', min: 0.8, max: 2.5, step: 0.1 },
    letterSpacing:  { label: 'Espaciado',     type: 'size',   unit: 'px', min: -2, max: 10, step: 0.5 },
    textAlign:      { label: 'Alineación',    type: 'select', options: ['left','center','right','justify'] },
    textTransform:  { label: 'Transform',     type: 'select', options: ['none','uppercase','lowercase','capitalize'] },
    width:          { label: 'Ancho',         type: 'size',   unit: '%', min: 0, max: 100 },
    height:         { label: 'Alto',          type: 'size',   unit: 'px', min: 0, max: 800 },
    borderRadius:   { label: 'Radio',         type: 'size',   unit: 'px', min: 0, max: 100 },
    objectFit:      { label: 'Ajuste',        type: 'select', options: ['cover','contain','fill'] },
    opacity:        { label: 'Opacidad',      type: 'slider', min: 0, max: 1, step: 0.1 },
    rotate:         { label: 'Rotación',      type: 'rotation' },
    padding:        { label: 'Relleno',       type: 'size',   unit: 'px' },
    gap:            { label: 'Espacio Items', type: 'size',   unit: 'px' },
    border:         { label: 'Borde',         type: 'border' },
    boxShadow:      { label: 'Sombra',        type: 'shadow' },
    filter:         { label: 'Filtros',       type: 'filter' },
    display:        { label: 'Display',       type: 'select', options: ['block','flex','grid','inline','none'] },
    alignItems:     { label: 'Alinear Items', type: 'select', options: ['flex-start','center','flex-end','stretch','baseline'] },
    justifyContent: { label: 'Justificar',    type: 'select', options: ['flex-start','center','flex-end','space-between','space-around','space-evenly'] }
};
