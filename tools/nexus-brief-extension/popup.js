// Espera a que todo el contenido del popup.html se haya cargado.
document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generateBriefBtn');
    const statusDiv = document.getElementById('status');

    // Agrega un listener para el clic en el botón.
    generateBtn.addEventListener('click', () => {
        // Deshabilita el botón y muestra un estado inicial.
        generateBtn.disabled = true;
        statusDiv.textContent = 'Iniciando, por favor espere...';

        // Envía un mensaje al service worker (background.js) para que inicie la acción.
        // Este es el núcleo de la comunicación en una extensión de Chrome.
        chrome.runtime.sendMessage({ action: "generateBrief" }, (response) => {
            // Esta función se ejecuta cuando background.js responde.
            if (chrome.runtime.lastError) {
                // Si hay un error de comunicación con el background script.
                statusDiv.textContent = `Error: ${chrome.runtime.lastError.message}`;
                generateBtn.disabled = false;
            } else if (response && response.error) {
                // Si el background script responde con un error específico.
                statusDiv.textContent = `Error: ${response.error}`;
                generateBtn.disabled = false;
            } else if (response && response.success) {
                // Si todo fue exitoso.
                statusDiv.textContent = '¡Brief generado con éxito!';
                 // Opcional: podrías mostrar el brief aquí, pero por ahora solo confirmamos.
            }
        });
    });
});