// ejercicios/ejercicio4.js
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('../utils/logger');

class SystemMonitor {
    constructor() {
        this.reportsDir = path.join(__dirname, '../reports');
        this.ensureReportsDir();
    }

    ensureReportsDir() {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    getSystemInfo() {
        const memoryUsage = process.memoryUsage();
        
        return {
            timestamp: new Date().toISOString(),
            system: {
                platform: os.platform(),
                architecture: os.arch(),
                hostname: os.hostname(),
                uptime: os.uptime(),
                loadAverage: os.loadavg(),
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                cpuCount: os.cpus().length
            },
            process: {
                pid: process.pid,
                uptime: process.uptime(),
                memoryUsage: {
                    rss: this.formatBytes(memoryUsage.rss),
                    heapTotal: this.formatBytes(memoryUsage.heapTotal),
                    heapUsed: this.formatBytes(memoryUsage.heapUsed),
                    external: this.formatBytes(memoryUsage.external)
                },
                cpuUsage: process.cpuUsage()
            }
        };
    }

    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    generateReport() {
        try {
            logger.info('📊 Generando reporte del sistema...');

            const systemInfo = this.getSystemInfo();
            const reportFileName = `system-report-${new Date().toISOString().split('T')[0]}.json`;
            const reportPath = path.join(this.reportsDir, reportFileName);

            // Leer reporte existente o crear nuevo
            let reportData = [];
            if (fs.existsSync(reportPath)) {
                const existingData = fs.readFileSync(reportPath, 'utf8');
                reportData = JSON.parse(existingData);
            }

            // Agregar nueva entrada
            reportData.push(systemInfo);

            // Guardar reporte actualizado
            fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

            logger.success(`✅ Reporte del sistema actualizado: ${reportFileName}`);
            
            // Mostrar resumen en consola
            this.displaySummary(systemInfo);

        } catch (error) {
            logger.error(`❌ Error al generar reporte: ${error.message}`);
        }
    }

    displaySummary(info) {
        const memoryUsagePercent = ((info.system.totalMemory - info.system.freeMemory) / info.system.totalMemory * 100).toFixed(2);
        
        logger.info(`
📈 Resumen del Sistema:
   💾 Memoria: ${memoryUsagePercent}% utilizada
   🖥️  CPU: ${info.system.cpuCount} núcleos
   ⏱️  Uptime Sistema: ${Math.floor(info.system.uptime / 3600)}h ${Math.floor((info.system.uptime % 3600) / 60)}m
   🔄 Uptime Proceso: ${Math.floor(info.process.uptime / 60)}m ${Math.floor(info.process.uptime % 60)}s
        `.trim());
    }
}

// Inicializar monitor
const systemMonitor = new SystemMonitor();

logger.info('🚀 Iniciando monitor de sistema');

// Generar reporte cada 5 minutos
const monitorTask = cron.schedule('*/5 * * * *', () => {
    systemMonitor.generateReport();
});

// Generar reporte inicial
setTimeout(() => {
    logger.info('🔄 Generando reporte inicial del sistema...');
    systemMonitor.generateReport();
}, 3000);

logger.info('✅ Monitor de sistema iniciado (reporte cada 5 minutos)');

process.on('SIGINT', () => {
    logger.info('🛑 Deteniendo monitor de sistema...');
    monitorTask.destroy();
    process.exit(0);
});