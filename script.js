// Estado global del jugador
let player = {
    name: "",
    nationality: "",
    weightClass: "",
    wins: 0,
    losses: 0,
    energy: 100,
    striking: 10,
    grappling: 10,
    money: 500,
    fights: 0
};

// Referencias del DOM
const uiCreation = document.getElementById('creation-screen');
const uiHub = document.getElementById('main-hub');
const logBox = document.getElementById('log-box');

// Iniciar Juego
function startGame() {
    player.name = document.getElementById('playerName').value || "Desconocido";
    player.nationality = document.getElementById('playerNat').value;
    player.weightClass = document.getElementById('playerWeight').value;
    const spec = document.getElementById('playerSpec').value;

    // Asignar bonificaciones según especialidad
    if (spec === "Striker") {
        player.striking = 15;
        player.grappling = 5;
    } else if (spec === "Grappler") {
        player.striking = 5;
        player.grappling = 15;
    } else {
        player.striking = 10;
        player.grappling = 10;
    }

    // Cambiar de pantalla
    uiCreation.style.display = "none";
    uiHub.style.display = "block";
    
    updateUI();
    log("¡Bienvenido al circuito profesional! Comienza entrenando o buscando tu primera pelea.");
}

// Actualizar la interfaz con los datos actuales
function updateUI() {
    document.getElementById('hub-name').innerText = `${player.name} (${player.wins}-${player.losses})`;
    document.getElementById('stat-energy').innerText = player.energy;
    document.getElementById('stat-str').innerText = player.striking;
    document.getElementById('stat-gra').innerText = player.grappling;
    document.getElementById('stat-money').innerText = player.money;

    // Actualizar ranking según victorias
    let rank = "Novato Regional";
    if(player.wins >= 3) rank = "Promesa Nacional";
    if(player.wins >= 6) rank = "Contendiente Top 15";
    if(player.wins >= 10) rank = "CANDIDATO AL TÍTULO";
    document.getElementById('hub-rank').innerText = rank;
}

// Sistema de registro (Log)
function log(message, type = "normal") {
    const p = document.createElement('div');
    p.className = `log-entry log-${type}`;
    p.innerText = `> ${message}`;
    logBox.prepend(p); // Agrega arriba
}

// Mecánica: Entrenar
function train(type) {
    if (player.energy < 20) {
        log("Estás muy cansado para entrenar. Necesitas descansar.", "loss");
        return;
    }

    player.energy -= 20;
    const gain = Math.floor(Math.random() * 3) + 1; // Gana entre 1 y 3 puntos

    if (type === 'striking') {
        player.striking += gain;
        log(`Día duro en los sacos y manoplas. Ganaste +${gain} en Striking.`);
    } else {
        player.grappling += gain;
        log(`Sesión intensa de sparring en el tatami. Ganaste +${gain} en Grappling.`);
    }
    updateUI();
}

// Mecánica: Descansar
function rest() {
    if (player.money < 50) {
        log("No tienes dinero suficiente para costear tu nutrición y descanso adecuado.", "loss");
        return;
    }
    
    player.money -= 50;
    player.energy = Math.min(100, player.energy + 50);
    log("Te tomaste unos buenos mates, relajaste el cuerpo y recuperaste energía. (-$50)");
    updateUI();
}

// Mecánica: Pelear
function fight() {
    if (player.energy < 40) {
        log("No puedes pelear con tan poca energía. Tómate un descanso.", "loss");
        return;
    }

    player.fights++;
    player.energy -= 40;

    // Generar un oponente adaptado al nivel del jugador (con un poco de aleatoriedad)
    const difficultyScale = 5 + (player.wins * 2); 
    const enemy = {
        name: `Peleador #${Math.floor(Math.random() * 900) + 100}`,
        striking: difficultyScale + Math.floor(Math.random() * 10),
        grappling: difficultyScale + Math.floor(Math.random() * 10)
    };

    log(`--- EVENTO ESTELAR: Tú vs ${enemy.name} ---`);

    // Lógica del combate: Se calcula un puntaje basado en las stats + un factor de suerte (dado)
    const playerRoll = (player.striking * Math.random()) + (player.grappling * Math.random());
    const enemyRoll = (enemy.striking * Math.random()) + (enemy.grappling * Math.random());

    if (playerRoll >= enemyRoll) {
        // Victoria
        player.wins++;
        const bolsa = 300 + (player.wins * 100);
        player.money += bolsa;
        
        // Decidir cómo ganó para el texto
        const method = player.striking > player.grappling ? "KO espectacular" : "Sumisión técnica";
        log(`¡VICTORIA! Derrotaste a ${enemy.name} por ${method}. Ganaste $${bolsa}.`, "win");
    } else {
        // Derrota
        player.losses++;
        const bolsa = 100; // Gana menos por perder
        player.money += bolsa;
        log(`DERROTA. ${enemy.name} fue superior esta vez. Recibes $${bolsa} por participar.`, "loss");
    }

    updateUI();

    if (player.wins >= 10) {
        setTimeout(() => {
            alert(`¡Felicidades ${player.name}! Has conseguido 10 victorias y te has coronado Campeón Mundial de peso ${player.weightClass}. ¡El juego ha terminado!`);
        }, 500);
    }
}
