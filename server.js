const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const app = express();

app.use(express.json());

// Variables globales
let qrCode = null;
let client = null;
let isConnected = false;

// Inicializar WhatsApp
function initWhatsApp() {
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', async (qr) => {
        console.log('🔵 QR recibido');
        qrCode = await qrcode.toDataURL(qr);
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp CONECTADO!');
        isConnected = true;
        qrCode = null;
    });

    client.on('disconnected', () => {
        console.log('❌ WhatsApp desconectado');
        isConnected = false;
        setTimeout(initWhatsApp, 5000);
    });

    client.initialize();
}

// Iniciar
initWhatsApp();

// RUTAS DE LA API
app.get('/', (req, res) => {
    res.json({ 
        status: 'WhatsApp API Bolivia',
        whatsapp: isConnected ? 'conectado' : 'pendiente',
        endpoints: ['/qr', '/send', '/status']
    });
});

app.get('/qr', (req, res) => {
    if (isConnected) {
        return res.json({ status: '✅ Ya estás conectado a WhatsApp' });
    }
    if (qrCode) {
        return res.send(`<img src="${qrCode}" alt="QR Code" /><p>Escanea este QR con WhatsApp</p>`);
    }
    res.json({ status: 'Generando QR... refresca en 5 segundos' });
});

app.post('/send', async (req, res) => {
    if (!isConnected) {
        return res.status(400).json({ error: 'WhatsApp no conectado. Escanea el QR primero en /qr' });
    }

    const { phone, message } = req.body;
    
    if (!phone || !message) {
        return res.status(400).json({ error: 'Se requiere phone y message' });
    }

    // Formatear número: 59171234567 -> 59171234567@c.us
    const formattedPhone = phone.replace(/\D/g, '');
    const chatId = `${formattedPhone}@c.us`;

    try {
        await client.sendMessage(chatId, message);
        res.json({ success: true, message: `Mensaje enviado a ${phone}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/status', (req, res) => {
    res.json({ 
        connected: isConnected,
        qr_available: !!qrCode,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor WhatsApp API en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📱 Escanea el QR en: /qr`);
});
