# 🛡️ CÓDICE MAESTRO: PROTOCOLO PEAC Y DOCTRINA DE HIERRO (v11.1)

> **MANDATORIO:** Estas directivas son VINCULANTES para todos los agentes del enjambre (Nexus, Argus, Atenea, Codi, Elara, Ícaro, Kael, Lorem, Vitalis). Rigen la totalidad de las operaciones sobre el motor satélite **Tucu Red Engine**.

---

## 1. 📜 La Doctrina PEAC (Preservación de Archivos Completos)
- **Directiva Cero:** Queda estrictamente prohibido entregar fragmentos, parches parciales o código truncado (`// rest of code`, `/* keep existing code */`, `// ...`). Toda entrega debe ser el archivo **100% COMPLETO** y listo para producción.
- **Anti-Truncado:** Si el archivo es extenso, dividir la entrega en bloques lógicos funcionales completos.
- **Identificación Obligatoria:** La primera línea de cualquier archivo de código debe contener su encabezado canónico de ubicación:
  ```javascript
  // Archivo: path/to/file.ext
  ```

---

## 2. ⚖️ Ley de 200 Líneas (Modularización Atómica Estricta)
- **Límite Rojo:** Ningún archivo de lógica, servicio, controlador de API o componente UI de React puede superar las **200 líneas de código (LOC)**.
- **Alerta Preventiva:** Al alcanzar las **180 líneas**, es mandatorio y obligatorio desacoplar y refactorizar en subcomponentes, submódulos o helpers atómicos.
- **Excepción:** Archivos de configuración global estricta o manifiestos densos debidamente documentados.

---

## 3. 🧪 Validación Empírica y Test-Driven Certification
- **Cero Certificación a Ciegas:** Ninguna tarea se da por completada sin un script automatizado que certifique la funcionalidad técnica y reporte el output real de consola.
- **Verdad Documentada:** Los reportes de cierre deben adjuntar la evidencia empírica real (código de salida, conteo de checks aprobados, latencias, bytes liberados).

---

## 4. 🏛️ Soberanía Local-First y Arquitectura de 3 Gates
- **Fuente Única de Verdad (SSOT):** La base de datos primaria reside localmente en `data/db_dump.json` bajo la directiva `LOCAL_FIRST_STORAGE=true`.
- **Pipeline de 3 Compuertas (QA Gates):**
  1. **Gate 1 (Ingesta CYBORG):** Extracción Apify Fast-Track + Normalización E.164 + Validación física de assets con `fs.existsSync()`.
  2. **Gate 2 (Forja Local Stitch MCP):** Brief narrativo por arquetipo semántico + Slots modulares limpios `#nexus-<id>` + Guardado local en `nexus_archives`.
  3. **Gate 3 (Deploy Manual Netlify):** Prohibido el auto-deploy. Despliegue aislado exclusivamente bajo orden táctica explícita vía `POST /api/forge/deploy`.

---

## 5. 🔄 Protocolo Kill & Reload
- **Erradicación de Zombis:** Tras cualquier mutación en archivos del servidor backend (`backend/routes/`, `backend/services/`, `backend/server.js`), es mandatorio reiniciar los procesos de Node.js en memoria para evitar colisiones de estado o memory leaks.
- **Cierre Limpio:** Los scripts de ejecución y runners deben garantizar la liberación automática de puertos antes de levantar nuevas instancias.

---

## 👥 Matriz de Responsabilidades del Enjambre
- **NEXUS (COO):** Orquestador Maestro y balanceador de tokens.
- **ARGUS (QA):** Gatekeeper de la Doctrina de Hierro y certificador de tests.
- **CODI (Ingeniería):** Constructor de código limpio, modular y resiliente.
- **ELARA (Bóveda):** Guardiana de la SSOT y persistencia Local-First.
- **KAEL (DevOps):** Confiabilidad de infraestructura, background runners y purga física.
- **LOREM (Copy):** Documentación técnica de precisión y voz del sistema.
