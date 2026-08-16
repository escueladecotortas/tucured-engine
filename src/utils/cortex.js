import { doc, collection, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';

// Knowledge Base for Context Awareness
const TEMPLATES = {
    web: [
        { title: "Definición de Stack Tecnológico", agent: "nexus", priority: "high", status: "completed" },
        { title: "Diseño de Sistema Visual (Figma)", agent: "atenea", priority: "high", status: "in_progress" },
        { title: "Desarrollo de Landing Page", agent: "icaro", priority: "standard", status: "pending" }
    ],
    marketing: [
        { title: "Análisis de Competencia", agent: "nexus", priority: "standard", status: "completed" },
        { title: "Creación de Copywriting Persuasivo", agent: "icaro", priority: "high", status: "in_progress" },
        { title: "Campaña de Ads (Meta/Google)", agent: "deco", priority: "high", status: "pending" }
    ],
    design: [
        { title: "Moodboard y Referencias", agent: "atenea", priority: "standard", status: "completed" },
        { title: "Bocetado de Identidad", agent: "atenea", priority: "high", status: "in_progress" },
        { title: "Presentación de Concepto", agent: "deco", priority: "high", status: "pending" }
    ],
    default: [
        { title: "Inicialización de Repositorio", agent: "nexus", priority: "standard", status: "completed" },
        { title: "Reunión de Kick-off", agent: "deco", priority: "high", status: "in_progress" },
        { title: "Planificación de Sprint 1", agent: "nexus", priority: "standard", status: "pending" }
    ]
};

// "Think" Function
const detectContext = (name, slogan) => {
    const text = (name + " " + slogan).toLowerCase();
    if (text.includes("web") || text.includes("app") || text.includes("soft") || text.includes("tech")) return "web";
    if (text.includes("marketing") || text.includes("ventas") || text.includes("ads") || text.includes("social")) return "marketing";
    if (text.includes("design") || text.includes("diseño") || text.includes("deco") || text.includes("arte")) return "design";
    return "default";
};

export const igniteCortex = async (projectId, projectData) => {
    console.log("🧠 CORTEX: Analizando semántica del proyecto...", projectData.name);

    const context = detectContext(projectData.name, projectData.slogan);
    console.log("🧠 CORTEX: Contexto detectado ->", context.toUpperCase());

    const missions = TEMPLATES[context] || TEMPLATES.default;
    const batch = writeBatch(db);

    // 1. Generate Missions
    missions.forEach((mission, index) => {
        const ref = doc(collection(db, "projects", projectId, "missions"));
        batch.set(ref, {
            ...mission,
            createdAt: serverTimestamp(),
            description: `Generado automáticamente por Cortex para contexto ${context}.`
        });
    });

    // 2. Update Agents (Give them a "brain" update)
    // We fetch the missions relevant agents and update their status
    // For simplicity in this v1, we just update the specific agents mentioned in missions

    // (This part would be ideally done by reading current agents, but used writeBatch for speed)
    // We will trust the GenesisWizard created the agents. We can overwrite their status here.

    const agentsToUpdate = [...new Set(missions.map(m => m.agent))];
    agentsToUpdate.forEach(agentId => {
        const currentMission = missions.find(m => m.agent === agentId && m.status === 'in_progress');
        if (currentMission) {
            const agentRef = doc(db, "projects", projectId, "agents", agentId);
            batch.update(agentRef, {
                status: 'working',
                current_task: `Ejecutando: ${currentMission.title}`,
                stats: {
                    processing: Math.floor(Math.random() * 20) + 80, // Random "high" activity
                    sync: 100
                }
            });
        }
    });

    await batch.commit();
    console.log("🧠 CORTEX: Inyección de inteligencia completada.");
    return context;
};
