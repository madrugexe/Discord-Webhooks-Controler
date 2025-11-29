let isSpamming = false;
let sentMessages = 0;
let successCount = 0;
let errorCount = 0;
let totalLatency = 0;
let spamInterval;
let startTime;
let messagesPerSecond = 0;
let lastSecondUpdate = Date.now();

// Messages aléatoires
const randomMessages = [
    "Madrug Controller en action! 🚀",
    "Webhook Power! ⚡",
    "Flood Time! 🌊",
    "Discord API Rocks! 🎸",
    "Automated Message 🤖",
    "Testing Webhooks 🔧",
    "Random Message 🎲",
    "Bot Power! 🔥",
    "Spam Attack! 💥",
    "Webhook Master 🎯",
    "Madrug FTW! 👑",
    "Flood Control 🎮",
    "Ultimate Spammer 💪",
    "Discord Dominance 🏆"
];

// Noms aléatoires
const randomNames = [
    "Madrug Bot", "Webhook Master", "Flood Controller",
    "Message Spammer", "Discord Bot", "API Tester",
    "Ghost Writer", "Auto Messenger", "Spam King",
    "Madrug Warrior", "Flood Machine", "Webhook Ninja"
];

function log(message, type = 'info') {
    const logElement = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type} fade-in`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logElement.appendChild(entry);
    logElement.scrollTop = logElement.scrollHeight;
}

function updateStats() {
    document.getElementById('sentCount').textContent = sentMessages;
    document.getElementById('successCount').textContent = successCount;
    document.getElementById('errorCount').textContent = errorCount;
    
    const avgLatency = sentMessages > 0 ? Math.round(totalLatency / sentMessages) : 0;
    document.getElementById('latency').textContent = `${avgLatency}ms`;
    
    // Calculer la vitesse (messages par seconde)
    const now = Date.now();
    if (now - lastSecondUpdate >= 1000) {
        const elapsedSeconds = (now - startTime) / 1000;
        messagesPerSecond = elapsedSeconds > 0 ? (sentMessages / elapsedSeconds).toFixed(1) : 0;
        lastSecondUpdate = now;
    }
    document.getElementById('speed').textContent = `${messagesPerSecond}/s`;
}

function getRandomMessage() {
    return randomMessages[Math.floor(Math.random() * randomMessages.length)];
}

function getRandomName() {
    return randomNames[Math.floor(Math.random() * randomNames.length)];
}

async function sendBurst() {
    if (!isSpamming) return;

    const burstCount = parseInt(document.getElementById('burstCount').value) || 1;
    const promises = [];

    for (let i = 0; i < burstCount; i++) {
        promises.push(sendSingleMessage());
    }

    await Promise.allSettled(promises);
}

async function sendSingleMessage() {
    if (!isSpamming) return;

    const webhookUrl = document.getElementById('webhookUrl').value;
    const useEmbeds = document.getElementById('useEmbeds').checked;
    const changeUsername = document.getElementById('changeUsername').checked;
    const randomMessages = document.getElementById('randomMessages').checked;

    let messageContent = document.getElementById('messageContent').value;
    let username = document.getElementById('username').value;
    const avatarUrl = document.getElementById('avatarUrl').value;

    if (randomMessages) {
        messageContent = getRandomMessage();
    }

    if (changeUsername) {
        username = getRandomName();
    }

    const payload = {
        content: useEmbeds ? null : messageContent,
        username: username,
        avatar_url: avatarUrl || null
    };

    if (useEmbeds) {
        const embedColor = document.getElementById('embedColor').value.replace('#', '');
        const embedTitle = document.getElementById('embedTitle').value || 'Madrug Webhook';
        const embedDescription = document.getElementById('embedDescription').value || messageContent;

        payload.embeds = [{
            title: embedTitle,
            description: embedDescription,
            color: parseInt(embedColor, 16),
            timestamp: new Date().toISOString(),
            footer: {
                text: `Message #${sentMessages + 1} • Madrug Controller`
            }
        }];
    }

    const startTime = Date.now();
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const latency = Date.now() - startTime;
        totalLatency += latency;

        if (response.ok) {
            sentMessages++;
            successCount++;
            log(`✅ Message ${sentMessages} envoyé (${latency}ms)`, 'success');
        } else {
            sentMessages++;
            errorCount++;
            log(`❌ Erreur ${response.status} sur le message ${sentMessages}`, 'error');
        }
    } catch (error) {
        sentMessages++;
        errorCount++;
        log(`💥 Erreur: ${error.message}`, 'error');
    }

    updateStats();

    // Vérifier si on a atteint le nombre maximum de messages
    const maxMessages = parseInt(document.getElementById('messageCount').value);
    if (sentMessages >= maxMessages) {
        stopSpamming();
        log('🎯 Nombre maximum de messages atteint!', 'info');
    }
}

function startSpamming() {
    if (isSpamming) return;

    const webhookUrl = document.getElementById('webhookUrl').value;
    if (!webhookUrl) {
        alert('Veuillez entrer une URL de webhook!');
        return;
    }

    isSpamming = true;
    const delay = parseInt(document.getElementById('delay').value);
    startTime = Date.now();
    lastSecondUpdate = startTime;
    
    log('🚀 Démarrage du flood Madrug...', 'info');
    log(`⚡ Configuration: ${delay}ms délai, ${document.getElementById('burstCount').value} messages/rafale`, 'info');
    
    // Premier burst immédiat
    sendBurst();
    
    // Puis les suivants avec intervalle
    spamInterval = setInterval(sendBurst, delay);
}

function stopSpamming() {
    isSpamming = false;
    if (spamInterval) {
        clearInterval(spamInterval);
        spamInterval = null;
    }
    log('🛑 Flood arrêté', 'info');
}

function clearLog() {
    document.getElementById('log').innerHTML = '';
    sentMessages = 0;
    successCount = 0;
    errorCount = 0;
    totalLatency = 0;
    messagesPerSecond = 0;
    updateStats();
    log('🗑️ Logs effacés - Madrug Controller prêt', 'info');
}

async function testWebhook() {
    const webhookUrl = document.getElementById('webhookUrl').value;
    if (!webhookUrl) {
        alert('Veuillez entrer une URL de webhook!');
        return;
    }

    log('🧪 Test du webhook en cours...', 'info');

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: '🧪 **Test Webhook Madrug** - Ceci est un message de test!',
                username: 'Madrug Tester'
            })
        });

        if (response.ok) {
            log('✅ Webhook fonctionne correctement!', 'success');
        } else {
            log(`❌ Webhook erreur: ${response.status}`, 'error');
        }
    } catch (error) {
        log(`💥 Erreur de test: ${error.message}`, 'error');
    }
}

function exportLogs() {
    const logElement = document.getElementById('log');
    const logs = logElement.innerText;
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `madrug-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    log('📤 Logs exportés', 'info');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('embedColor').addEventListener('input', function() {
        document.getElementById('colorPreview').style.backgroundColor = this.value;
    });

    document.getElementById('avatarUrl').addEventListener('input', function() {
        const preview = document.getElementById('avatarPreview');
        if (this.value) {
            preview.src = this.value;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });

    // Initialiser la couleur
    document.getElementById('colorPreview').style.backgroundColor = document.getElementById('embedColor').value;
    
    log('🌟 Madrug Webhooks Controller initialisé!', 'info');
    log('💡 Utilisez les options de flood pour envoyer plusieurs messages par rafale', 'info');
});