// const ExcelJS = require('exceljs')

import ExcelJS from 'exceljs';

// const ExcelJS = require('exceljs');

export async function createExcelPages(groupedData) {
    const workbook = new ExcelJS.Workbook();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

    for (const projectName in groupedData) {
        if (groupedData.hasOwnProperty(projectName)) {
            const worksheet = workbook.addWorksheet(projectName);


            // Agrega encabezados a la hoja de cálculo
            worksheet.addRow(['Proyecto', 'Ticket', 'Tipo de Trabajo', 'Descripcion del progreso', 'Hora Inicio', '	Hora Final']);

            // Agrega datos a la hoja de cálculo
            let lastDay = null;
            
            groupedData[projectName].forEach(entry => {

                const currentDay = new Date(entry.start).getDate();

                if (lastDay !== null && currentDay !== lastDay) {
                    // Inserta una fila vacía
                    worksheet.addRow([]);
                }

                worksheet.addRow([
                    entry.projectName,
                    '',
                    entry.taskName,
                    '',
                    new Date(entry.start).toLocaleString('es-ES', options),  // Cambia 'es-ES' al código de tu idioma
                    new Date(entry.timeEnd).toLocaleString('es-ES', options)
                ]);

                lastDay = currentDay;
            });
        }
    }

    // Guarda el archivo Excel
    // const excelFileName = 'output.xlsx';

    workbook.xlsx.writeBuffer()
        .then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Crear un enlace de descarga
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'output.xlsx';

            // Agregar el enlace al DOM y hacer clic automáticamente
            document.body.appendChild(a);
            a.click();

            // Limpiar el enlace del DOM después de la descarga
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error al exportar Excel:', error.message);
        });
}