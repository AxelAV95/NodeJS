const cron = require('node-cron');
const admin = require('firebase-admin');
const db = require('./conexionDB'); // Tu archivo de conexión a la base de datos

admin.initializeApp({
  credential: admin.credential.cert(require('./credenciales-firebase.json')),
});

const revisarStockYSolicitarNotificacion = async () => {
  const productos = await db.getProductos(); // Simulado
  const productosBajoStock = productos.filter(p => p.stock <= 5);

  if (productosBajoStock.length === 0) return;

  const mensaje = {
    notification: {
      title: '⚠️ Alerta de Stock Bajo',
      body: `Hay ${productosBajoStock.length} productos con stock crítico.`,
    },
    tokens: await db.getTokensDispositivos(), // tokens FCM de los usuarios de la app
  };

  admin.messaging().sendMulticast(mensaje)
    .then(res => console.log("Notificación enviada:", res.successCount))
    .catch(err => console.error("Error al enviar notificación:", err));
};

cron.schedule('0 9 * * 1', revisarStockYSolicitarNotificacion); // Todos los lunes 9:00 AM
