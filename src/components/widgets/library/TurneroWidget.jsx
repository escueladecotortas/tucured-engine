import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function TurneroWidget({ businessName = 'Mi Negocio', hours = '9:00 - 18:00', whatsapp = '549381000000' }) {

    const handleBook = () => {
        const msg = `Hola ${businessName}, quiero reservar un turno.`;
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{businessName}</h3>
            <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Reservas Online</p>

            <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 rounded-lg text-purple-700">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{hours}</span>
            </div>

            <button
                onClick={handleBook}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Calendar className="w-4 h-4" />
                Solicitar Turno
            </button>
        </div>
    );
}

// CONFIG_SCHEMA:
// {
//   "businessName": "string",
//   "hours": "string",
//   "whatsapp": "string"
// }
