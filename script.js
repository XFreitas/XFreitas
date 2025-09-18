'use strict'

const temaClaro = document.getElementById('tema-claro');
const temaEscuro = document.getElementById('tema-escuro');
const temaAuto = document.getElementById('tema-auto');
const dropdownTheme = document.getElementById('dropdown-theme');

const minutes_to_string = (minutes) => {
    if (!minutes) {
        return '00:00';
    }

    const hours = String(Math.floor(minutes / 60));
    const remainingMinutes = String(minutes % 60);
    return `${hours.padStart(2, '0')}:${remainingMinutes.padStart(2, '0')}`;
}

class Ciclo {
    ciclo;
    horaIrParaACama;
    horaDormir;
    tempoDeSono;
    horaAcordar;

    constructor(ciclo, horaIrParaACama, horaDormir, tempoDeSono, horaAcordar) {
        this.ciclo = ciclo;
        this.horaIrParaACama = horaIrParaACama;
        this.horaDormir = horaDormir;
        this.tempoDeSono = tempoDeSono;
        this.horaAcordar = horaAcordar;
    }
}

const getStoredTheme = () => localStorage.getItem('theme')
const setStoredTheme = theme => localStorage.setItem('theme', theme)

const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
        return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const setTheme = theme => {
    dropdownTheme.textContent = theme === 'auto' ? '🌞' : theme === 'dark' ? '🌙' : '☀️';

    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }

    setStoredTheme(theme);
}

setTheme(getPreferredTheme())

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
    }
});

window.addEventListener('DOMContentLoaded', () => {
    temaClaro.addEventListener('click', () => setTheme('light'));
    temaEscuro.addEventListener('click', () => setTheme('dark'));
    temaAuto.addEventListener('click', () => setTheme('auto'));

    const dormirAcordar = document.getElementById('dormir_acordar');
    const hora = document.getElementById('hora');
    const calcularHorarios = document.getElementById('calcular_horarios');

    hora.value = dayjs().format('HH:mm');

    /**
     * @type {HTMLTableElement}
     */
    const tabelaHorarios = document.getElementById('tabela_horarios');

    calcularHorarios.addEventListener('click', () => {
        let horaValue = hora.value;

        const today = dayjs();

        if (horaValue) {
            horaValue = dayjs(`${today.format('YYYY-MM-DD')} ${horaValue}:00`);
        } else {
            horaValue = today;
        }

        const ciclos = [];
        const totalCiclos = 5;
        for (let i = 0; i < totalCiclos; i++) {
            const cicloObj = new Ciclo();

            if (dormirAcordar.value === 'acordar') {
                cicloObj.horaAcordar = horaValue.format('HH:mm');
                cicloObj.ciclo = (totalCiclos - i);
                let minutes = cicloObj.ciclo * 90;
                cicloObj.horaDormir = horaValue.subtract(minutes, 'minute').format('HH:mm');
                cicloObj.horaIrParaACama = horaValue.subtract((minutes + 15), 'minute').format('HH:mm');
                cicloObj.tempoDeSono = minutes_to_string(minutes);

                ciclos.unshift(cicloObj);
            } else if (dormirAcordar.value === 'ir_para_a_cama') {
                cicloObj.horaIrParaACama = horaValue.format('HH:mm');
                cicloObj.horaDormir = horaValue.add(15, 'minute').format('HH:mm');
                cicloObj.ciclo = i + 1;
                let minutes = cicloObj.ciclo * 90;
                cicloObj.horaAcordar = horaValue.add(minutes + 15, 'minute').format('HH:mm');
                cicloObj.tempoDeSono = minutes_to_string(minutes);

                ciclos.push(cicloObj);
            } else {
                cicloObj.horaDormir = horaValue.format('HH:mm');
                cicloObj.horaIrParaACama = horaValue.subtract(15, 'minute').format('HH:mm');
                cicloObj.ciclo = i + 1;
                let minutes = cicloObj.ciclo * 90;
                cicloObj.horaAcordar = horaValue.add(minutes, 'minute').format('HH:mm');
                cicloObj.tempoDeSono = minutes_to_string(minutes);

                ciclos.push(cicloObj);
            }


        }

        tabelaHorarios.tBodies.item(0).innerHTML = '';
        for (let index = 0; index < ciclos.length; index++) {
            const ciclo = ciclos[index];

            const tdCiclo = document.createElement('td');
            const tdHoraIrParaACama = document.createElement('td');
            const tdHoraDormir = document.createElement('td');
            const tdTempoDeSono = document.createElement('td');
            const tdHoraAcordar = document.createElement('td');

            tdCiclo.textContent = ciclo.ciclo;
            tdHoraIrParaACama.textContent = ciclo.horaIrParaACama;
            tdHoraDormir.textContent = ciclo.horaDormir;
            tdTempoDeSono.textContent = ciclo.tempoDeSono;
            tdHoraAcordar.textContent = ciclo.horaAcordar;

            const row = tabelaHorarios.tBodies.item(0).insertRow();

            if (index < 2) {
                row.classList.add('table-danger');
            } else if (index < 4) {
                row.classList.add('table-warning');
            } else {
                row.classList.add('table-primary');
            }


            row.append(
                tdCiclo,
                tdTempoDeSono,
                tdHoraIrParaACama,
                tdHoraDormir,
                tdHoraAcordar,
            )

        }
    });

});
