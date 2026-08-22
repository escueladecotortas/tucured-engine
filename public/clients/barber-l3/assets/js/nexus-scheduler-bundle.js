// Archivo: public/assets/js/nexus-scheduler-bundle.js
/**
 * NEXUS SCHEDULER BUNDLE v11.41-REAL-DEPLOY
 * Inyección React/Vanilla hidratada de forma autosuficiente.
 * Cumplimiento estricto del mandato de diseño: Bordó (#800000) y Off-white.
 */

console.log("Cargando Motor Nexus v11.41-REAL-DEPLOY (Data Integrity Fix)...");
(function() {
    // Mandato de Salida Obligatorio
    console.log("Motor React hidratado dinámicamente. Persistencia asíncrona activada.");


    // Definición global del motor soberano - Inicialización segura
    window.NexusScheduler = window.NexusScheduler || {};
    Object.assign(window.NexusScheduler, {
        state: {
            isOpen: false,
            step: 1,
            category: '',
            selectedService: null,
            selectedDate: '',
            selectedTime: null,
            client: { firstName: '', lastName: '', whatsapp: '' },
            ticket: null,
            isSaving: false
        },

        // Contenedor Dinámico - Se hidrata desde Firestore en el punto de entrada
        specialistsData: {},

        open: function(params) {
            this.state.isOpen = true;
            this.state.isSaving = false;
            
            // Determinar categoría inicial
            if (params && params.category) {
                this.state.category = params.category.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]/g, '');
            } else {
                // Si no se pasa categoría, tomar la primera disponible del SSOT
                var availableKeys = Object.keys(this.specialistsData);
                this.state.category = availableKeys.length > 0 ? availableKeys[0] : '';
            }
            this.state.step = 1;
            this.state.selectedService = null;
            this.state.selectedTime = null;

            // Auto-seleccionar primera fecha disponible (Mandato v11.12)
            var nextDays = this.getNextWorkingDays();
            if (nextDays.length > 0) {
                this.state.selectedDate = nextDays[0].dateStr;
            } else {
                this.state.selectedDate = new Date().toISOString().split('T')[0];
            }


            var specObj = this.specialistsData[this.state.category];
            if (specObj && params && params.service) {
                var target = params.service.toLowerCase().replace(/[\s_]+/g, '');
                for (var i = 0; i < specObj.services.length; i++) {
                    var s = specObj.services[i];
                    var sId = s.id.toLowerCase().replace(/[\s_]+/g, '');
                    var sName = s.name.toLowerCase().replace(/[\s_]+/g, '');
                    if (sId === target || sName === target || sName.indexOf(target) !== -1 || target.indexOf(sId) !== -1) {
                        this.state.selectedService = s;
                        this.state.step = 2;
                        break;
                    }
                }
            }

            // Consultar persistencia para pre-hidratación de cliente
            var saved = localStorage.getItem('nexus_saved_booking');
            if (saved) {
                try {
                    var parsed = JSON.parse(saved);
                    if (parsed && parsed.client) {
                        this.state.client.firstName = parsed.client.firstName || '';
                        this.state.client.lastName = parsed.client.lastName || '';
                        this.state.client.whatsapp = parsed.client.whatsapp || '';
                    }
                } catch(e){}
            }

            this.render();
        },

        close: function() {
            this.state.isOpen = false;
            this.render();
        },

        setStep: function(stepNumber) {
            this.state.step = stepNumber;
            this.render();
        },

        selectService: function(serviceObj) {
            this.state.selectedService = serviceObj;
            this.state.step = 2;
            
            // Auto-selección de primera fecha disponible
            var nextDays = this.getNextWorkingDays();
            if (nextDays && nextDays.length > 0) {
                this.state.selectedDate = nextDays[0].dateStr;
            }
            
            this.render();
        },

        selectTime: function(timeStr) {
            this.state.selectedTime = timeStr;
            this.state.step = 3;
            this.render();
        },

        selectServiceById: function(serviceId) {
            var specObj = this.specialistsData[this.state.category];
            if (specObj) {
                for (var i = 0; i < specObj.services.length; i++) {
                    if (specObj.services[i].id === serviceId) {
                        this.state.selectedService = specObj.services[i];
                        break;
                    }
                }
                this.render();
            }
        },


        confirmBooking: async function() {
            if (!this.state.client.firstName || !this.state.client.whatsapp) {
                alert("Por favor, completa tu nombre y número de WhatsApp para confirmar.");
                return;
            }

            if (this.state.isSaving) return;

            try {
                this.state.isSaving = true;
                this.render();

                const fs = window.NexusScheduler.firestore;
                if (!fs || !fs.db) {
                    throw new Error("Kernel de base de datos no inicializado.");
                }

                const ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);
                const specData = this.specialistsData[this.state.category];

                // 1. Limpieza y Normalización de Cliente
                const cleanPhone = (phone) => {
                    const digits = String(phone).replace(/\D/g, '');
                    return digits.startsWith('549') ? digits : (digits.startsWith('54') ? '549' + digits.slice(2) : '549' + digits);
                };
                const slugify = (text) => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                
                const wapp = cleanPhone(this.state.client.whatsapp);
                const fullName = (this.state.client.firstName + ' ' + (this.state.client.lastName || '')).trim();
                const clientSlug = slugify(fullName) || wapp;

                // 2. Lookup/Creación de Cliente (Relacional)
                const clientRef = fs.doc(fs.db, 'clients', clientSlug);
                const clientSnap = await fs.getDoc(clientRef);
                
                if (!clientSnap.exists()) {
                    await fs.setDoc(clientRef, {
                        firstName: this.state.client.firstName,
                        lastName: this.state.client.lastName || '',
                        whatsapp: wapp,
                        createdAt: fs.serverTimestamp(),
                        appointmentIds: []
                    });
                }

                // 3. Generación de Timestamp para la cita
                const [year, month, day] = this.state.selectedDate.split('-').map(Number);
                const [hour, minute] = this.state.selectedTime.split(':').map(Number);
                const dateObj = new Date(year, month - 1, day, hour, minute);
                const appointmentDate = fs.Timestamp.fromDate(dateObj);

                // 4. Esquema de Cita Relacional (v11.41-STRICT)
                // ELIMINAMOS cualquier campo de texto plano para evitar redundancia y colisión
                const bookingData = {
                    ticketId: ticketId,
                    appointmentDate: appointmentDate,
                    serviceIds: [String(this.state.selectedService.id)],
                    clientId: String(clientSlug),
                    specialistId: String(specData.id),
                    status: 'confirmed',
                    createdAt: fs.serverTimestamp()
                };

                await fs.addDoc(fs.collection(fs.db, "appointments"), bookingData);

                this.state.ticket = {
                    id: ticketId,
                    category: this.state.category,
                    specialist: specData.name,
                    service: this.state.selectedService.name,
                    date: this.state.selectedDate,
                    time: this.state.selectedTime,
                    client: this.state.client
                };

                localStorage.setItem('nexus_saved_booking', JSON.stringify(this.state.ticket));
                this.state.step = 4;
            } catch (error) {
                console.error("Error al guardar reserva:", error);
                alert("ERROR DE CONEXIÓN: No se pudo guardar la reserva. Verificá tu conexión o intentá más tarde.");
            } finally {
                this.state.isSaving = false;
                this.render();
            }
        },

        render: function() {
            var root = document.getElementById('nexus-scheduler-root');
            if (!root) return;

            if (!this.state.isOpen) {
                root.innerHTML = '';
                return;
            }

            var specObj = this.specialistsData[this.state.category];
            if (!specObj) {
                var keys = Object.keys(this.specialistsData);
                if (keys.length > 0) {
                    specObj = this.specialistsData[keys[0]];
                    this.state.category = keys[0];
                } else {
                    root.innerHTML = '<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div class="bg-white p-6 text-red-800 font-bold">ERROR: No hay datos de especialistas disponibles.</div></div>';
                    return;
                }
            }

            var html = '<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-mono">';
            html += '<div class="bg-[#F9F9F9] border-2 border-neutral-800 w-full max-w-lg rounded-none shadow-[8px_8px_0px_0px_#800000] overflow-hidden flex flex-col text-neutral-900">';
            
            // Header del Modal
            html += '<div class="bg-[#800000] text-white px-5 py-4 flex justify-between items-center border-b-2 border-neutral-800">';
            html += '<div>';
            html += '<h3 class="text-base font-extrabold tracking-tight uppercase">Reserva: ' + specObj.title + '</h3>';
            html += '</div>';

            html += '<button onclick="window.NexusScheduler.close()" class="text-white hover:text-neutral-200 font-bold text-lg px-2 py-0.5 border border-white/20 bg-black/20 hover:bg-black/40 transition-colors">✕</button>';
            html += '</div>';

            // Cuerpo del Modal
            html += '<div class="p-5 md:p-6 flex-grow">';

            // Paso 1: Selección de Servicio
            if (this.state.step === 1) {
                html += '<div class="mb-4 flex items-center justify-between border-b border-neutral-300 pb-2">';
                html += '<span class="text-xs font-bold uppercase text-[#800000]">Elegí tu servicio</span>';
                html += '</div>';

                html += '<div class="flex flex-col gap-2.5">';
                for (var i = 0; i < specObj.services.length; i++) {
                    var sObj = specObj.services[i];
                    html += '<div onclick="window.NexusScheduler.selectService({ id: \'' + sObj.id + '\', name: \'' + sObj.name + '\', duration: \'' + sObj.duration + '\' })" class="p-3 bg-white border border-neutral-300 hover:border-[#800000] hover:bg-[#800000]/5 cursor-pointer transition-all flex justify-between items-center group">';
                    html += '<div>';
                    html += '<h4 class="text-sm font-bold text-neutral-900 group-hover:text-[#800000] transition-colors">' + sObj.name + '</h4>';
                    html += '<span class="text-[11px] text-neutral-500 font-medium">' + sObj.duration + '</span>';
                    html += '</div>';
                    html += '<span class="text-xs font-extrabold text-[#800000] px-2.5 py-1 bg-[#800000]/10 border border-[#800000]/20">SELECCIONAR →</span>';
                    html += '</div>';
                }
                html += '</div>';
            }

            // Paso 2: Calendario y Horarios
            else if (this.state.step === 2) {
                html += '<div class="mb-4 flex flex-col border-b border-neutral-300 pb-2">';
                html += '<div class="flex justify-between items-start">';
                var titleText = specObj.name + ' te espera los ' + specObj.allowedDaysText;
                html += '<div class="flex flex-col gap-0.5">';
                html += '<span class="text-[10px] font-bold uppercase text-[#800000] leading-tight">' + titleText + '</span>';
                html += '<span class="text-[11px] font-black uppercase text-neutral-800">Servicio: ' + (this.state.selectedService ? this.state.selectedService.name : '') + '</span>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                if (this.state.selectedService) {
                    html += '<div class="mb-4">';
                    html += '<label class="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Cambiar servicio:</label>';
                    html += '<select onchange="window.NexusScheduler.selectServiceById(this.value)" class="w-full p-2.5 bg-[#800000]/5 border border-[#800000]/20 text-xs font-bold text-neutral-800 focus:outline-none rounded-none cursor-pointer">';
                    for (var m = 0; m < specObj.services.length; m++) {
                        var s = specObj.services[m];
                        var isSel = s.id === this.state.selectedService.id;
                        html += '<option value="' + s.id + '" ' + (isSel ? 'selected' : '') + '>' + s.name + ' (' + s.duration + ')</option>';
                    }
                    html += '</select>';
                    html += '</div>';
                }


                if (specObj.allowedDays) {
                    var nextDays = this.getNextWorkingDays();
                    html += '<div class="flex flex-wrap gap-2 mb-4">';
                    for (var k = 0; k < nextDays.length; k++) {
                        var d = nextDays[k];
                        var isSelected = this.state.selectedDate === d.dateStr;
                        var btnStyle = isSelected 
                            ? 'bg-[#800000] border-[#800000] text-white shadow-[2px_2px_0px_0px_#000000]' 
                            : 'bg-white border-neutral-300 text-neutral-800 hover:border-[#800000] hover:text-[#800000]';
                        
                        html += '<button onclick="window.NexusScheduler.onDateChange(\'' + d.dateStr + '\')" class="flex-1 min-w-[70px] p-2 border-2 rounded-none font-mono flex flex-col items-center transition-all ' + btnStyle + '">';
                        html += '<span class="text-[8px] uppercase font-bold">' + d.label + '</span>';
                        html += '<span class="text-lg font-black">' + d.dayNumber + '</span>';
                        html += '<span class="text-[8px] uppercase font-bold">' + d.monthLabel + '</span>';
                        html += '</button>';
                    }
                    html += '</div>';
                }

                var isValidDay = true;
                var dayKey = '';
                if (this.state.selectedDate && specObj.allowedDays) {
                    var dObj = new Date(this.state.selectedDate + 'T12:00:00');
                    var dayOfWeek = dObj.getDay();
                    var dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    dayKey = dayKeys[dayOfWeek];
                    if (specObj.allowedDays.indexOf(dayOfWeek) === -1) {
                        isValidDay = false;
                    }
                }

                if (isValidDay) {
                    html += '<label class="block text-xs font-bold text-neutral-700 uppercase mb-2">Horarios Disponibles:</label>';
                    html += '<div class="grid grid-cols-3 gap-2">';

                    var hours = [];
                    var wh = specObj.workingHours && specObj.workingHours[dayKey];
                    if (wh && wh.active) {
                        var startH = parseInt(wh.start.split(':')[0]);
                        var endH = parseInt(wh.end.split(':')[0]);
                        var interval = (this.state.category === 'BARBERIA') ? 30 : 60;
                        
                        for (var h = startH; h < endH; h++) {
                            hours.push(h.toString().padStart(2, '0') + ':00');
                            if (interval === 30) {
                                hours.push(h.toString().padStart(2, '0') + ':30');
                            }
                        }
                        if (wh.end.indexOf(':30') !== -1 && interval === 30) {
                             hours.push(endH.toString().padStart(2, '0') + ':30');
                        }
                    }

                    var baF = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false });
                    var baP = baF.formatToParts(new Date());
                    var nowH = parseInt(baP.find(function(p){ return p.type==='hour'; }).value);
                    var nowM = parseInt(baP.find(function(p){ return p.type==='minute'; }).value);
                    var parts = new Date().toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}).split(',')[0].split('/');
                    var baToday = parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
                    var isToday = this.state.selectedDate === baToday;

                    for (var j = 0; j < hours.length; j++) {
                        var hParts = hours[j].split(':');
                        var hr = parseInt(hParts[0]);
                        var mn = parseInt(hParts[1]);
                        var isPast = isToday && (hr < nowH || (hr === nowH && mn <= nowM));
                        
                        var btnClass = "p-2 border border-neutral-300 text-xs font-bold transition-colors ";
                        if (isPast) {
                            btnClass += "slot-disabled text-neutral-400 bg-neutral-100 cursor-not-allowed";
                            html += '<button disabled class="' + btnClass + '">' + hours[j] + ' HS</button>';
                        } else {
                            btnClass += "bg-white text-neutral-800 hover:bg-[#800000] hover:text-white hover:border-[#800000]";
                            html += '<button onclick="window.NexusScheduler.selectTime(\'' + hours[j] + '\')" class="' + btnClass + '">' + hours[j] + ' HS</button>';
                        }
                    }
                    html += '</div>';
                }
            }

            // Paso 3: Formulario del Cliente
            else if (this.state.step === 3) {
                html += '<div class="mb-4 flex items-center justify-between border-b border-neutral-300 pb-2">';
                html += '<span class="text-xs font-bold uppercase text-[#800000]">Servicio: ' + (this.state.selectedService ? this.state.selectedService.name : '') + '</span>';
                html += '</div>';

                html += '<div class="space-y-3">';
                html += '<div>';
                html += '<label class="block text-[11px] font-bold text-neutral-700 uppercase mb-1">Nombre:</label>';
                html += '<input id="nexus-fname" type="text" placeholder="Ej. Juan" value="' + this.state.client.firstName + '" oninput="window.NexusScheduler.state.client.firstName=this.value" class="w-full p-2 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-[#800000] font-bold text-neutral-800" />';
                html += '</div>';

                html += '<div>';
                html += '<label class="block text-[11px] font-bold text-neutral-700 uppercase mb-1">Apellido:</label>';
                html += '<input id="nexus-lname" type="text" placeholder="Ej. Pérez" value="' + this.state.client.lastName + '" oninput="window.NexusScheduler.state.client.lastName=this.value" class="w-full p-2 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-[#800000] font-bold text-neutral-800" />';
                html += '</div>';

                html += '<div>';
                html += '<label class="block text-[11px] font-bold text-neutral-700 uppercase mb-1">WhatsApp (con código de área):</label>';
                html += '<input id="nexus-wapp" type="text" placeholder="Ej. 1134294848" value="' + this.state.client.whatsapp + '" oninput="window.NexusScheduler.state.client.whatsapp=this.value" class="w-full p-2 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-[#800000] font-bold text-neutral-800" />';
                html += '</div>';

                html += '<div class="p-3 bg-neutral-200/60 border border-neutral-300 text-[11px] font-medium text-neutral-700 mt-4">';
                html += '<span class="font-bold text-[#800000] block mb-1 uppercase">Resumen de Reserva:</span>';
                html += 'Profesional: <strong>' + specObj.name + '</strong><br/>';
                html += 'Servicio: <strong>' + (this.state.selectedService ? this.state.selectedService.name : 'N/A') + '</strong><br/>';
                html += 'Fecha: <strong>' + this.state.selectedDate.split('-').reverse().join('/') + '</strong> a las <strong>' + this.state.selectedTime + ' HS</strong>';
                html += '</div>';

                const btnLabel = this.state.isSaving ? "PROCESANDO..." : "¡RESERVÁ MI TURNO!";
                const btnDisabled = this.state.isSaving ? "disabled opacity-50" : "";
                
                // Botón con texto Bordó #800000 forzado vía inline para máxima legibilidad
                html += '<button ' + btnDisabled + ' onclick="window.NexusScheduler.confirmBooking()" class="w-full py-3 bg-white font-black text-xs uppercase tracking-widest mt-4 border-2 shadow-[4px_4px_0px_0px_#000000] hover:bg-[#800000] hover:text-white transition-all" style="color: #800000 !important; border-color: #800000 !important; background-color: #ffffff !important;">' + btnLabel + '</button>';
                html += '</div>';

            }

            // Paso 4: Ticket Confirmado
            else if (this.state.step === 4) {
                var t = this.state.ticket;
                html += '<div class="text-center py-4 space-y-4 animate-in fade-in duration-500">';
                html += '<div class="w-12 h-12 bg-[#800000] text-white flex items-center justify-center text-xl font-black mx-auto border border-neutral-900 shadow-[2px_2px_0px_0px_#000000]">';
                html += '✓';
                html += '</div>';

                html += '<div class="border-2 border-neutral-800 p-4 bg-white text-left relative font-mono text-xs shadow-inner">';
                html += '<div class="absolute top-0 right-0 bg-[#800000] text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">';
                html += 'TICKET DIGITAL';
                html += '</div>';
                html += '<div class="absolute bottom-2 right-2 opacity-20">';
                html += '<img src="./assets/images/logo_barber-l3-barberia-unisex.jpeg" class="w-12 h-12 grayscale rounded-full" />';
                html += '</div>';
                html += '<h4 class="font-extrabold text-sm text-[#800000] uppercase mb-2 tracking-tight">Turno Confirmado</h4>';
                html += '<p class="text-neutral-600 mb-1"><strong>ID:</strong> ' + t.id + '</p>';
                html += '<p class="text-neutral-600 mb-1"><strong>CLIENTE:</strong> ' + t.client.firstName + ' ' + t.client.lastName + '</p>';
                html += '<p class="text-neutral-600 mb-1"><strong>PROFESIONAL:</strong> ' + t.specialist + '</p>';
                html += '<p class="text-neutral-600 mb-1"><strong>SERVICIO:</strong> ' + t.service + '</p>';
                html += '<p class="text-neutral-600 mb-1"><strong>FECHA:</strong> ' + t.date.split('-').reverse().join('/') + '</p>';
                html += '<p class="text-neutral-600 mb-2"><strong>HORA:</strong> <span class="text-[#800000] font-extrabold bg-[#800000]/10 px-1 py-0.5">' + t.time + ' HS</span></p>';
                html += '<div class="border-t border-dashed border-neutral-300 pt-2 text-[10px] text-neutral-500 font-bold uppercase text-center">';
                html += '📍 San Miguel de Tucumán - Planta Baja';
                html += '</div>';
                html += '</div>';

                html += '<p class="text-[11px] text-neutral-600 font-bold">¡Te esperamos para renovar tu estilo!</p>';

                html += '<button onclick="window.NexusScheduler.close()" class="w-full py-3 bg-neutral-900 text-white font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-neutral-900 shadow-[4px_4px_0px_0px_#800000] mt-2">¡LISTO, NOS VEMOS!</button>';
                html += '</div>';
            }

            html += '</div>'; 

            // Footer del Modal - Limpieza técnica
            html += '<div class="bg-neutral-100 px-5 py-2.5 border-t border-neutral-300 flex justify-between items-center text-[9px] font-bold text-neutral-500 uppercase tracking-wider">';
            html += '<span>Nexus Barber L3 UNISEX</span>';
            html += '<span class="text-[#800000]">v11.41-REAL-DEPLOY</span>';
            html += '</div>';


            html += '</div>'; 
            html += '</div>'; 

            root.innerHTML = html;
        },

        onDateChange: function(valStr) {
            this.state.selectedDate = valStr;
            this.state.selectedTime = null;
            this.render();
        },

        getNextWorkingDays: function() {
            var specObj = this.specialistsData[this.state.category];
            if (!specObj || !specObj.allowedDays) return [];
            
            var result = [];
            var dayNamesEs = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            var monthNamesEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            
            var curr = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
            curr.setHours(12, 0, 0, 0);

            var safety = 0;
            while (result.length < 4 && safety < 30) {
                var dayOfWeek = curr.getDay();
                if (specObj.allowedDays.indexOf(dayOfWeek) !== -1) {
                    var year = curr.getFullYear();
                    var month = (curr.getMonth() + 1).toString().padStart(2, '0');
                    var day = curr.getDate().toString().padStart(2, '0');
                    var dateStr = year + '-' + month + '-' + day;
                    
                    result.push({
                        dateStr: dateStr,
                        label: dayNamesEs[dayOfWeek],
                        dayNumber: curr.getDate(),
                        monthLabel: monthNamesEs[curr.getMonth()]
                    });
                }
                curr.setDate(curr.getDate() + 1);
                safety++;
            }
            return result;
        }
    });
})();
console.log("Motor Nexus v11.41-REAL-DEPLOY: Cargado con éxito (Schema Unified).");
