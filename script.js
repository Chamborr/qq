// Variables Globales
let jugador = {
    nombre: "", condicion: 100, striking: 10, grappling: 10, victorias: 0, derrotas: 0
};

let juego = {
    semanaActual: 1,
    semanaPelea: 5,
    oponente: null
};

// Iniciar Juego
function startGame() {
    jugador.nombre = document.getElementById('playerName').value || "Máximo";
    let spec = document.getElementById('playerSpec').value;

    if (spec === "Striker") { jugador.striking = 15; jugador.grappling = 5; }
    else { jugador.striking = 5; jugador.grappling = 15; }

    document.getElementById('creation-screen').style.display = "none";
    document.getElementById('main-hub').style.display = "block";
    
    programarNuevaPelea();
    actualizarUI();
    log(`¡Bienvenido ${jugador.nombre}! Tienes 4 semanas para prepararte para tu debut.`);
}

// Lógica de Iteración: Cada vez que haces algo, pasa 1 semana
function avanzarSemana(accion) {
    // 1. Aplicar los efectos de la decisión del jugador
    if (accion === 'striking') {
        let mejora = Math.floor(Math.random() * 3) + 1;
        jugador.striking += mejora;
        jugador.condicion -= 15;
        log(`Semana ${juego.semanaActual}: Entrenaste striking. (+${mejora} Str, -15% Condición)`);
    } 
    else if (accion === 'grappling') {
        let mejora = Math.floor(Math.random() * 3) + 1;
        jugador.grappling += mejora;
        jugador.condicion -= 15;
        log(`Semana ${juego.semanaActual}: Entrenaste grappling. (+${mejora} Gra, -15% Condición)`);
    } 
    else if (accion === 'descanso') {
        let recuperado = 30;
        jugador.condicion = Math.min(100, jugador.condicion + recuperado);
        log(`Semana ${juego.semanaActual}: Te tomaste la semana libre para descansar. (+${recuperado}% Condición)`);
    }

    // Cuidado con la fatiga
    if (jugador.condicion < 0) jugador.condicion = 0;

    // 2. Avanzar el tiempo
    juego.semanaActual++;

    // 3. Chequear si es la semana de la pelea
    if (juego.semanaActual === juego.semanaPelea) {
        ejecutarPelea();
    }

    actualizarUI();
}

function programarNuevaPelea() {
    juego.semanaPelea = juego.semanaActual + 4; // Campamento de 4 semanas
    
    // Generar rival basado en tu nivel
    let nivelRival = 10 + (jugador.victorias * 3);
    juego.oponente = {
        nombre: `Peleador #${Math.floor(Math.random() * 99)}`,
        striking: nivelRival + Math.floor(Math.random() * 5),
        grappling: nivelRival + Math.floor(Math.random() * 5)
    };
    
    log(`--- NUEVA PELEA CONFIRMADA: vs ${juego.oponente.nombre} ---`);
}

function ejecutarPelea() {
    log(`¡LLEGÓ LA NOCHE DE LA PELEA! ${jugador.nombre} vs ${juego.oponente.nombre}`);
    
    // Penalización si llegas sobreentrenado (baja condición)
    let penalidadFatiga = (100 - jugador.condicion) / 2; 
    
    let poderJugador = (jugador.striking + jugador.grappling) - penalidadFatiga + (Math.random() * 10);
    let poderOponente = (juego.oponente.striking + juego.oponente.grappling) + (Math.random() * 10);

    if (poderJugador >= poderOponente) {
        jugador.victorias++;
        log(`🔥 ¡VICTORIA! Le ganaste a ${juego.oponente.nombre}.`);
    } else {
        jugador.derrotas++;
        log(`💀 DERROTA. ${juego.oponente.nombre} te pasó por encima.`);
    }

    // Resetear condición un poco después de pelear
    jugador.condicion = 50; 
    
    // Programar el siguiente ciclo
    programarNuevaPelea();
}

function actualizarUI() {
    document.getElementById('week-counter').innerText = juego.semanaActual;
    let semanasRestantes = juego.semanaPelea - juego.semanaActual;
    document.getElementById('next-fight-text').innerText = `Próxima pelea en: ${semanasRestantes} semanas`;
    
    document.getElementById('stat-cond').innerText = jugador.condicion;
    document.getElementById('stat-str').innerText = jugador.striking;
    document.getElementById('stat-gra').innerText = jugador.grappling;
    document.getElementById('stat-record').innerText = `${jugador.victorias} - ${jugador.derrotas}`;
}

function log(mensaje) {
    const p = document.createElement('div');
    p.className = `log-entry`;
    p.innerText = `> ${mensaje}`;
    let caja = document.getElementById('log-box');
    caja.prepend(p);
}
