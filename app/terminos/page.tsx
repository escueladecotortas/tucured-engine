'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ============================================
// TUCU RED - TÉRMINOS Y CONDICIONES (ROBUSTOS)
// Basado en estándares de industria (DonWeb)
// Adaptado para modelo "Sitio Express"
// ============================================

export default function TerminosPage() {
    return (
        <main className="min-h-screen relative bg-magma text-white font-sans selection:bg-[#E85D4C] selection:text-white">
            
            {/* Background Overlay for Readability */}
            <div className="fixed inset-0 bg-[#050505]/90 z-0" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-3xl relative z-10">
                    <Link href="/alta" className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al alta
                    </Link>
                    <Image src="/tucured_logo.svg" alt="Tucu Red" width={100} height={30} className="h-6 w-auto opacity-50" />
                </div>
            </header>

            {/* Contenido Legal */}
            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">Términos y Condiciones de Uso</h1>
                <p className="text-[#D4A574] text-sm mb-8 font-mono">Última actualización: 07/02/2026</p>

                <div className="space-y-8 text-sm leading-relaxed text-white/70">

                    {/* 1. INTRODUCCIÓN */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">1. Aceptación del Servicio</h2>
                        <p>
                            Al contratar los servicios de <strong>Tucu Red</strong> ("EL PROVEEDOR"), usted ("EL CLIENTE") acepta plena y sin reservas los presentes Términos y Condiciones.
                            El servicio denominado "Sitio Express" consiste en la provisión de una plataforma web autogestionada, alojamiento en servidores y configuración de dominio.
                        </p>
                    </section>

                    {/* 2. PROPIEDAD INTELECTUAL */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">2. Propiedad Intelectual y Licencias</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Contenido del Cliente:</strong> Todo texto, imagen, logo o marca provista por EL CLIENTE es de su exclusiva propiedad. EL CLIENTE garantiza tener los derechos de uso sobre dicho material y exime a TUCU RED de cualquier reclamo de terceros.</li>
                            <li><strong>Código y Plataforma:</strong> El código fuente, diseño estructural, metodologías y software base de la plataforma son propiedad exclusiva de TUCU RED. Se otorga al CLIENTE una licencia de uso perpetua, no exclusiva e intransferible mientras el sitio permanezca activo en nuestros servidores.</li>
                        </ul>
                    </section>

                    {/* 3. PAGOS Y REEMBOLSOS */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">3. Pagos y Política de Reembolso</h2>
                        <p className="mb-2">
                            El servicio se activa mediante un <strong>PAGO ÚNICO</strong> de alta. Este pago cubre la configuración inicial, diseño y despliegue del sitio.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>No Reembolsable:</strong> Una vez entregado el sitio y aceptada la conformidad, el pago inicial no es reembolsable, dado que corresponde a horas de trabajo técnico ya ejecutadas.</li>
                            <li><strong>Sin Mensualidades Ocultas:</strong> TUCU RED no cobra mantenimiento mensual básico. Renovaciones de dominio propio o servicios premium adicionales se cotizarán por separado.</li>
                        </ul>
                    </section>

                    {/* 4. ALOJAMIENTO Y DISPONIBILIDAD */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">4. Alojamiento y Disponibilidad (SLA)</h2>
                        <p>
                            EL PROVEEDOR realizará sus mejores esfuerzos técnicos para mantener el servicio disponible 24x7. Sin embargo:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>El servicio podría interrumpirse temporalmente por mantenimiento técnico o causas de fuerza mayor ajenas a TUCU RED (fallas de proveedores de internet, catástrofes, etc.).</li>
                            <li>EL PROVEEDOR no se responsabiliza por lucro cesante o pérdidas comerciales derivadas de interrupciones del servicio.</li>
                        </ul>
                    </section>

                    {/* 5. POLÍTICA DE PRIVACIDAD */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">5. Política de Privacidad y Datos Personales</h2>
                        <p className="mb-2">
                            Conforme a la Ley 25.326 de Protección de Datos Personales (Argentina):
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Recolección:</strong> Los datos recolectados (Nombre, Email, WhatsApp) tienen como única finalidad la gestión técnica y administrativa del servicio.</li>
                            <li><strong>No Cesión:</strong> TUCU RED se compromete a NO ceder, vender ni compartir los datos de sus clientes con terceros, salvo obligación legal o judicial.</li>
                            <li><strong>Seguridad:</strong> Se aplican medidas técnicas para resguardar la información, aunque EL CLIENTE reconoce que ninguna transmisión por internet es 100% invulnerable.</li>
                        </ul>
                    </section>

                    {/* 6. PROHIBICIONES Y ANTI-SPAM */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">6. Uso Aceptable y Anti-Spam</h2>
                        <p className="mb-2">
                            Queda terminantemente prohibido utilizar el servicio para:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Alojar contenido ilegal, difamatorio, pornográfico o que incite a la violencia.</li>
                            <li>Realizar envío masivo de correos no solicitados (SPAM) o Phishing.</li>
                            <li>Distribuir malware o realizar ataques informáticos.</li>
                        </ul>
                        <p className="mt-2 text-white/50 text-xs">
                            La violación de estas normas facultará a TUCU RED a suspender o dar de baja el servicio de inmediato sin derecho a reclamo ni reembolso.
                        </p>
                    </section>

                    {/* 7. SOPORTE TÉCNICO */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">7. Alcance del Soporte</h2>
                        <p>
                            El soporte técnico incluido cubre exclusivamente:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Corrección de errores (bugs) de la plataforma.</li>
                            <li>Restauración del servicio en caso de caída.</li>
                            <li>Consultas sobre el uso del panel de administración (si corresponde).</li>
                        </ul>
                        <p className="mt-4">
                            <strong>Canales de Atención:</strong><br />
                            WhatsApp Oficial: <span className="text-[#E85D4C] font-mono">+54 9 381 413 2154</span><br />
                            Email: soporte@tucured.ar
                        </p>
                        <p className="mt-2 text-xs opacity-50">
                            Modificaciones de diseño, carga de contenido adicional o desarrollo de nuevas funcionalidades se considerarán trabajos extras y serán cotizados aparte.
                        </p>
                    </section>

                    {/* 8. JURISDICCIÓN */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-3 text-[#E85D4C]">8. Jurisdicción y Ley Aplicable</h2>
                        <p>
                            Para cualquier controversia derivada de la presente relación comercial, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la ciudad de <strong>San Miguel de Tucumán, Argentina</strong>, renunciando a cualquier otro fuero que pudiera corresponder.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 mt-12 mb-12">
                        <p className="text-xs text-white/40 text-center">
                            © 2026 Tucu Red - Agencia de Transformación Digital.<br />
                            San Miguel de Tucumán, Argentina.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
