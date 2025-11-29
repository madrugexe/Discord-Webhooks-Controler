// Créer l'effet de pluie
function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    document.body.appendChild(rainContainer);

    for (let i = 0; i < 100; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = Math.random() * 100 + 'vw';
        raindrop.style.animationDuration = (Math.random() * 2 + 1) + 's';
        raindrop.style.animationDelay = Math.random() * 5 + 's';
        raindrop.style.opacity = Math.random() * 0.5 + 0.2;
        rainContainer.appendChild(raindrop);
    }
}

// Créer les particules flottantes
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 100 + 50 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Créer les vagues
function createWaves() {
    const waves = document.createElement('div');
    waves.className = 'waves';
    document.body.appendChild(waves);
}

// Initialiser tous les effets
document.addEventListener('DOMContentLoaded', function() {
    createRain();
    createParticles();
    createWaves();
});