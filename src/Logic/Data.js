import axios from "axios";

export async function fetchData(from, to) {

    const apiUrl = 'https://api2.timedoctor.com/api/1.0/activity/worklog';
    const params = {
        'task-project-names': true,
        'exclude-fields': 'shift',
        'user': 'Ys7Ut7N0YcLukdZb',
        'from': from,
        'to': to,
        'company': 'YiUG_nAeY3kWpnOS'
    };
    const authToken = '1CZFNCaAn6NIlBX_bIzii-riVYo0xd1hIWPkO4WoZPRE';

    try {
        const response = await axios.get(apiUrl, {
            params,
            headers: {
                Authorization: `JWT ${authToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
            },
        });

        return response.data.data[0]

    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}

function eliminarCaracteresEspeciales(texto) {
    // Lista de caracteres a eliminar: * ? : \ / [ ]
    const caracteresEspeciales = /[*?:\/\[\]]/g;

    // Reemplaza los caracteres especiales con una cadena vacía
    const textoSinEspeciales = texto.replace(caracteresEspeciales, '');

    const textoLimitado = textoSinEspeciales.slice(0, 31);

    return textoLimitado;
}

export function groupByProjectName(data) {
    const projectMap = {};

    data.forEach(entry => {
        const projectName = eliminarCaracteresEspeciales(entry.projectName);

        const startTime = new Date(entry.start);
        const endTime = new Date(startTime.getTime() + entry.time * 1000);
        entry.timeEnd = endTime.toISOString();

        if (!projectMap[projectName]) {
            projectMap[projectName] = [];
        }

        projectMap[projectName].push(entry);
    });

    return projectMap;
}


