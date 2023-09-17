const simulacionesAnterioresGuardadas = localStorage.getItem('simulacionesAnteriores');
const simulacionesAnteriores = simulacionesAnterioresGuardadas ? JSON.parse(simulacionesAnterioresGuardadas) : [];


const prestamosSimulados = [
    {
        monto: 250000,
        tasaInteresAnual: 8,
        plazoMeses: 12,
        cuotaMensual: calcularCuotaMensual(250000, 8, 12)
    },
    {
        monto: 550000,
        tasaInteresAnual: 6.5,
        plazoMeses: 24,
        cuotaMensual: calcularCuotaMensual(500000, 6.5, 24)
    },
    {
        monto: 150000,
        tasaInteresAnual: 7.2,
        plazoMeses: 36,
        cuotaMensual: calcularCuotaMensual(150000, 7.2, 36)
    }
];
const output = document.getElementById("output");


// Objeto para representar un préstamo
class Prestamo {
    constructor(monto, tasaInteresAnual, plazoMeses, cuotaMensual) {
        this.monto = monto;
        this.tasaInteresAnual = tasaInteresAnual;
        this.plazoMeses = plazoMeses;
        this.cuotaMensual = cuotaMensual;
    }
}

// Función para calcular la cuota mensual
function calcularCuotaMensual(monto, tasaInteresAnual, plazoMeses) {
    const tasaMensual = tasaInteresAnual / 100 / 12;
    const factor = calcularFactor(plazoMeses, tasaMensual);
    const cuota = (monto * tasaMensual * factor) / (factor - 1);
    return cuota.toFixed(2);
}

// Función para calcular el factor
function calcularFactor(plazoMeses, tasaMensual) {
    let factor = 1;
    for (let i = 0; i < plazoMeses; i++) {
        factor *= 1 + tasaMensual;
    }
    return factor;
}


function aprobarPrestamo(tasaInteresAnual, montoPrestamo) {
    const tasaAprobacion = 15; // Tasa de interés máxima para aprobación
    const montoAprobacion = 500000; // Monto máximo para aprobación

    if (tasaInteresAnual <= tasaAprobacion && montoPrestamo <= montoAprobacion) {
        return "El préstamo es Aprobado";
    } else {
        return "El préstamo es Rechazado";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const simulateBtn = document.getElementById("simulateBtn");
    const viewBtn = document.getElementById("viewBtn");
    const clearBtn = document.getElementById("clearBtn");
    const montoInput = document.getElementById("monto");
    const tasaInteresInput = document.getElementById("tasaInteres");
    const plazoInput = document.getElementById("plazo");


    function mostrarPrestamo(prestamo, index) {
        const prestamoInfo = document.createElement("div");
        prestamoInfo.className = "prestamo-info";
        prestamoInfo.innerHTML =
            "<strong>Simulación " + (index ? index : "") + ":</strong><br>" +
            "Monto del préstamo: $" + prestamo.monto + "<br>" +
            "Tasa de interés anual: " + prestamo.tasaInteresAnual + "%<br>" +
            "Plazo en meses: " + prestamo.plazoMeses + "<br>" +
            "Cuota mensual: $" + prestamo.cuotaMensual + "<br>" +
            aprobarPrestamo(prestamo.tasaInteresAnual, prestamo.monto);
    
        output.appendChild(prestamoInfo);
    
        // Guardar la simulación en localStorage
        simulacionesAnteriores.push(prestamo);
        localStorage.setItem('simulacionesAnteriores', JSON.stringify(simulacionesAnteriores));
    }
    

    simulateBtn.addEventListener("click", () => {
        output.innerHTML = ""; // Limpiar el contenido anterior

        const montoPrestamo = parseFloat(montoInput.value);
        const tasaInteresAnual = parseFloat(tasaInteresInput.value);
        const plazoMeses = parseInt(plazoInput.value);

        if (isNaN(montoPrestamo) || isNaN(tasaInteresAnual) || isNaN(plazoMeses) || plazoMeses <= 0) {
            output.textContent = "Por favor, ingresar un valor numérico correcto.";
        } else {
            const cuotaMensual = calcularCuotaMensual(montoPrestamo, tasaInteresAnual, plazoMeses);

            const nuevoPrestamo = { ...{ monto: montoPrestamo, tasaInteresAnual: tasaInteresAnual, plazoMeses: plazoMeses, cuotaMensual: cuotaMensual } };
            prestamosSimulados.push(nuevoPrestamo);

            mostrarPrestamo(nuevoPrestamo);
        }
    });

    

    viewBtn.addEventListener("click", () => {
        output.innerHTML = ""; // Limpiar el contenido anterior

        if (prestamosSimulados.length === 0) {
            output.textContent = "No hay simulaciones anteriores.";
        } else {
            prestamosSimulados.forEach((prestamo, index) => {
                mostrarPrestamo(prestamo, index + 1);
            });
        }
    });


    clearBtn.addEventListener("click", () => {
        output.innerHTML = ""; // Limpiar el contenido anterior
        montoInput.value = "";
        tasaInteresInput.value = "";
        plazoInput.value = "";
    });
});
