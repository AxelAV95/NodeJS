// ejercicios/ejercicio2.js
const cron = require('node-cron');
const logger = require('../utils/logger');

logger.info('🚀 Iniciando ejercicio 2 - Logger personalizado');

// Ejecutar cada 30 segundos
const task = cron.schedule('*/30 * * * * *', () => {
    logger.info('⏰ Tarea ejecutándose cada 30 segundos');
    
    // Simular algún trabajo
    const randomNum = Math.floor(Math.random() * 100);
    
    if (randomNum > 70) {
        logger.success(`✅ Operación exitosa! Número generado: ${randomNum}`);
    } else if (randomNum < 30) {
        logger.error(`❌ Error simulado! Número bajo: ${randomNum}`);
    } else {
        logger.info(`ℹ️ Operación normal. Número: ${randomNum}`);
    }
});

logger.info('✅ Cron job con logger iniciado');

process.on('SIGINT', () => {
    logger.info('🛑 Deteniendo aplicación...');
    task.destroy();
    process.exit(0);
});