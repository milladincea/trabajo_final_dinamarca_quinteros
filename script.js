// ── Gráfico 1 ─────────────
    // ── IMAGEN SVG EN HTML ─────────────

// ── Gráfico 2 ─────────────
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
// ── Gráfico 3 ─────────────


// ── Gráfico 4 ─────────────


// ── Tabla dinámica con buscador ───────────────────────────────────────
const TRONCALES = {
    "V y M": [
        "Diseño editorial y publicación",
        "Diseño y visualización de información",
        "Diseño de interacción y experiencia"
    ],
    "I y S": [
        "Prototipado y comunicación de experiencias y servicios",
        "Materiales, tecnologías y Procesos de fabricación",
        "Modelamiento y representación digital"
    ]
};

const TRONCALES_AREA = {
    "V y M": [
        "Comunicación y Gestión del Diseño",
        "Comunicación y Gestión del Diseño",
        "Comunicación y Gestión del Diseño"
    ],
    "I y S": [
        "Comunicación y Gestión del Diseño",
        "Ciencia y Tecnología",
        "Ciencia y Tecnología"
    ]
};


let mencionActiva   = null;    // "V y M" | "I y S" | "Ambas" | null
let columnas        = [];      // orden de índices 0,1,2
let electivos       = [null, null, null]; // hasta 3 electivos elegidos {mencion,area,electivo,enfoque}
let dragSrcIdx      = null;


const tbody        = document.querySelector("#este");
const URL_API      = "https://api.myjson.online/v1/records/79742d90-1720-4297-87e0-5ce5927429e7";
let todosLosDatos  = [];

fetch(URL_API)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(datos => {
        todosLosDatos = datos.data;
        renderBuscador(todosLosDatos);
    })
    .catch(err => console.error("Error cargando datos:", err));

function renderBuscador(lista) {
    tbody.innerHTML = "";
    lista.forEach(x => {
        const tr = document.createElement("tr");
        if (x.ok == 1) {
            tr.style.cssText = "background-color: var(--color-iluminadisimo); color: var(--color-oscurisimo)";
        }

        const yaAgregado   = electivos.some(e => e && e.electivo === x.electivo);
        const sinSlots     = electivos.every(e => e !== null);
        const mencionOk    = !mencionActiva || x.mencion === mencionActiva || x.mencion === "Ambas";
        const deshabilitado = yaAgregado || (sinSlots && !yaAgregado) || !mencionOk;

        tr.innerHTML = `
            <td>${x.mencion}</td>
            <td>${x.area}</td>
            <td>${x.electivo}</td>
            <td>${x.enfoque}</td>
            <td style="text-align:center;white-space:nowrap;">
                <button class="btn-agregar${yaAgregado ? " ya-agregado" : (!mencionOk ? " no-mencion" : "")}"
                        data-electivo='${JSON.stringify(x).replace(/'/g, "&#39;")}'
                        ${deshabilitado ? "disabled" : ""}>
                    ${yaAgregado ? "✓" : (!mencionOk ? "—" : "+ Agregar")}
                </button>
            </td>`;
        tbody.appendChild(tr);
    });


    tbody.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", function() {
            if (this.disabled) return;
            const data = JSON.parse(this.getAttribute("data-electivo"));
            agregarElectivo(data);
        });
    });
}

            
function sinAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

document.getElementById("elInput").addEventListener("keyup", function () {
    const valor = sinAcentos(this.value.toLowerCase());
    document.querySelectorAll("#este tr").forEach(fila => {
        fila.style.display = sinAcentos(fila.textContent.toLowerCase()).includes(valor) ? "" : "none";
    });
});


document.querySelectorAll(".btn-mencion").forEach(btn => {
    btn.addEventListener("click", function() {
        mencionActiva = this.dataset.mencion;
        document.querySelectorAll(".btn-mencion").forEach(b => b.classList.remove("activo"));
        this.classList.add("activo");

        // Resetear electivos al cambiar mención
        electivos = [null, null, null];
        columnas  = [0, 1, 2];

        renderTablaPlan();
        renderBuscador(todosLosDatos);
        document.getElementById("instruccion-paso2").style.display = "block";
        document.getElementById("estado-vacio").style.display = "none";
    });
});

function renderTablaPlan() {
    if (!mencionActiva) {
        document.getElementById("estado-vacio").style.display = "block";
        return;
    }

    const troncales     = TRONCALES[mencionActiva];
    const troncalesArea = TRONCALES_AREA[mencionActiva];

    const filaEnc = document.getElementById("fila-encabezados");
    while (filaEnc.children.length > 1) filaEnc.removeChild(filaEnc.lastChild);

    columnas.forEach((colIdx, posicion) => {
        const th = document.createElement("th");
        th.classList.add("col-arrastrable");
        th.dataset.colidx = colIdx;
        th.draggable = true;
        th.innerHTML = `<span class="drag-handle">⠿</span><span class="col-num">${posicion + 1}</span> Electivo ${posicion + 1}`;

        th.addEventListener("dragstart", onDragStart);
        th.addEventListener("dragover",  onDragOver);
        th.addEventListener("drop",      onDrop);
        th.addEventListener("dragend",   onDragEnd);

        filaEnc.appendChild(th);
    });

    const filaTroncal = document.getElementById("fila-troncal");
    while (filaTroncal.children.length > 1) filaTroncal.removeChild(filaTroncal.lastChild);

    columnas.forEach(colIdx => {
        const td = document.createElement("td");
        td.innerHTML = `${troncales[colIdx] || "—"}<span class="subtitulo-area">${troncalesArea[colIdx] || ""}</span>`;
        filaTroncal.appendChild(td);
    });

    
    const filaOpc = document.getElementById("fila-e1");
    while (filaOpc.children.length > 1) filaOpc.removeChild(filaOpc.lastChild);

    columnas.forEach((colIdx, posicion) => {
        const elec = electivos[colIdx];
        const td   = document.createElement("td");

        if (!elec) {
            td.classList.add("celda-vacia");
            td.textContent = "— vacío —";
        } else {
            td.innerHTML = `${elec.electivo}<span class="subtitulo-area">${elec.area}</span>`;

            const btn = document.createElement("button");
            btn.className = "btn-quitar";
            btn.title = "Quitar electivo";
            btn.textContent = "✕";
            btn.addEventListener("click", () => {
                electivos[colIdx] = null;
                renderTablaPlan();
                renderBuscador(todosLosDatos);
            });
            td.appendChild(btn);
        }

        filaOpc.appendChild(td);
    });
}


function agregarElectivo(data) {
    if (!mencionActiva) {
        alert("Primero selecciona una mención.");
        return;
    }

    const slotLibre = columnas.find(colIdx => electivos[colIdx] === null);
    if (slotLibre === undefined) return;

    electivos[slotLibre] = {
        mencion:  data.mencion,
        area:     data.area,
        electivo: data.electivo,
        enfoque:  data.enfoque
    };

    renderTablaPlan();
    renderBuscador(todosLosDatos);
}


function onDragStart(e) {
    dragSrcIdx = parseInt(this.dataset.colidx);
    e.dataTransfer.effectAllowed = "move";
    this.style.opacity = "0.5";
}

function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".col-arrastrable").forEach(th => th.classList.remove("dragging-over"));
    this.classList.add("dragging-over");
}

function onDrop(e) {
    e.stopPropagation();
    const targetIdx = parseInt(this.dataset.colidx);
    if (dragSrcIdx === null || dragSrcIdx === targetIdx) return;

    const srcPos = columnas.indexOf(dragSrcIdx);
    const tgtPos = columnas.indexOf(targetIdx);
    [columnas[srcPos], columnas[tgtPos]] = [columnas[tgtPos], columnas[srcPos]];

    renderTablaPlan();
}

function onDragEnd(e) {
    this.style.opacity = "";
    document.querySelectorAll(".col-arrastrable").forEach(th => {
        th.classList.remove("dragging-over");
    });
    dragSrcIdx = null;
}


document.getElementById("estado-vacio").style.display = "block";
columnas = [0, 1, 2];
