// ejercicios/ejercicio3.js
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class BackupService {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.backupDir = path.join(__dirname, '../backups');
        this.ensureDirectories();
        this.createSampleData();
    }

    ensureDirectories() {
        [this.dataDir, this.backupDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    createSampleData() {
        const sampleData = {
            users: [
                { id: 1, name: 'Juan Pérez', email: 'juan@email.com' },
                { id: 2, name: 'María García', email: 'maria@email.com' },
                { id: 3, name: 'Carlos López', email: 'carlos@email.com' }
            ],
            settings: {
                theme: 'dark',
                language: 'es',
                notifications: true
            },
            lastUpdated: new Date().toISOString()
        };

        const dataFile = path.join(this.dataDir, 'app-data.json');
        fs.writeFileSync(dataFile, JSON.stringify(sampleData, null, 2));
    }

    async createBackup() {
        try {
            logger.info('📦 Iniciando proceso de respaldo...');

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup-${timestamp}.json`;
            const backupPath = path.join(this.backupDir, backupFileName);

            // Leer datos actuales
            const dataFile = path.join(this.dataDir, 'app-data.json');
            const data = fs.readFileSync(dataFile, 'utf8');

            // Agregar metadata del respaldo
            const backupData = {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                data: JSON.parse(data)
            };

            // Escribir respaldo
            fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

            logger.success(`✅ Respaldo creado exitosamente: ${backupFileName}`);
            this.cleanOldBackups();

        } catch (error) {
            logger.error(`❌ Error al crear respaldo: ${error.message}`);
        }
    }

    cleanOldBackups() {
        try {
            const files = fs.readdirSync(this.backupDir);
            const backupFiles = files
                .filter(file => file.startsWith('backup-'))
                .map(file => ({
                    name: file,
                    path: path.join(this.backupDir, file),
                    stats: fs.statSync(path.join(this.backupDir, file))
                }))
                .sort((a, b) => b.stats.mtime - a.stats.mtime);

            // Mantener solo los últimos 5 respaldos
            if (backupFiles.length > 5) {
                const filesToDelete = backupFiles.slice(5);
                filesToDelete.forEach(file => {
                    fs.unlinkSync(file.path);
                    logger.info(`🗑️ Respaldo antiguo eliminado: ${file.name}`);
                });
            }
        } catch (error) {
            logger.error(`❌ Error al limpiar respaldos antiguos: ${error.message}`);
        }
    }
}

// Inicializar servicio
const backupService = new BackupService();

logger.info('🚀 Iniciando servicio de respaldos automáticos');

// Crear respaldo cada 2 minutos (para pruebas)
const backupTask = cron.schedule('*/2 * * * *', () => {
    backupService.createBackup();
});

// Crear respaldo inmediato para prueba
setTimeout(() => {
    logger.info('🔄 Creando respaldo inicial...');
    backupService.createBackup();
}, 5000);

logger.info('✅ Servicio de respaldos iniciado (cada 2 minutos)');

process.on('SIGINT', () => {
    logger.info('🛑 Deteniendo servicio de respaldos...');
    backupTask.destroy();
    process.exit(0);
});