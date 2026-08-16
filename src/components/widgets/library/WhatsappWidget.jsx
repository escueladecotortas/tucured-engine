import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsappWidget({ phone = '549381000000', message = 'Hola!', position = 'right' }) {
    return (
        <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 ${position === 'left' ? 'left-6' : 'right-6'} p-4 bg-green-500 hover:bg-green-400 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center justify-center`}
        >
            <MessageCircle className="w-8 h-8 text-white fill-current" />
        </a>
    );
}

// CONFIG_SCHEMA:
// {
//   "phone": "string (International format)",
//   "message": "string (Default text)",
//   "position": ["left", "right"]
// }
