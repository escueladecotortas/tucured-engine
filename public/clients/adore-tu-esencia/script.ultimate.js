/* 
   ADORE ULTIMATE JS
   Modules: Dynamic Nav, Turnero v1.0, Showcase Behavior
*/

document.addEventListener('DOMContentLoaded', () => {
    initDynamicNav();
    initTurnero();
});

// === DYNAMIC NAV ===
function initDynamicNav() {
    const nav = document.getElementById('glassIsland');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Toggle
    window.toggleMobileMenu = function () {
        const menu = document.getElementById('mobileDropdown');
        menu.classList.toggle('active');
    };
}

// === SHOWCASE LOCOMOTIVE (Autoplay & Drag) ===
function initShowcase() {
    const track = document.querySelector('.showcase-track');
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoPlayInterval;

    // Draggable Logic (Mouse)
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.classList.add('active'); // CSS could add cursor: grabbing
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        stopAutoPlay(); // Stop on interaction
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
        startAutoPlay(); // Resume
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        startAutoPlay(); // Resume
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        track.scrollLeft = scrollLeft - walk;
    });

    // Touch (Mobile)
    track.addEventListener('touchstart', stopAutoPlay, { passive: true });
    track.addEventListener('touchend', startAutoPlay, { passive: true });

    // Autoplay Logic
    function startAutoPlay() {
        stopAutoPlay(); // clear existing
        autoPlayInterval = setInterval(() => {
            // Scroll by one card width approx (350px + gap)
            // If at end, loop back? Or smooth scroll?
            // Simple approach: Smooth scroll small amount
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: 390, behavior: 'smooth' });
            }
        }, 3500); // 3.5s per slide
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start initially
    startAutoPlay();
}

// === PRODUCT ENQUIRY (Ver Detalles) ===
window.enquireProduct = function (productName) {
    const phone = "5493816202789";
    const msg = `Hola Adoré! Me encantó el producto "${productName}" que vi en la web. Me podrían enviar más info/fotos y precio?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initDynamicNav();
    initTurnero();
    initShowcase(); // NEW

    // Scroll Reveal config...
});

// === TURNERO SYSTEM v2.0 (The Legal Widget) ===
function initTurnero() {
    const modal = document.getElementById('turneroModal');
    const bodyContainer = document.getElementById('turnero-body');

    window.openTurnero = function () {
        modal.classList.add('active');

        // Initialize Widget Only Once
        if (bodyContainer.innerHTML.includes('Cargando') || bodyContainer.innerHTML.trim() === '') {
            new BookingWidget({
                containerId: 'turnero-body',
                phone: '5493816202789', // Phone Real Adoré
                businessName: 'Adoré Showroom',
                hours: { start: 10, end: 20 } // Showroom Hours
            });
        }
    };

    window.closeTurnero = function () {
        modal.classList.remove('active');
    };

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTurnero();
    });
}

/**
 * BOOKING WIDGET CLASS (Ported from Adoré V5)
 * Standardized Logic for WhatsApp Booking
 */
class BookingWidget {
    constructor(config) {
        this.config = config;
        this.today = new Date();
        this.currentDate = new Date();
        this.selectedDay = null;
        this.selectedTime = null;
        this.clientName = "";
        this.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.init();
    }

    init() {
        const container = document.getElementById(this.config.containerId);
        if (!container) return;

        // Render Base Structure
        container.innerHTML = `
        <style>
            .cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .cal-nav i { cursor: pointer; padding: 5px; color: #c6a87c; }
            .day-slot { padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.2s; background: #fff; border: 1px solid #eee; text-align: center; font-size: 0.9rem; }
            .day-slot:hover { border-color: #c6a87c; }
            .time-btn { padding: 8px 15px; border: 1px solid #ddd; background: #fff; border-radius: 20px; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
            .time-btn:hover { border-color: #c6a87c; }
            .input-styled { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px; font-family: inherit; }
            .btn-confirm { width: 100%; padding: 12px; background: #c6a87c; color: white; border-radius: 8px; font-weight: 600; font-size: 1rem; transition: 0.3s; }
            .btn-confirm:disabled { background: #eee; color: #aaa; cursor: not-allowed; }
            .btn-confirm:hover:not(:disabled) { background: #a67c52; }
        </style>

        <div class="cal-header">
            <span id="currentMonthYear" style="text-transform: capitalize; font-weight: 700; font-size: 1.1rem;"></span>
            <div class="cal-nav">
                <i class="fas fa-chevron-left" id="prevMonth"></i> 
                <i class="fas fa-chevron-right" id="nextMonth"></i>
            </div>
        </div>
        <div id="calendarGrid"></div>
        <div id="timeSlots" style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;"></div>
        
        <!-- STEP 2: SUMMARY (Hidden Initially) -->
        <div id="summaryStep" style="display: none; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
            <h4 style="margin-bottom: 15px; color: #2c241b;">Confirma tu Reserva</h4>
            <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: left; border: 1px solid #eee;">
                <p style="margin-bottom:5px;"><strong>Fecha:</strong> <span id="sumDate"></span></p>
                <p><strong>Hora:</strong> <span id="sumTime"></span></p>
            </div>
            <input type="text" id="clientNameInput" placeholder="Tu Nombre Completo" class="input-styled">
        </div>

        <button id="btnConfirm" class="btn-confirm" disabled style="margin-top: 20px;">Seleccionar Fecha</button>
        `;

        this.daysContainer = container.querySelector('#calendarGrid');
        this.timeContainer = container.querySelector('#timeSlots');
        this.summaryStep = container.querySelector('#summaryStep');
        this.btnConfirm = container.querySelector('#btnConfirm');
        this.labelMonth = container.querySelector('#currentMonthYear');
        this.clientNameInput = container.querySelector('#clientNameInput');
        this.sumDate = container.querySelector('#sumDate');
        this.sumTime = container.querySelector('#sumTime');

        this.btnPrev = container.querySelector('#prevMonth');
        this.btnNext = container.querySelector('#nextMonth');

        this.attachGlobalEvents();
        this.renderCalendar();
    }

    attachGlobalEvents() {
        this.btnPrev.onclick = () => this.changeMonth(-1);
        this.btnNext.onclick = () => this.changeMonth(1);

        this.btnConfirm.addEventListener('click', () => {
            if (this.summaryStep.style.display === 'none') {
                this.goToSummary();
            } else {
                this.sendWhatsApp();
            }
        });

        this.clientNameInput.addEventListener('input', (e) => {
            this.clientName = e.target.value;
            this.validateConfirmButton();
        });
    }

    changeMonth(dir) {
        const newDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + dir));
        if (newDate < new Date(this.today.getFullYear(), this.today.getMonth(), 1) && dir === -1) {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            return;
        }
        this.currentDate = newDate;
        this.selectedDay = null;
        this.selectedTime = null;
        this.renderCalendar();
        this.hideSummary();
    }

    renderCalendar() {
        this.timeContainer.innerHTML = '';
        this.btnConfirm.disabled = true;
        this.btnConfirm.innerText = "Seleccionar Fecha";
        this.hideSummary();

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        this.labelMonth.innerText = `${this.monthNames[month]} ${year}`;

        // Gray out Prev button if current month
        if (month === this.today.getMonth() && year === this.today.getFullYear()) {
            this.btnPrev.style.opacity = '0.3';
            this.btnPrev.style.pointerEvents = 'none';
        } else {
            this.btnPrev.style.opacity = '1';
            this.btnPrev.style.pointerEvents = 'auto';
        }

        this.renderDays(year, month);
    }

    renderDays(year, month) {
        const uiDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        let gridHtml = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center; margin-bottom: 5px;">`;
        gridHtml += uiDays.map(d => `<span style="font-size: 0.75rem; font-weight: 700; color: #999;">${d}</span>`).join('');
        gridHtml += `</div><div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center;">`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        let startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let j = 0; j < startOffset; j++) {
            gridHtml += `<span></span>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const checkDate = new Date(year, month, i);
            checkDate.setHours(0, 0, 0, 0);
            const todayZero = new Date(this.today);
            todayZero.setHours(0, 0, 0, 0);

            let styles = "padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 0.9rem;";
            let onclick = `window.selectDayWidget(${i})`;
            let extraClass = "";

            if (checkDate < todayZero) {
                styles += "background: #f9f9f9; color: #ddd; cursor: not-allowed;";
                onclick = "";
            } else if (checkDate.getDay() === 0) {
                styles += "background: #fff0f0; color: #ffcccc; cursor: not-allowed;";
                onclick = "";
            } else {
                styles += "background: white; border: 1px solid #eee; color: #333;";
                extraClass = "hover-day";
            }

            gridHtml += `<div id="day-slot-${i}" class="${extraClass}" style="${styles}" onclick="${onclick}">${i}</div>`;
        }
        gridHtml += `</div>`;
        this.daysContainer.innerHTML = gridHtml;

        // Bind global helper
        window.selectDayWidget = (d) => this.selectDay(d);
    }

    selectDay(day) {
        // Reset Visuals
        const allDays = this.daysContainer.querySelectorAll('div[id^="day-slot-"]');
        allDays.forEach(d => {
            if (!d.style.background.includes('f9f9f9') && !d.style.background.includes('fff0f0')) {
                d.style.background = 'white';
                d.style.color = '#333';
                d.style.borderColor = '#eee';
            }
        });

        const target = this.daysContainer.querySelector(`#day-slot-${day}`);
        if (target) {
            target.style.background = '#c6a87c';
            target.style.color = 'white';
            target.style.borderColor = '#c6a87c';
        }

        this.selectedDay = day;
        this.renderTimeSlots();
        this.btnConfirm.disabled = true;
        this.btnConfirm.innerText = "Seleccionar Horario";
        this.hideSummary();
    }

    renderTimeSlots() {
        this.timeContainer.innerHTML = '';
        const { start, end } = this.config.hours;
        const currentHour = this.today.getHours();
        const isToday = (
            this.selectedDay === this.today.getDate() &&
            this.currentDate.getMonth() === this.today.getMonth() &&
            this.currentDate.getFullYear() === this.today.getFullYear()
        );

        for (let i = start; i < end; i += 1) {
            const btn = document.createElement('button');
            btn.innerText = `${i}:00`;
            btn.className = 'time-btn';

            if (isToday && i <= currentHour) {
                btn.style.opacity = "0.5";
                btn.style.pointerEvents = "none";
                btn.style.background = "#eee";
            } else {
                btn.onclick = () => this.selectTime(btn);
            }
            this.timeContainer.appendChild(btn);
        }
    }

    selectTime(el) {
        this.timeContainer.querySelectorAll('.time-btn').forEach(b => {
            b.style.background = '#fff';
            b.style.color = '#333';
            b.style.borderColor = '#ddd';
        });

        el.style.background = '#c6a87c';
        el.style.color = 'white';
        el.style.borderColor = '#c6a87c';

        this.selectedTime = el.innerText;
        this.btnConfirm.disabled = false;
        this.btnConfirm.innerText = "Continuar";
    }

    goToSummary() {
        this.daysContainer.style.display = 'none';
        this.timeContainer.style.display = 'none';
        this.summaryStep.style.display = 'block';

        const fullDate = `${this.selectedDay} de ${this.monthNames[this.currentDate.getMonth()]}`;
        this.sumDate.innerText = fullDate;
        this.sumTime.innerText = this.selectedTime;
        this.validateConfirmButton();
    }

    hideSummary() {
        this.summaryStep.style.display = 'none';
        this.daysContainer.style.display = 'block';
        this.timeContainer.style.display = 'flex';
        this.clientNameInput.value = "";
    }

    validateConfirmButton() {
        if (this.summaryStep.style.display !== 'none') {
            if (this.clientName.trim().length > 2) {
                this.btnConfirm.disabled = false;
                this.btnConfirm.innerText = "Confirmar Reserva via WhatsApp";
            } else {
                this.btnConfirm.disabled = true;
                this.btnConfirm.innerText = "Ingresa tu Nombre";
            }
        }
    }

    sendWhatsApp() {
        const fullDate = `${this.selectedDay} de ${this.monthNames[this.currentDate.getMonth()]}`;
        const text = `Hola ${this.config.businessName}! Soy ${this.clientName}. Quisiera reservar turno para el día ${fullDate} a las ${this.selectedTime} hs.`;
        const url = `https://wa.me/${this.config.phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        closeTurnero();
    }
}
