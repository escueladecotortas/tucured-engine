// Archivo: src/lib/firebase/appointments.js
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from './config';
import { getClientByWhatsapp, createClient } from './clients';

function cleanNulls(obj) {
  if (obj === null || obj === undefined) return undefined;
  if (Array.isArray(obj)) {
    return obj
      .map(item => (typeof item === 'object' && item !== null ? cleanNulls(item) : item))
      .filter(x => x !== undefined && x !== null);
  }
  if (typeof obj === 'object') {
    if (obj instanceof Timestamp || obj instanceof Date) {
      return obj;
    }
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        const val = typeof value === 'object' ? cleanNulls(value) : value;
        if (val !== undefined && val !== null) {
          cleaned[key] = val;
        }
      }
    }
    return cleaned;
  }
  return obj;
}

export async function createAppointment(appointmentData, operatorId = null) {
  try {
    const { clientId, serviceIds, specialistId, date, time, price, totalDuration, notes } = appointmentData;
    
    if (!clientId) throw new Error('clientId is required (ESQUEMA A)');
    
    let currentUserEmail = 'CLIENTE_LANDING';
    if (operatorId && typeof operatorId === 'string' && operatorId.trim()) {
      currentUserEmail = operatorId.trim();
    } else if (auth.currentUser?.email) {
      currentUserEmail = auth.currentUser.email;
    }

    // 1. Construcción de Fecha Determinista (Timestamp)
    // Forzamos Buenos Aires (UTC-3) para evitar desfases
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    // 10:00 AM BA = 13:00 UTC. Sumamos 3 horas al UTC para obtener el punto temporal correcto.
    const apptDate = new Date(Date.UTC(year, month - 1, day, hour + 3, minute));

    // 2. Ensamblaje de Objeto Relacional (Esquema A - SOBERANO)
    const newAppt = cleanNulls({
      appointmentDate: Timestamp.fromDate(apptDate),
      clientId: String(clientId),
      serviceIds: Array.isArray(serviceIds) ? serviceIds : [],
      specialistId: String(specialistId),
      status: 'pending',
      precioCobrado: price || 0,
      duracionCobrada: totalDuration || 45,
      createdAt: Timestamp.now(),
      createdBy: currentUserEmail,
      notes: notes ? String(notes).trim().toUpperCase() : null
    });

    const docRef = await addDoc(collection(db, 'appointments'), newAppt);

    // 3. Notificación Inmediata en background (sin await)
    // Disparador de aviso para la administración y especialista sin demorar la pantalla del cliente
    (async () => {
      try {
        const clientDoc = await getDoc(doc(db, 'clients', clientId));
        const clientDataResolved = clientDoc.exists() ? clientDoc.data() : null;

        const specDoc = await getDoc(doc(db, 'specialists', specialistId));
        const specialistDataResolved = specDoc.exists() ? specDoc.data() : null;

        const servicesNames = [];
        if (Array.isArray(serviceIds)) {
          for (const sId of serviceIds) {
            const sDoc = await getDoc(doc(db, 'services', sId));
            if (sDoc.exists()) {
              servicesNames.push(sDoc.data().name);
            }
          }
        }
        const serviceNameStr = servicesNames.join(', ') || 'Servicio General';

        const emailsToNotify = new Set(['darcyrigonat@gmail.com', 'alertas@lafachadaunisex.ar']);

        try {
          const adminsSnapshot = await getDocs(collection(db, 'usuarios'));
          adminsSnapshot.docs.forEach(adminDoc => {
            const adminData = adminDoc.data();
            if (adminData.rol === 'admin' && adminData.email && adminData.recibirAlertas !== false) {
              emailsToNotify.add(adminData.email.toLowerCase().trim());
            }
          });
        } catch (adminErr) {
          console.warn('[NOTIFY] Error cargando administradores de Firestore:', adminErr);
        }

        if (specialistDataResolved && specialistDataResolved.email && specialistDataResolved.recibirAlertas !== false) {
          emailsToNotify.add(specialistDataResolved.email.toLowerCase().trim());
        }

        const finalTo = Array.from(emailsToNotify);
        const finalAppointmentData = {
          cliente: clientDataResolved ? {
            nombre: clientDataResolved.firstName || '',
            apellido: clientDataResolved.lastName || '',
            celular: clientDataResolved.whatsapp || ''
          } : 'Cliente',
          servicio: serviceNameStr,
          fecha: date,
          hora: time,
          profesional: specialistDataResolved 
            ? `${specialistDataResolved.firstName || ''} ${specialistDataResolved.lastName || ''}`.trim()
            : 'No asignado',
          precio: price || 0,
          duracion: totalDuration || 45,
          notas: notes || ''
        };

        const res = await fetch('/api/notify-appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: finalTo,
            appointmentData: finalAppointmentData
          })
        });

        if (res.ok) {
          console.log('[NOTIFY] Intento de notificación enviado a:', finalTo);
        } else {
          const errText = await res.text();
          console.warn('[NOTIFY] Error en respuesta de notificación:', errText);
        }
      } catch (err) {
        console.warn('[NOTIFY] Error en disparador de correo en background:', err);
      }
    })();

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('[DB] Error creating appointment:', error);
    throw error;
  }
}

export async function updateAppointmentStatus(id, status, operatorId = null) {
  try {
    const currentUserEmail = operatorId || auth.currentUser?.email || 'system';
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { 
      status,
      updatedAt: Timestamp.now(),
      updatedBy: currentUserEmail
    });
    return { success: true };
  } catch (error) {
    console.error('[DB] Error updating status:', error);
    throw error;
  }
}

export async function getAppointments() {
  try {
    const snapshot = await getDocs(collection(db, 'appointments'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[DB] Error fetching appointments:', error);
    return [];
  }
}

export function subscribeAppointments(callback) {
  const apptsCol = collection(db, 'appointments');
  return onSnapshot(apptsCol, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  }, (error) => {
    console.error('[DB] Error en onSnapshot de appointments:', error);
    callback([]);
  });
}

export async function countActiveAppointments(clientId) {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('clientId', '==', String(clientId)),
      where('status', 'in', ['pending', 'confirmed'])
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('[DB] Error counting active appointments:', error);
    return 0;
  }
}
