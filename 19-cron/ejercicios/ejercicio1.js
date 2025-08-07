// ejercicios/ejercicio1.js
const cron = require('node-cron');

console.log('🚀 Iniciando primer cron job...');

// Ejecutar cada minuto
const task = cron.schedule('* * * * *', () => {
    const now = new Date();
    console.log(`⏰ Ejecutándose cada minuto: ${now.toLocaleString()}`);
}, {
    scheduled: false // No iniciar automáticamente
});

// Iniciar la tarea
task.start();

console.log('✅ Cron job iniciado. Presiona Ctrl+C para detener.');

// Mantener el proceso vivo
process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo cron job...');
    task.destroy();
    process.exit(0);
});