const cron = require('node-cron');

// Lista de tareas con formato: { mensaje, hora }
const tareas = [
  { mensaje: "Reunión diaria de equipo", hora: "14:30" },
  { mensaje: "Enviar reporte semanal", hora: "15:00" },
  { mensaje: "Tomar agua 🌊", hora: "17:30" }
];

// Función para obtener la hora actual en formato HH:mm
function obtenerHoraActual() {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  return `${horas}:${minutos}`;
}

// Cron job que se ejecuta cada minuto
cron.schedule('* * * * *', () => {
  const horaActual = obtenerHoraActual();
  console.log(`⏰ Verificando tareas a las ${horaActual}...`);

  tareas.forEach(tarea => {
    if (tarea.hora === horaActual) {
      console.log(`📢 Recordatorio: ${tarea.mensaje}`);
    }
  });
});
