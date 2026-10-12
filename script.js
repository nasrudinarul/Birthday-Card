let audioCtx;
let isAudioPlaying = false;
let isCandleLit = true;

// Daftar foto di luar folder (root direktori)[span_1](start_span)[span_1](end_span)
const photos = [
    'foto1.jpeg',
    'foto2.jpeg',
    'foto3.jpeg',
    'foto4.jpeg',
    'foto5.jpeg'
];
let currentPhotoIndex = 0;
let slideInterval;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playPopSound() {
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } catch(e){}
}

let bgInterval;
function playRomanticMelody() {
    if (isAudioPlaying) return;
    initAudio();
    isAudioPlaying = true;
    document.getElementById('musicIcon').classList.add('animate-spin');
    document.getElementById('musicStatusText').innerText = 'Musik Aktif 🎵';

    const notes = [261.63, 293.66, 329.63, 349.23, 392.00];
    let noteIdx = 0;

    bgInterval = setInterval(() => {
        if (!isAudioPlaying) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[noteIdx], audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.6);
            noteIdx = (noteIdx + 1) % notes.length;
        } catch(e){}
    }, 600);
}

function toggleAudio() {
    if (isAudioPlaying) {
        isAudioPlaying = false;
        clearInterval(bgInterval);
        document.getElementById('musicIcon').classList.remove('animate-spin');
        document.getElementById('musicStatusText').innerText = 'Putar Musik 🎵';
    } else {
        playRomanticMelody();
    }
}

function openCard() {
    playPopSound();
    playRomanticMelody();
    triggerConfetti();

    const splash = document.getElementById('splashScreen');
    const main = document.getElementById('mainContent');

    splash.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        splash.style.display = 'none';
        main.classList.remove('opacity-0');
    }, 700);

    // Mulai slideshow otomatis berganti foto setiap 4 detik
    startAutoSlide();
}

function updatePhoto() {
    const img = document.getElementById('profilePhoto');
    if (!img) return;
    img.style.opacity = 0;
    setTimeout(() => {
        img.src = photos[currentPhotoIndex];
        img.style.opacity = 1;
    }, 200);
}

function changePhoto(direction) {
    playPopSound();
    currentPhotoIndex = (currentPhotoIndex + direction + photos.length) % photos.length;
    updatePhoto();
}

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        updatePhoto();
    }, 4000);
}

function blowCandles() {
    if (!isCandleLit) return;
    playPopSound();
    isCandleLit = false;

    const candles = document.getElementById('candlesGroup');
    candles.classList.add('candle-extinguished');
    
    document.getElementById('blowBtn').innerHTML = '<i class="fas fa-check"></i><span>Lilin Sudah Ditiup!</span>';
    document.getElementById('blowBtn').classList.replace('from-rose-500', 'from-emerald-500');
    document.getElementById('blowBtn').classList.replace('to-pink-500', 'to-teal-500');

    triggerConfetti();
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#f43f5e', '#ffb6c1']
        });
    }
}

function initHeartCanvas() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const hearts = Array.from({ length: 20 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 6,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
    }));

    function drawHeart(x, y, size, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#fda4af';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
        ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(h => {
            h.y -= h.speed;
            if (h.y < -20) {
                h.y = canvas.height + 20;
                h.x = Math.random() * canvas.width;
            }
            drawHeart(h.x, h.y, h.size, h.opacity);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

window.onload = function() {
    initHeartCanvas();
};
            
