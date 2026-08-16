import WeatherWidget from './WeatherWidget';
import WhatsappWidget from './WhatsappWidget';
import CarouselWidget from './CarouselWidget';
import TurneroWidget from './TurneroWidget';
import CartWidget from './CartWidget';

export const WIDGET_REGISTRY = {
    'WeatherWidget': WeatherWidget,
    'WhatsappWidget': WhatsappWidget,
    'CarouselWidget': CarouselWidget,
    'TurneroWidget': TurneroWidget,
    'CartWidget': CartWidget
};

export const STANDARD_WIDGETS_LIST = [
    { id: 'WeatherWidget', name: 'Weather Widget', type: 'Utility' },
    { id: 'WhatsappWidget', name: 'Whatsapp Button', type: 'Communication' },
    { id: 'CarouselWidget', name: 'Smart Carousel', type: 'Display' },
    { id: 'TurneroWidget', name: 'Booking Turnero', type: 'Utility' },
    { id: 'CartWidget', name: 'Shopping Cart', type: 'E-commerce' }
];
