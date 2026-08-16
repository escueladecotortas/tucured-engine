import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Shield, Scale, FileText, CreditCard, Ban, AlertTriangle, Lock, RefreshCw, Mail, Eye } from 'lucide-react';

// Componente de Sección Legal Reutilizable
function LegalSection({ icon: Icon, iconColor, title, children }) {
    return (
        <section className="mb-8">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-white mb-4">
                <Icon className={`w-6 h-6 ${iconColor}`} />
                {title}
            </h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
                {children}
            </div>
        </section>
    );
}

export default function TermsAndConditions({ onBack }) {
    const [showPrivacy, setShowPrivacy] = useState(false);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-300 font-outfit selection:bg-[#E07547]/30 pt-24 pb-12 px-6">

            {/* Header Sticky */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-white tracking-wide">Tucu Red // Legales</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowPrivacy(false)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!showPrivacy ? 'bg-[#E07547] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                        Términos
                    </button>
                    <button
                        onClick={() => setShowPrivacy(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${showPrivacy ? 'bg-[#E07547] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                        Privacidad
                    </button>
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={showPrivacy ? 'privacy' : 'terms'}
                className="max-w-3xl mx-auto space-y-12"
            >
                {!showPrivacy ? (
                    <>
                        {/* TÉRMINOS Y CONDICIONES */}
                        <header className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E07547]/10 text-[#E07547] mb-4">
                                <Scale className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Términos y Condiciones</h1>
                            <p className="text-lg text-gray-400">Última actualización: 28 de Enero de 2026</p>
                        </header>

                        <div className="prose prose-invert prose-orange max-w-none bg-white/[0.02] p-8 rounded-3xl border border-white/5">

                            <LegalSection icon={Shield} iconColor="text-[#E07547]" title="1. Sobre el Servicio">
                                <p>
                                    <strong>Tucu Red</strong> ("la Plataforma", "nosotros") es un servicio de creación de presencia digital
                                    y visibilidad para negocios locales, operado tecnológicamente por <strong>Nexus OS</strong>.
                                </p>
                                <p>
                                    Al contratar nuestros servicios, usted acepta que Tucu Red actúa como <strong>proveedor de servicios web</strong>,
                                    no como intermediario comercial. La relación comercial entre el negocio y sus clientes finales es
                                    responsabilidad exclusiva del negocio.
                                </p>
                            </LegalSection>

                            <LegalSection icon={CreditCard} iconColor="text-[#D4AF37]" title="2. Planes, Pagos y Facturación">
                                <p><strong>Planes disponibles:</strong></p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Básico ($29.900 ARS):</strong> Landing page profesional, hosting incluido por 1 año.</li>
                                    <li><strong>Pro ($49.900 ARS):</strong> Multi-página, SEO local, actualizaciones mensuales.</li>
                                    <li><strong>Premium ($79.900 ARS):</strong> Todo incluido + soporte prioritario + analytics.</li>
                                </ul>
                                <p className="mt-4"><strong>Política de pagos:</strong></p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Todos los planes se abonan <strong>por adelantado</strong> mediante Mercado Pago.</li>
                                    <li>Los precios incluyen IVA cuando corresponda.</li>
                                    <li>La renovación anual es <strong>automática</strong> salvo cancelación con 30 días de anticipación.</li>
                                </ul>
                            </LegalSection>

                            <LegalSection icon={RefreshCw} iconColor="text-cyan-400" title="3. Política de Reembolsos">
                                <p>
                                    <strong>Antes del inicio del desarrollo:</strong> Reembolso total dentro de las 48 horas posteriores al pago.
                                </p>
                                <p>
                                    <strong>Una vez iniciado el desarrollo:</strong> No se realizan reembolsos parciales ni totales,
                                    ya que los recursos (diseño, código, hosting) ya fueron asignados al proyecto.
                                </p>
                                <p>
                                    <strong>Cancelación de renovación:</strong> Enviar email a <span className="text-[#E07547]">soporte@tucured.ar</span> con
                                    30 días de anticipación a la fecha de renovación.
                                </p>
                            </LegalSection>

                            <LegalSection icon={FileText} iconColor="text-purple-400" title="4. Propiedad Intelectual">
                                <p><strong>Lo que es suyo:</strong></p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Todas las fotos, textos y contenido que usted provea.</li>
                                    <li>El nombre de su negocio, logo y marca comercial.</li>
                                </ul>
                                <p className="mt-4"><strong>Lo que es nuestro:</strong></p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>El código fuente, componentes y tecnología de Nexus OS.</li>
                                    <li>Los templates, animaciones y estructuras de diseño.</li>
                                    <li>Usted recibe una <strong>licencia de uso</strong> mientras el servicio esté activo.</li>
                                </ul>
                            </LegalSection>

                            <LegalSection icon={Ban} iconColor="text-red-400" title="5. Uso Aceptable">
                                <p>Al usar Tucu Red, usted acepta <strong>NO</strong> utilizar la plataforma para:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Contenido ilegal, difamatorio o que viole derechos de terceros.</li>
                                    <li>Promoción de actividades fraudulentas o engañosas.</li>
                                    <li>Distribución de malware o intentos de hackeo.</li>
                                    <li>Cualquier actividad que viole las leyes argentinas vigentes.</li>
                                </ul>
                                <p className="mt-4 text-red-400">
                                    El incumplimiento de estas normas resultará en la <strong>suspensión inmediata</strong> del servicio sin reembolso.
                                </p>
                            </LegalSection>

                            <LegalSection icon={AlertTriangle} iconColor="text-yellow-400" title="6. Limitación de Responsabilidad">
                                <p>
                                    Tucu Red <strong>no garantiza</strong> resultados comerciales específicos (ventas, leads, tráfico)
                                    derivados del uso del sitio web creado.
                                </p>
                                <p>
                                    <strong>No somos responsables por:</strong>
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Interrupciones temporales del servicio por mantenimiento o fallas de terceros (hosting, DNS).</li>
                                    <li>Pérdida de datos si el cliente no mantiene respaldos propios.</li>
                                    <li>Daños indirectos o consecuentes derivados del uso o imposibilidad de uso del servicio.</li>
                                </ul>
                                <p className="mt-4">
                                    Nuestra responsabilidad máxima se limita al monto pagado por el servicio en los últimos 12 meses.
                                </p>
                            </LegalSection>

                            <LegalSection icon={RefreshCw} iconColor="text-green-400" title="7. Modificaciones a estos Términos">
                                <p>
                                    Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento.
                                    Los cambios serán notificados por email y/o publicados en esta página.
                                </p>
                                <p>
                                    El uso continuado del servicio después de la publicación de cambios constituye su aceptación de los mismos.
                                </p>
                            </LegalSection>

                            <LegalSection icon={Mail} iconColor="text-blue-400" title="8. Contacto y Jurisdicción">
                                <p><strong>Para consultas legales o comerciales:</strong></p>
                                <ul className="list-none space-y-2">
                                    <li>📧 Email: <span className="text-[#E07547]">legal@tucured.ar</span></li>
                                    <li>📱 WhatsApp: <span className="text-[#E07547]">+54 9 381 4132154</span></li>
                                    <li>📍 Domicilio legal: San Miguel de Tucumán, Argentina</li>
                                </ul>
                                <p className="mt-4">
                                    Cualquier disputa será resuelta exclusivamente por los <strong>tribunales competentes de la
                                        Provincia de Tucumán, República Argentina</strong>.
                                </p>
                            </LegalSection>

                        </div>
                    </>
                ) : (
                    <>
                        {/* POLÍTICA DE PRIVACIDAD */}
                        <header className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 mb-4">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Política de Privacidad</h1>
                            <p className="text-lg text-gray-400">Última actualización: 28 de Enero de 2026</p>
                        </header>

                        <div className="prose prose-invert prose-orange max-w-none bg-white/[0.02] p-8 rounded-3xl border border-white/5">

                            <LegalSection icon={Eye} iconColor="text-cyan-400" title="1. Datos que Recopilamos">
                                <p><strong>Datos que usted nos proporciona directamente:</strong></p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Nombre del negocio, dirección, teléfono y email.</li>
                                    <li>Fotografías del negocio y productos.</li>
                                    <li>Información de pago procesada por Mercado Pago (no almacenamos datos de tarjetas).</li>
                                </ul>
                                <p className="mt-4"><strong>Datos recopilados automáticamente:</strong></p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Dirección IP y tipo de navegador.</li>
                                    <li>Páginas visitadas y tiempo de navegación (analytics).</li>
                                    <li>Cookies necesarias para el funcionamiento del sitio.</li>
                                </ul>
                            </LegalSection>

                            <LegalSection icon={Shield} iconColor="text-green-400" title="2. Cómo Usamos sus Datos">
                                <p>Utilizamos su información para:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Crear y mantener su sitio web.</li>
                                    <li>Procesar pagos y enviar facturas.</li>
                                    <li>Contactarlo para soporte técnico o actualizaciones.</li>
                                    <li>Mejorar nuestros servicios mediante análisis agregados.</li>
                                </ul>
                                <p className="mt-4 text-green-400">
                                    <strong>Nunca vendemos ni compartimos sus datos con terceros para fines publicitarios.</strong>
                                </p>
                            </LegalSection>

                            <LegalSection icon={Lock} iconColor="text-purple-400" title="3. Seguridad de Datos">
                                <p>
                                    Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Encriptación SSL/TLS en todas las comunicaciones.</li>
                                    <li>Almacenamiento seguro en Firebase/Google Cloud.</li>
                                    <li>Acceso restringido solo a personal autorizado.</li>
                                    <li>Backups automáticos cifrados.</li>
                                </ul>
                            </LegalSection>

                            <LegalSection icon={FileText} iconColor="text-yellow-400" title="4. Sus Derechos (Ley 25.326)">
                                <p>
                                    Conforme a la Ley de Protección de Datos Personales de Argentina, usted tiene derecho a:
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Acceder</strong> a sus datos personales almacenados.</li>
                                    <li><strong>Rectificar</strong> información incorrecta o desactualizada.</li>
                                    <li><strong>Suprimir</strong> sus datos cuando ya no sean necesarios.</li>
                                    <li><strong>Oponerse</strong> al tratamiento de sus datos para ciertos fines.</li>
                                </ul>
                                <p className="mt-4">
                                    Para ejercer estos derechos, contacte a: <span className="text-cyan-400">privacidad@tucured.ar</span>
                                </p>
                            </LegalSection>

                            <LegalSection icon={RefreshCw} iconColor="text-orange-400" title="5. Retención de Datos">
                                <p>
                                    Conservamos sus datos mientras el servicio esté activo. Después de la cancelación:
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Datos de facturación: 10 años (requisito fiscal).</li>
                                    <li>Contenido del sitio: 30 días (período de gracia para reactivación).</li>
                                    <li>Datos de contacto: Eliminados a solicitud.</li>
                                </ul>
                            </LegalSection>

                            <LegalSection icon={Mail} iconColor="text-blue-400" title="6. Contacto">
                                <p><strong>Responsable de Tratamiento de Datos:</strong></p>
                                <ul className="list-none space-y-2">
                                    <li>📧 Email: <span className="text-cyan-400">privacidad@tucured.ar</span></li>
                                    <li>📍 Domicilio: San Miguel de Tucumán, Argentina</li>
                                </ul>
                                <p className="mt-4 text-sm text-gray-500">
                                    Ante la AAIP (Agencia de Acceso a la Información Pública) puede interponer reclamos
                                    en caso de considerar vulnerados sus derechos.
                                </p>
                            </LegalSection>

                        </div>
                    </>
                )}

                <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-sm text-gray-500">
                        Tucu Red es una marca operada tecnológicamente por Nexus OS. <br />
                        San Miguel de Tucumán, Argentina.
                    </p>
                </div>

            </motion.div>
        </div>
    );
}
