// Archivo: backend/services/injector/manifest/WidgetConfigs.js
// Constructor de configuraciones de widgets

class WidgetConfigs {
    static build(widgetName, prospectData, name, phone, igHandle) {
        return {
            name: widgetName,
            label: widgetName.replace(/_/g, ' ').toUpperCase(),
            slotId: `nexus-${widgetName}`,
            floating: false,
            props: { name, phone, igHandle }
        };
    }
}

module.exports = WidgetConfigs;
