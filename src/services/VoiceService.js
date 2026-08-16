/**
 * Nexus Voice Service
 * Gestiona la comunicación con el microservicio VibeVoice
 */

class VoiceService {
  constructor() {
    this.socket = null;
    this.audioCtx = null;
    this.isPlaying = false;
    this.queue = [];
  }

  async initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  speak(text, options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.initAudio();
        
        const { voice = 'en-Carter_man', steps = 5 } = options;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // Esto tomará la IP local si se accede vía IP
        const wsUrl = `${protocol}//${host}/voice-ws/stream?text=${encodeURIComponent(text)}&voice=${voice}&steps=${steps}`;

        if (this.socket) {
          if (this.socket.readyState === WebSocket.CONNECTING) {
             this.socket.onopen = () => this.socket.close();
          } else {
             this.socket.close();
          }
        }

        this.socket = new WebSocket(wsUrl);
        this.socket.binaryType = 'arraybuffer';

        let nextStartTime = 0;
        const INITIAL_BUFFER = 2.0; // 2 segundos para dar tiempo a la CPU
        let isFirstChunk = true;

        this.socket.onmessage = async (event) => {
          if (event.data instanceof ArrayBuffer) {
            const pcm16 = new Int16Array(event.data);
            const float32 = new Float32Array(pcm16.length);
            for (let i = 0; i < pcm16.length; i++) {
              float32[i] = pcm16[i] / 32768.0;
            }

            const audioBuffer = this.audioCtx.createBuffer(1, float32.length, 24000);
            audioBuffer.copyToChannel(float32, 0);

            const source = this.audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioCtx.destination);
            
            const now = this.audioCtx.currentTime;
            
            // Lógica de Sincronización Estricta
            if (isFirstChunk || nextStartTime < now - 0.1) {
                // Si es el inicio o hubo un vacío mayor a 100ms, aplicamos el colchón completo
                nextStartTime = now + INITIAL_BUFFER;
                isFirstChunk = false;
                console.log(`[Voice] Jitter Buffer Active: ${INITIAL_BUFFER}s`);
            }
            
            source.start(nextStartTime);
            nextStartTime += audioBuffer.duration;
            
          } else {
            const msg = JSON.parse(event.data);
            if (msg.event === 'backend_stream_complete') {
              console.log('Voice stream complete');
            }
          }
        };

        this.socket.onerror = (err) => {
          console.error('Voice Socket Error:', err);
          reject(err);
        };

        this.socket.onclose = () => {
          this.socket = null;
          resolve();
        };

      } catch (err) {
        reject(err);
      }
    });
  }

  stop() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const voiceService = new VoiceService();
