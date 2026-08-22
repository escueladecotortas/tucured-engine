// Archivo: netlify/functions/notify-appointment.js

export default async (req, context) => {
  // Cabeceras CORS robustas para soporte preflight en producción
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Interceptar solicitudes de preflight OPTIONS inmediatamente
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  // Validar método POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { to, appointmentData } = body;

    // Validación de parámetros obligatorios
    if (!to || !Array.isArray(to) || to.length === 0 || !appointmentData) {
      return new Response(JSON.stringify({ error: 'Parámetros inválidos. Se requiere "to" (array) y "appointmentData" (objeto).' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Extracción tolerante a fallos de los datos del cliente
    const clientName = typeof appointmentData.cliente === 'object'
      ? `${appointmentData.cliente.nombre || ''} ${appointmentData.cliente.apellido || ''}`.trim() || appointmentData.cliente.email || 'Cliente'
      : appointmentData.cliente || 'Cliente';
    
    const clientPhone = typeof appointmentData.cliente === 'object' 
      ? appointmentData.cliente.celular || '' 
      : '';

    // Formatear fecha al estándar del salón
    const rawDate = appointmentData.fecha || '';
    const formattedDate = rawDate.includes('-')
      ? rawDate.split('-').reverse().join('/')
      : rawDate;

    // Generar enlace interactivo de WhatsApp si el teléfono está presente
    let waLink = '';
    if (clientPhone) {
      const cleanedPhone = String(clientPhone).replace(/\D/g, '');
      const finalPhone = cleanedPhone.startsWith('54')
        ? (cleanedPhone.length === 12 && !cleanedPhone.startsWith('549') ? '549' + cleanedPhone.substring(2) : cleanedPhone)
        : '549' + cleanedPhone;
      
      const messageText = `Hola ${clientName}, te escribo de Nexus Barber L3 por tu turno de ${String(appointmentData.servicio || '').toUpperCase()} el día ${formattedDate} a las ${appointmentData.hora || ''}hs.`;
      waLink = `https://wa.me/${finalPhone}?text=${encodeURIComponent(messageText)}`;
    }

    // Construcción de la plantilla HTML Boutique Premium (Acentos #800000)
    const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; padding: 45px 20px; color: #1A1A1A; line-height: 1.6;">
  <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #EAEAEA; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.015);">
    
    <!-- Cabecera -->
    <div style="text-align: center; margin-bottom: 35px; border-bottom: 1px solid #FAF9F6; padding-bottom: 25px;">
      <h2 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 4px; color: #1A1A1A; text-transform: uppercase;">Nexus Barber L3</h2>
      <p style="margin: 6px 0 0 0; font-size: 10px; font-weight: bold; letter-spacing: 2.5px; color: #800000; text-transform: uppercase;">Estética Unisex & Boutique</p>
    </div>

    <!-- Título -->
    <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1A1A1A; margin-top: 0; margin-bottom: 25px; text-align: center;">
      Confirmación de Turno Agendado
    </h3>

    <!-- Detalles del Turno -->
    <div style="background-color: #FAF9F6; border: 1px solid #ECEBE6; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid #EAE9E2;">
          <td style="padding: 12px 0; font-weight: bold; color: #800000; width: 35%; text-transform: uppercase; letter-spacing: 0.5px;">Cliente:</td>
          <td style="padding: 12px 0; color: #1A1A1A; font-weight: 600;">${clientName}</td>
        </tr>
        ${clientPhone ? `
        <tr style="border-bottom: 1px solid #EAE9E2;">
          <td style="padding: 12px 0; font-weight: bold; color: #800000; text-transform: uppercase; letter-spacing: 0.5px;">Teléfono:</td>
          <td style="padding: 12px 0; color: #1A1A1A; font-weight: 600; font-family: monospace;">+${clientPhone}</td>
        </tr>
        ` : ''}
        <tr style="border-bottom: 1px solid #EAE9E2;">
          <td style="padding: 12px 0; font-weight: bold; color: #800000; text-transform: uppercase; letter-spacing: 0.5px;">Servicio:</td>
          <td style="padding: 12px 0; color: #1A1A1A; font-weight: 600; text-transform: uppercase;">${appointmentData.servicio || 'Servicio General'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #EAE9E2;">
          <td style="padding: 12px 0; font-weight: bold; color: #800000; text-transform: uppercase; letter-spacing: 0.5px;">Fecha:</td>
          <td style="padding: 12px 0; color: #1A1A1A; font-weight: 600;">${formattedDate}</td>
        </tr>
        <tr style="border-bottom: 1px solid #EAE9E2;">
          <td style="padding: 12px 0; font-weight: bold; color: #800000; text-transform: uppercase; letter-spacing: 0.5px;">Hora:</td>
          <td style="padding: 12px 0; color: #1A1A1A; font-weight: 600; font-family: monospace;">${appointmentData.hora || ''} HS</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #800000; text-transform: uppercase; letter-spacing: 0.5px;">Especialista:</td>
          <td style="padding: 12px 0; color: #1A1A1A; font-weight: 600; text-transform: uppercase;">${appointmentData.profesional || 'No asignado'}</td>
        </tr>
      </table>
    </div>

    <!-- Botón de Acción Rápida -->
    ${waLink ? `
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${waLink}" 
         target="_blank"
         style="display: inline-block; background-color: #800000; color: #FFFFFF; font-size: 11px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 10px rgba(128,0,0,0.15); transition: background-color 0.2s;">
        Contactar por WhatsApp
      </a>
    </div>
    ` : ''}

    <!-- Pie de página informativo -->
    <p style="margin: 0; font-size: 10px; text-align: center; color: #9C9C9C; font-weight: 500; letter-spacing: 0.2px;">
      Aviso automático del sistema de reservas. Acceda al búnker administrativo para gestionar cancelaciones o reajustes.
    </p>

  </div>
  
  <div style="text-align: center; margin-top: 30px; font-size: 9px; color: #A0A0A0; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
    © 2026 Nexus Barber L3 UNISEX. TODOS LOS DERECHOS RESERVADOS.
  </div>
</div>
`;

    // Leer clave de API de Resend del entorno
    const apiKey = process.env.RESEND_API_KEY || (typeof Netlify !== 'undefined' && Netlify.env ? Netlify.env.get("RESEND_API_KEY") : null);
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Configuración faltante: RESEND_API_KEY no definida.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Despacho a través de la API REST nativa de Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Nexus Barber L3 Unisex <turnos@lafachadaunisex.ar>',
        to,
        subject: `Confirmación de Turno: ${clientName} - ${String(appointmentData.servicio || '').toUpperCase()}`,
        html: htmlContent
      })
    });

    if (!resendResponse.ok) {
      const errorDetails = await resendResponse.json();
      return new Response(JSON.stringify({ error: 'Error en servicio externo de correos (Resend).', detail: errorDetails }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const responseData = await resendResponse.json();
    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[NOTIFY] Error crítico procesando la notificación:', error);
    return new Response(JSON.stringify({ error: 'Error interno de servidor procesando la petición.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// Configuración de enrutamiento moderno en código para Netlify
export const config = {
  path: ["/api/notify-appointment", "/.netlify/functions/notify-appointment"]
};

