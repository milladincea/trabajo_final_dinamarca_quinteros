// ── Gráfico 1 ─────────────


// ── Gráfico 2 ─────────────


// ── Gráfico 3 ─────────────


// ── Gráfico 4 ─────────────


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
