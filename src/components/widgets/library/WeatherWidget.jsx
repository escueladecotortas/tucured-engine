import React from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

export default function WeatherWidget({ city = 'Tucumán', temp = 24, condition = 'sunny' }) {
    const getIcon = () => {
        switch (condition) {
            case 'rain': return <CloudRain className="w-12 h-12 text-blue-400" />;
            case 'cloudy': return <Cloud className="w-12 h-12 text-gray-400" />;
            default: return <Sun className="w-12 h-12 text-yellow-400" />;
        }
    };

    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md w-full max-w-xs">
            <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-xs">{city}</h4>
            <div className="flex items-center gap-4">
                {getIcon()}
                <div>
                    <span className="text-4xl font-bold text-white">{temp}°</span>
                    <p className="text-sm text-gray-400 capitalize">{condition}</p>
                </div>
            </div>
        </div>
    );
}
// CONFIG_SCHEMA:
// {
//   "city": "string",
//   "temp": "number",
//   "condition": ["sunny", "rain", "cloudy"]
// }
