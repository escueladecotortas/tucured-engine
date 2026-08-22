// Archivo: src/app/admin/manual/data/manualData.js
// Diccionario estático estructurado con el Manual de Operaciones de Nexus Barber L3.
// EXENTO del límite de 200 líneas por ser un diccionario de datos estáticos.

export const MANUAL_DATA = [
  {
    id: "landing",
    title: "1. TURNERO DE CLIENTES",
    introduction: "El sistema de turnos público está diseñado para que los clientes del salón puedan reservar de forma intuitiva, rápida y en pocos pasos, optimizando los campos requeridos para evitar el abandono de reservas.",
    subsections: [
      {
        subtitle: "A. FLUJO DE RESERVA EN 3 PASOS SIMPLES Y CONFIRMACIÓN",
        items: [
          "El proceso de reserva del cliente avanza de forma secuencial y guiada.",
          "Paso 1: Selección de Servicio y Profesional. El cliente elige el rubro (Barbería, Uñas, Cejas y Pestañas), el servicio específico y el profesional que lo atenderá (o selecciona 'Cualquier Profesional' para mayor flexibilidad de horarios). Los profesionales se cargan automáticamente desde la base de datos.",
          "Paso 2: Selección de Fecha y Hora. El cliente selecciona una fecha disponible en el calendario interactivo. Al elegir el día, el sistema consulta en tiempo real las horas libres de ese profesional, excluyendo turnos ya reservados y horarios de descanso.",
          "Paso 3: Formulario de Contacto. El cliente ingresa su Nombre, Apellido, Celular (WhatsApp) y notas opcionales.",
          "Paso 4: Ticket de Reserva Exitosa. Tras completar la reserva, se muestra en pantalla un ticket detallando el servicio, profesional asignado, precio y fecha/hora elegida, acompañado de un agradable aviso sonoro de confirmación."
        ]
      },
      {
        subtitle: "B. VALIDACIÓN AUTOMÁTICA DE FERIADOS",
        items: [
          "El motor de reserva controla las fechas disponibles en el calendario interactivo.",
          "Al desplegar el calendario para el cliente, el sistema consulta la lista de feriados nacionales configurados en el panel de administración.",
          "Si un día coincide con un feriado bloqueado, dicha fecha aparece deshabilitada automáticamente, impidiendo que el cliente la seleccione."
        ]
      },
      {
        subtitle: "C. LÍMITE DE RESERVAS ACTIVAS POR CLIENTE",
        items: [
          "Para evitar que se bloquee el calendario con reservas duplicadas o erróneas:",
          "Antes de procesar y confirmar un nuevo turno, el sistema verifica las citas activas asociadas al número de WhatsApp del cliente.",
          "Si el cliente posee 2 o más turnos en estado pendiente o confirmado, el sistema impide una nueva reserva, invitándolo cordialmente a completar o cancelar alguno de sus turnos vigentes para poder agendar uno nuevo."
        ]
      }
    ]
  },
  {
    id: "admin",
    title: "2. PANEL DE ADMINISTRACIÓN Y CONTROL",
    introduction: "El panel administrativo de Nexus Barber L3 es la central operativa desde la cual el personal gestiona la agenda de turnos, modifica las configuraciones del local y realiza el seguimiento de cada cita.",
    subsections: [
      {
        subtitle: "A. ACCESO SEGURO MEDIANTE VENTANA EMERGENTE (POP-UP)",
        items: [
          "Para garantizar la compatibilidad con todos los navegadores móviles y de escritorio sin errores de redirección:",
          "El sistema utiliza el método de inicio de sesión con Google mediante ventana emergente.",
          "Al presionar el botón de ingreso, se solicita seleccionar manualmente la cuenta de Google, evitando el inicio automático no deseado de sesiones anteriores.",
          "Si el usuario cierra la ventana de ingreso o hay una interrupción de red, el sistema muestra un aviso de advertencia amigable sin interrumpir la navegación."
        ]
      },
      {
        subtitle: "B. ACCESO RESTRINGIDO E INGRESO AUTORIZADO",
        items: [
          "El acceso a la consola de administración está restringido exclusivamente a las cuentas de correo electrónico previamente autorizadas en el sistema.",
          "Cada integrante del equipo del salón debe ingresar con su propia cuenta de Google individual en lugar de compartir un único acceso.",
          "El uso de cuentas separadas garantiza la trazabilidad total de la operación: permite saber con precisión quién reservó, reprogramó o canceló un turno, previniendo errores cruzados.",
          "Este esquema protege la información confidencial del negocio, limita el acceso según los roles definidos y resguarda la seguridad general de la base de datos de clientes."
        ]
      },
      {
        subtitle: "C. AGENDA DE TURNOS EN TIEMPO REAL",
        items: [
          "La pantalla principal de control muestra la agenda organizada del salón con todas las citas históricas y del día.",
          "Detalla claramente el nombre del cliente, servicio solicitado, profesional asignado, valor y estado actual de la cita (pendiente, confirmado, cancelado).",
          "Cuenta con filtros rápidos por Servicio, Estado y Profesional para facilitar la búsqueda en días de alta demanda."
        ]
      },
      {
        subtitle: "D. AVISOS SONOROS DE NUEVOS TURNOS",
        items: [
          "El panel mantiene un monitoreo en tiempo real de nuevos turnos que ingresan en estado pendiente.",
          "Para evitar que el sonido de alerta se repita de forma redundante con turnos ya conocidos, el navegador guarda de manera segura el ID del último turno que ya fue notificado.",
          "Cuando entra una reserva nueva, el panel reproduce un discreto sonido de campana y despliega una notificación flotante. El navegador controla internamente el bloqueo de reproducción automática para evitar errores visuales."
        ]
      },
      {
        subtitle: "E. INDICADOR DE CONEXIÓN A INTERNET (LIVE/OFFLINE)",
        items: [
          "El menú lateral de administración incluye un monitor dinámico para asegurar la correcta comunicación con la base de datos:",
          "Detecta inmediatamente si el dispositivo del administrador cuenta con acceso activo a internet.",
          "Si hay conexión, muestra en el pie del menú la etiqueta 'EN LÍNEA' en verde pulsante.",
          "Si se pierde la señal de internet, cambia de inmediato a 'SIN CONEXIÓN' en rojo, advirtiendo al personal que los cambios realizados localmente no se guardarán en la nube hasta que se reestablezca la señal."
        ]
      }
    ]
  },
  {
    id: "whatsapp",
    title: "3. COMUNICACIÓN POR WHATSAPP Y ENLACES MANUALES",
    introduction: "El canal primario de confirmación y contacto con los clientes es WhatsApp. Se utiliza un sistema manual asistido para dar una atención personalizada y evitar sanciones de Meta.",
    subsections: [
      {
        subtitle: "A. MODAL DE EDICIÓN Y ENVÍO INDEPENDIENTE",
        items: [
          "Al cambiar el estado de un turno (confirmar o cancelar) desde el panel administrativo:",
          "1. El sistema abre un cuadro de diálogo donde se previsualiza la plantilla de texto oficial.",
          "2. Traduce las etiquetas de forma automática e inserta los datos de la reserva, permitiendo al administrador realizar ediciones manuales y agregar comentarios personalizados.",
          "3. Al presionar 'Enviar Mensaje', el sistema genera el enlace directo wa.me y abre WhatsApp Web o la aplicación con el número del cliente y el texto pre-redactado, listos para enviar en un click."
        ]
      },
      {
        subtitle: "B. FORMATEO INTELIGENTE DE NÚMEROS TELEFÓNICOS",
        items: [
          "Para garantizar que los enlaces de WhatsApp no fallen, el sistema limpia y da formato correcto a los celulares de forma transparente:",
          "Limpia guiones, espacios, paréntesis y caracteres especiales, dejando solo números.",
          "Para celulares de Argentina (prefijo 54), detecta si falta el identificador móvil '9' (por ejemplo, números que inician directamente con 5411) e inserta el '9' en la posición correcta (54911...).",
          "Para números locales que ingresan con '15', remueve la cabecera '15' y antepone el prefijo internacional unificado '549'."
        ]
      },
      {
        subtitle: "C. COMPLEMENTACIÓN DINÁMICA DE TEXTO",
        items: [
          "Las plantillas de mensaje permiten colocar palabras clave entre llaves dobles, las cuales el sistema reemplaza en el acto con los datos correspondientes:",
          "{{cliente}} -> Se reemplaza por el Nombre y Apellido del cliente.",
          "{{servicio}} -> Se reemplaza por el Nombre del servicio seleccionado.",
          "{{especialista}} -> Se reemplaza por el Nombre del profesional a cargo.",
          "{{fecha}} -> Se reemplaza por la fecha del turno formateada de manera amigable (DD/MM/YYYY).",
          "{{hora}} -> Se reemplaza por la hora asignada del turno (ej. 16:30 hs)."
        ]
      }
    ]
  },
  {
    id: "crm",
    title: "4. BASE DE CLIENTES Y HISTORIAL (CRM)",
    introduction: "La base de datos de clientes integrada permite consultar la actividad histórica de cada visitante y resguardar anotaciones internas de atención.",
    subsections: [
      {
        subtitle: "A. FICHA ÚNICA Y PREVENCIÓN DE DUPLICADOS",
        items: [
          "Al guardar un cliente en el panel administrativo, el sistema genera automáticamente un código identificador basado en la combinación de su Nombre y Apellido, eliminando tildes y espacios.",
          "En caso de que el cliente no tenga un nombre registrado, el sistema asigna como identificador único su número de WhatsApp limpio.",
          "Este mecanismo evita la creación de fichas duplicadas y unifica todas las reservas pasadas de una misma persona en un solo perfil."
        ]
      },
      {
        subtitle: "B. MÉTRICAS AUTOMÁTICAS E HISTÓRICO DE ATENCIÓN",
        items: [
          "La ficha de cada cliente en la base de datos se vincula en tiempo real con el historial de turnos para calcular automáticamente:",
          "1. Visitas Totales: Cantidad de citas que el cliente ha completado en el salón.",
          "2. Gasto Total Acumulado: Suma total facturada por los servicios completados del cliente.",
          "3. Última Visita: Muestra la fecha del turno más reciente en formato claro (DD/MM/YYYY)."
        ]
      },
      {
        subtitle: "C. NOTAS TÉCNICAS INTERNAS Y CUMPLE",
        items: [
          "Notas del Profesional: Cada cliente posee un campo para anotaciones internas, exclusivo del personal del salón (ej. fórmulas de tintura, tipo de corte favorito, alergias). Son de uso confidencial.",
          "Cumpleaños: Campo de fecha de cumpleaños, disponible en la ficha del administrador para enviar saludos, promociones especiales y fidelizar al cliente, sin interrumpir el ágil formulario público de reserva."
        ]
      }
    ]
  },
  {
    id: "system",
    title: "5. PARÁMETROS GENERALES Y CONTROL DE FERIADOS",
    introduction: "La consola de configuración del sistema otorga autonomía para fijar las reglas de agenda del salón y gestionar los feriados anuales de atención.",
    subsections: [
      {
        subtitle: "A. PARÁMETROS GLOBALES DE RESERVA",
        items: [
          "Días permitidos para turnos: Permite ajustar con cuántos días de anticipación como máximo puede reservar un cliente (ej. configurar 30 días futuros).",
          "Límite de turnos activos: Permite definir el tope máximo de turnos activos que un cliente puede tener agendados a la vez (por defecto fijado en 2 turnos).",
          "Permisos de reserva en el mismo día: Opción para habilitar o deshabilitar la reserva de turnos para la jornada en curso."
        ]
      },
      {
        subtitle: "B. AGENDA DE FERIADOS Y CONFIGURACIÓN",
        items: [
          "Sincronización en un Click: El sistema se conecta con la API nacional de feriados para cargar las fechas festivas del año 2026.",
          "Contingencia Integrada: Cuenta con un listado estático pre-cargado de todos los feriados del año 2026 dentro del código fuente. Esto garantiza que, si se cae la red pública de feriados o hay problemas de internet, el sistema nunca quede en blanco y siga funcionando correctamente.",
          "Tipos de Feriados: Se clasifican según su tipo (inamovible, trasladable, puente o personalizado) para una correcta visualización en la tabla de control."
        ]
      },
      {
        subtitle: "C. EXCEPCIONES OPERATIVAS (ABRIR O CERRAR DÍAS)",
        items: [
          "Cerrado (Bloqueado): Es el comportamiento habitual para un feriado. La fecha inhabilita el calendario público y los clientes no pueden agendar turnos ese día.",
          "Abierto (Sí se atiende): Si el salón decide abrir sus puertas durante un feriado, el administrador puede conmutar el estado del día. El sistema habilitará la fecha en la página de reservas y los clientes podrán reservar turnos normalmente."
        ]
      }
    ]
  },
  {
    id: "specialists",
    title: "6. GESTIÓN DE ESPECIALISTAS Y EQUIPO",
    introduction: "La sección de personal permite administrar el equipo de profesionales del salón, definiendo sus especialidades y configurando de forma personalizada cómo reciben las alertas de nuevos turnos.",
    subsections: [
      {
        subtitle: "A. FICHA DEL PROFESIONAL Y CAMPOS OPCIONALES",
        items: [
          "Cada integrante del equipo cuenta con su propio perfil individual en el panel administrativo.",
          "Al crear o editar un perfil de especialista, podés ingresar su Nombre, Especialidad (para detallar qué rubros atiende) y sus datos de contacto de Email y Celular.",
          "Es muy importante destacar que los datos de contacto (Email y Celular) son totalmente opcionales. El sistema no te obligará a completarlos para poder guardar el perfil, permitiendo registrar colaboradores sin correo o teléfono sin ningún inconveniente."
        ]
      },
      {
        subtitle: "B. PREFERENCIA DE AVISOS Y ALERTAS AUTOMÁTICAS",
        items: [
          "Cada perfil cuenta con un control interactivo de alertas representado por una campana en la lista de personal.",
          "Activar Alertas (Campana Dorada): Si el botón está activado con la campana en color dorado, el sistema le enviará un correo electrónico de aviso automático al profesional cada vez que un cliente reserve un turno con él. Para que esta notificación se realice con éxito, es necesario que el profesional tenga su email registrado.",
          "Silenciar Alertas (Campana Apagada): Si desactivás el botón, la campana aparecerá silenciada y el profesional no recibirá correos automáticos por nuevos turnos, ideal para colaboradores que prefieren autogestionar su agenda o no utilizar avisos externos."
        ]
      }
    ]
  }
];
