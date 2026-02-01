const express = require('express');
const app = express();

app.use(express.json());

// Simulación de estado
let isConnected = false;
let qrCodeData = null;

// RUTAS DE LA API
app.get('/', (req, res) => {
    res.json({ 
        status: 'WhatsApp API Bolivia - MODO SIMULACIÓN',
        instrucciones: 'Para producción, usa Evolution API o WhatsApp Business API',
        endpoints: ['/qr', '/send', '/status']
    });
});

app.get('/qr', (req, res) => {
    if (isConnected) {
        return res.json({ 
            status: '✅ Conectado (modo simulación)',
            nota: 'En producción, aquí aparecería el QR real de WhatsApp'
        });
    }
    
    // QR de ejemplo (simulado)
    const fakeQR = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://web.whatsapp.com';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp QR</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                .container { max-width: 500px; margin: 0 auto; }
                .note { background: #f0f0f0; padding: 15px; border-radius: 10px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔗 Conectar WhatsApp</h1>
                <p>Este es un QR de ejemplo. En producción real, aquí aparecería el QR de WhatsApp Web.</p>
                
                <div class="note">
                    <h3>⚠️ Para usar en producción:</h3>
                    <p>1. Usa <strong>Evolution API</strong> (complejo pero potente)</p>
                    <p>2. Usa <strong>WhatsApp Business API</strong> (oficial de Meta)</p>
                    <p>3. Usa <strong>Twilio WhatsApp API</strong> (más fácil, tiene prueba gratis)</p>
                </div>
                
                <img src="${fakeQR}" alt="QR de ejemplo" width="300">
                
                <p><strong>Para desarrollo/testing:</strong> Puedes usar este sistema para probar tu frontend.</p>
            </div>
        </body>
        </html>
    `);
});

app.post('/send', async (req, res) => {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
        return res.status(400).json({ error: 'Se requiere phone y message' });
    }

    // Simular envío exitoso
    console.log(`📤 [SIMULACIÓN] Mensaje a ${phone}: ${message}`);
    
    res.json({ 
        success: true, 
        simulated: true,
        message: `Mensaje SIMULADO enviado a ${phone}`,
        nota: 'En producción, esto enviaría realmente por WhatsApp'
    });
});

app.get('/status', (req, res) => {
    res.json({ 
        connected: isConnected,
        simulated: true,
        service: 'WhatsApp API Bolivia - Modo desarrollo',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor WhatsApp API (modo simulación) en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`⚠️  Este es un servidor de SIMULACIÓN para desarrollo`);
    console.log(`📱 Accede a /qr para ver las instrucciones`);
});
