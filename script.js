// ── Gráfico 1 ─────────────


// ── Gráfico 2 ─────────────

// ── Gráfico 3 ─────────────


// ── Gráfico 4 ─────────────
    // ── Electivos IyS ─────────────
(function () {
    const ctx = document.getElementById('electivosBarChart');
    const labels = ['Comunicación y Estrategia', 'Ciencia y Tecnología', 'Morfología y Técnica'];
    const obligatorio      = [4, 4, 4];
    const electivoMencion  = [15, 31, 17];
    const electivoAmbas    = [30, 9, 11];
    const totales = labels.map((_, i) => obligatorio[i] + electivoMencion[i] + electivoAmbas[i]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Obligatorio', data: obligatorio, backgroundColor: '#9c9c9c' },
                { label: 'Electivo Mención', data: electivoMencion, backgroundColor: '#3266ad' },
                { label: 'Electivo de Ambas Menciones', data: electivoAmbas, backgroundColor: '#1d9e75' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 70,
                    title: { display: true, text: 'Cantidad de electivos' }
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        },
                        footer: function (items) {
                            const idx = items[0].dataIndex;
                            return 'Total: ' + totales[idx];
                        }
                    }
                }
            }
        }
    });
})();

    // ── Electivos VyM ─────────────
(function () {
    const ctx = document.getElementById('electivosBarChart2');
    const labels = ['Comunicación y Estrategia', 'Ciencia y Tecnología', 'Morfología y Técnica'];
    const obligatorio      = [4, 4, 4];
    const electivoMencion  = [28, 13, 18];
    const electivoAmbas    = [30, 9, 11];
    const totales = labels.map((_, i) => obligatorio[i] + electivoMencion[i] + electivoAmbas[i]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Obligatorio', data: obligatorio, backgroundColor: '#9c9c9c' },
                { label: 'Electivo Mención', data: electivoMencion, backgroundColor: '#3266ad' },
                { label: 'Electivo de Ambas Menciones', data: electivoAmbas, backgroundColor: '#1d9e75' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad de electivos' }
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        },
                        footer: function (items) {
                            const idx = items[0].dataIndex;
                            return 'Total: ' + totales[idx];
                        }
                    }
                }
            }
        }
    });
})();

// ── Tabla dinámica con buscador ───────────────────────────────────────

(function () {
    const cuerpoTabla = document.querySelector("#este");
    const endpoint = "https://api.myjson.online/v1/records/1348eff1-05df-45dd-9a05-061dd6f51d38";

    fetch(endpoint)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error("Error HTTP: " + respuesta.status);
            }
            return respuesta.json();
        })
        .then((datos) => {
            const trabajos = datos.data;
            trabajos.forEach((x) => {
                cuerpoTabla.innerHTML += `<tr style="${x.ok == 1 ? "background-color: var(--accent); color: white" : ""}"><td>${x.id}</td><td>${x.name}</td><td>${x.title}</td><td>${x.grade}</td><td>${x.category}</td><td>${x.tutor}</td></tr>`;
            });
        })
        .catch((error) => {
            console.error("Algo salió mal:", error);
        });

    function sinAcentos(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    document.getElementById("elInput").addEventListener("keyup", function () {
        const valor = sinAcentos(this.value.toLowerCase());
        document.querySelectorAll("#este tr").forEach(function (fila) {
            fila.style.display = sinAcentos(fila.textContent.toLowerCase()).includes(valor) ? "" : "none";
        });
    });
})();
