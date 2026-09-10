/**
 * ============================================================================
 * TAYMI'S BIRTHDAY STORY — APP SCRIPT
 * Warm Brown & Golden Hour Interactive Experience
 * ============================================================================
 */

(function () {
  'use strict';

  // --- SOUND EFFECTS & AMBIENT MUSIC ENGINE (Web Audio API) ---
  let audioCtx = null;
  let isMusicPlaying = false;
  let synthMusicInterval = null;
  const customAudio = document.getElementById('customAudio');
  const vinylDisc = document.getElementById('vinylDisc');
  const vinylStatus = document.getElementById('vinylStatus');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft Warm Sound Generator
  function playTone(freq, type = 'sine', duration = 0.8, gainVal = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio note error:', e);
    }
  }

  // Tactile Lamp Switch Click
  function playClickSound() {
    playTone(320, 'triangle', 0.06, 0.15);
    setTimeout(() => playTone(540, 'sine', 0.08, 0.08), 30);
  }

  // Soft Blowout Wind / Whoosh
  function playBlowoutSound() {
    if (!audioCtx) return;
    try {
      const bufferSize = audioCtx.sampleRate * 1.2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.4));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 1.2);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {
      console.warn('Noise error:', e);
    }
  }

  // Cheerful chime progression
  function playCelebrationFanfare() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        playTone(freq, 'sine', 1.2, 0.12);
      }, index * 140);
    });
  }

  // Gentle pentatonic ambient music loop (F Major / D Minor cozy cafe vibes)
  const ambientNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
  function startAmbientSynthMusic() {
    if (synthMusicInterval) return;
    let step = 0;
    synthMusicInterval = setInterval(() => {
      if (!isMusicPlaying || !audioCtx) return;
      const note = ambientNotes[Math.floor(Math.random() * ambientNotes.length)];
      playTone(note, 'sine', 2.2, 0.04);
      if (step % 3 === 0) {
        // Soft bass foundation
        playTone(note / 2, 'triangle', 2.6, 0.03);
      }
      step++;
    }, 1200);
  }

  function stopAmbientSynthMusic() {
    if (synthMusicInterval) {
      clearInterval(synthMusicInterval);
      synthMusicInterval = null;
    }
  }

  function toggleMusic(forcePlay = null) {
    initAudioContext();
    const shouldPlay = forcePlay !== null ? forcePlay : !isMusicPlaying;

    if (shouldPlay) {
      isMusicPlaying = true;
      vinylDisc.classList.add('is-spinning');
      vinylStatus.textContent = 'Playing';
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';

      // Try playing custom MP3 first
      if (customAudio && customAudio.src) {
        customAudio.volume = 0.6;
        customAudio.play().catch(() => {
          // If no MP3 file or autoplay blocked, activate ambient synth
          startAmbientSynthMusic();
        });
      } else {
        startAmbientSynthMusic();
      }
    } else {
      isMusicPlaying = false;
      vinylDisc.classList.remove('is-spinning');
      vinylStatus.textContent = 'Paused';
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';

      if (customAudio) {
        customAudio.pause();
      }
      stopAmbientSynthMusic();
    }
  }

  audioToggleBtn.addEventListener('click', () => toggleMusic());

  // --- ACT 1: PROLOGUE PULL LAMP LOGIC ---
  const pullChainBtn = document.getElementById('pullChainBtn');
  const prologueOverlay = document.getElementById('prologueOverlay');
  const pageBody = document.getElementById('pageBody');

  function triggerLampPull() {
    initAudioContext();
    playClickSound();

    pullChainBtn.style.transform = 'translateY(32px)';
    setTimeout(() => {
      pullChainBtn.style.transform = 'translateY(0)';
    }, 180);

    setTimeout(() => {
      prologueOverlay.classList.add('is-dismissed');
      pageBody.classList.remove('is-dark-prologue');
      toggleMusic(true);
      launchConfettiBurst(window.innerWidth / 2, 200, 30);
    }, 350);
  }

  pullChainBtn.addEventListener('click', triggerLampPull);
  const lampSystem = document.querySelector('.lamp-system');
  if (lampSystem) lampSystem.addEventListener('click', triggerLampPull);
  const prologuePrompt = document.querySelector('.prologue-prompt');
  if (prologuePrompt) prologuePrompt.addEventListener('click', triggerLampPull);

  pullChainBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerLampPull();
    }
  });

  // --- FLOATING AMBIENT CANVAS (Embers & Golden Dust) ---
  const ambCanvas = document.getElementById('ambientCanvas');
  const ambCtx = ambCanvas.getContext('2d');
  let ambParticles = [];

  function resizeAmbientCanvas() {
    ambCanvas.width = window.innerWidth;
    ambCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeAmbientCanvas);
  resizeAmbientCanvas();

  class AmberParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * ambCanvas.width;
      this.y = initial ? Math.random() * ambCanvas.height : ambCanvas.height + 20;
      this.size = Math.random() * 2.5 + 1;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.glow = Math.random() * 10 + 5;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -20) {
        this.reset();
      }
    }
    draw() {
      ambCtx.save();
      ambCtx.beginPath();
      ambCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ambCtx.fillStyle = `rgba(244, 162, 97, ${this.opacity})`;
      ambCtx.shadowColor = '#ffbe0b';
      ambCtx.shadowBlur = this.glow;
      ambCtx.fill();
      ambCtx.restore();
    }
  }

  for (let i = 0; i < 45; i++) {
    ambParticles.push(new AmberParticle());
  }

  function animateAmbient() {
    ambCtx.clearRect(0, 0, ambCanvas.width, ambCanvas.height);
    ambParticles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // --- ACT 2: FRIENDSHIP RECEIPT STAMP ---
  const receiptStampBtn = document.getElementById('receiptStampBtn');
  const friendshipReceipt = document.getElementById('friendshipReceipt');

  receiptStampBtn.addEventListener('click', () => {
    initAudioContext();
    playTone(440, 'sine', 0.3, 0.15);

    // Add visual stamp to receipt
    let stamp = friendshipReceipt.querySelector('.verified-stamp');
    if (!stamp) {
      stamp = document.createElement('div');
      stamp.className = 'verified-stamp';
      stamp.innerHTML = '★ CERTIFIED BEST FRIEND ★';
      stamp.style.cssText = `
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-18deg) scale(0.6);
        border: 4px dashed #99582a;
        color: #99582a;
        font-family: sans-serif;
        font-weight: 900;
        font-size: 1.1rem;
        letter-spacing: 2px;
        padding: 8px 16px;
        border-radius: 8px;
        pointer-events: none;
        opacity: 0;
        transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      `;
      friendshipReceipt.appendChild(stamp);
    }

    setTimeout(() => {
      stamp.style.opacity = '1';
      stamp.style.transform = 'translate(-50%, -50%) rotate(-18deg) scale(1)';
    }, 50);

    const rect = receiptStampBtn.getBoundingClientRect();
    launchConfettiBurst(rect.left + rect.width / 2, rect.top, 25);
  });

  // --- ACT 3: THE 3 VIDEO EXHIBITS ---
  const films = [
    { id: 1, video: document.getElementById('videoElement1'), overlay: document.getElementById('videoOverlay1') },
    { id: 2, video: document.getElementById('videoElement2'), overlay: document.getElementById('videoOverlay2') },
    { id: 3, video: document.getElementById('videoElement3'), overlay: document.getElementById('videoOverlay3') }
  ];

  films.forEach((film) => {
    if (!film.overlay || !film.video) return;

    film.overlay.addEventListener('click', () => {
      initAudioContext();
      if (film.video.paused) {
        film.video.play().then(() => {
          film.overlay.classList.add('is-playing');
        }).catch((err) => {
          console.log('Video cannot play directly (file might be absent yet):', err);
          console.warn('Video playback error:', err);
        });
      } else {
        film.video.pause();
        film.overlay.classList.remove('is-playing');
      }
    });

    film.video.addEventListener('ended', () => {
      film.overlay.classList.remove('is-playing');
    });

    film.video.addEventListener('click', () => {
      if (!film.video.paused) {
        film.video.pause();
        film.overlay.classList.remove('is-playing');
      }
    });
  });

  // Tap-to-React Hearts on Videos
  const heartBtns = document.querySelectorAll('.reaction-heart-btn');
  heartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudioContext();
      playTone(587.33, 'sine', 0.2, 0.1);

      const countSpan = btn.querySelector('.reaction-count');
      if (countSpan) {
        let count = parseInt(countSpan.textContent, 10) || 0;
        countSpan.textContent = count + 1;
      }

      // Floating heart animation
      const rect = btn.getBoundingClientRect();
      createFloatingHeart(rect.left + rect.width / 2, rect.top);
    });
  });

  function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    const emojis = ['🤎', '✨', '💛', '🥰', '☕', '💖'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%) scale(1);
      transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.2s ease;
      opacity: 1;
    `;
    document.body.appendChild(heart);

    const destX = (Math.random() - 0.5) * 80;
    const destY = -120 - Math.random() * 60;

    requestAnimationFrame(() => {
      heart.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.6)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 1200);
  }

  // --- ACT 4: POLAROID 3D FLIP ---
  const polaroidCard = document.getElementById('polaroidCard');
  if (polaroidCard) {
    polaroidCard.addEventListener('click', () => {
      initAudioContext();
      playTone(392, 'triangle', 0.2, 0.08);
      polaroidCard.classList.toggle('is-flipped');
    });

    polaroidCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        polaroidCard.classList.toggle('is-flipped');
      }
    });
  }

  // --- ACT 5: "OPEN WHEN..." SECRET LETTERS MODALS ---
  const lettersData = {
    1: {
      title: "Open When You Need To Know How Loved You Are",
      content: `
        <p><strong>Dearest Taymi,</strong></p>
        <p>Whenever self-doubt creeps in or the world feels a little cold, I want you to read this and remember: <em>you are extraordinary</em>.</p>
        <p>You have this rare, quiet superpower of making everyone feel seen and welcomed. Your warmth isn't loud or performative—it's honest, safe, and deeply comforting. The world is genuinely gentler and brighter because you're in it.</p>
        <p>Never forget how deeply appreciated and fiercely loved you are, today and every single day.</p>
      `
    },
    2: {
      title: "Open When You Need An Instant Laugh",
      content: `
        <p><strong>Emergency Mood Booster for Taymi 🚨</strong></p>
        <p>1. Reminder: You are legally not allowed to be sad today. It violates the friendship constitution.</p>
        <p>2. Please remember that you laugh at your own jokes before the punchline even leaves your mouth—and honestly, that's funnier than the actual joke 95% of the time.</p>
        <p>3. If life is giving you lemons right now, throw them back and demand an iced caramel latte. You’re the main character!</p>
      `
    },
    3: {
      title: "Open When The World Feels Too Loud",
      content: `
        <p><strong>Take a deep breath, Taymi.</strong></p>
        <p>Put your phone down after this. Drink some warm tea or coffee. Wrap yourself in the softest blanket you own.</p>
        <p>You don’t have to solve everything today. You don't have to carry the weight of tomorrow right now. You are doing so much better than you give yourself credit for. Take it one gentle minute at a time.</p>
        <p>We’ve got your back, always.</p>
      `
    },
    4: {
      title: "The Birthday Letter ✨ Just For Taymi",
      content: `
        <p><strong>Happy, Happy Birthday Taymi! 🎂</strong></p>
        <p>Another 365 days of you gracing this planet with your radiant smile, your infectious laugh, and your generous soul.</p>
        <p>My wish for you this year is simple:</p>
        <p>• May your mornings be slow and peaceful.<br>
        • May your coffee always taste perfect.<br>
        • May you laugh until your stomach hurts on regular rotation.<br>
        • May every door you knock on open wide with blessing and fulfillment.</p>
        <p>Here’s to another chapter of making unforgettable memories together!</p>
      `
    }
  };

  const envelopeCards = document.querySelectorAll('.envelope-card');
  const letterModalBackdrop = document.getElementById('letterModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalLetterTitle = document.getElementById('modalLetterTitle');
  const modalLetterContent = document.getElementById('modalLetterContent');

  envelopeCards.forEach((card) => {
    card.addEventListener('click', () => {
      const letterId = card.getAttribute('data-letter');
      const letter = lettersData[letterId];
      if (!letter) return;

      initAudioContext();
      playTone(493.88, 'sine', 0.4, 0.1);

      modalLetterTitle.textContent = letter.title;
      modalLetterContent.innerHTML = letter.content;
      letterModalBackdrop.classList.add('is-open');
      letterModalBackdrop.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLetterModal() {
    letterModalBackdrop.classList.remove('is-open');
    letterModalBackdrop.setAttribute('aria-hidden', 'true');
  }

  modalCloseBtn.addEventListener('click', closeLetterModal);
  letterModalBackdrop.addEventListener('click', (e) => {
    if (e.target === letterModalBackdrop) {
      closeLetterModal();
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && letterModalBackdrop.classList.contains('is-open')) {
      closeLetterModal();
    }
  });

  // --- ACT 6: CAKE & CANDLE BLOWOUT INTERACTION ---
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const blowProgressBar = document.getElementById('blowProgressBar');
  const blowBtnLabel = document.getElementById('blowBtnLabel');
  const candleFlame = document.getElementById('candleFlame');
  const candleSmoke = document.getElementById('candleSmoke');
  const celebrationBanner = document.getElementById('celebrationBanner');
  const fireworksBurstBtn = document.getElementById('fireworksBurstBtn');
  const relightCandleBtn = document.getElementById('relightCandleBtn');
  const wishInstructions = document.getElementById('wishInstructions');

  let blowHoldTimer = null;
  let blowProgress = 0;
  const maxCircumference = 283;
  let isCandleExtinguished = false;

  function updateProgressBar(percent) {
    const offset = maxCircumference - (percent / 100) * maxCircumference;
    blowProgressBar.style.strokeDashoffset = offset;
  }

  function startBlowing() {
    if (isCandleExtinguished) return;
    if (blowHoldTimer) return;
    initAudioContext();

    blowBtnLabel.textContent = 'Blowing...';
    candleFlame.style.transform = 'scale(0.75, 1.3) rotate(8deg)';

    blowHoldTimer = setInterval(() => {
      blowProgress += 3.5;
      updateProgressBar(blowProgress);
      playTone(180 + blowProgress * 3, 'triangle', 0.05, 0.03);

      if (navigator.vibrate && Math.floor(blowProgress) % 15 === 0) {
        navigator.vibrate(10);
      }

      if (blowProgress >= 100) {
        completeBlowout();
      }
    }, 40);
  }

  function stopBlowing() {
    if (isCandleExtinguished) return;
    if (blowHoldTimer) {
      clearInterval(blowHoldTimer);
      blowHoldTimer = null;
    }
    blowProgress = 0;
    updateProgressBar(0);
    blowBtnLabel.textContent = 'Hold to Blow';
    candleFlame.style.transform = '';
  }

  function completeBlowout() {
    if (blowHoldTimer) {
      clearInterval(blowHoldTimer);
      blowHoldTimer = null;
    }
    isCandleExtinguished = true;
    updateProgressBar(100);

    if (navigator.vibrate) {
      navigator.vibrate([60, 40, 120]);
    }

    // Candle extinguishes
    candleFlame.classList.add('is-extinguished');
    candleSmoke.classList.add('is-active');
    playBlowoutSound();

    blowBtnLabel.textContent = 'Wish Made! ✨';
    wishInstructions.textContent = 'Your wish has taken flight! 🌟';

    // Dramatic moment of silence, then Fireworks eruption!
    setTimeout(() => {
      playCelebrationFanfare();
      launchGrandCelebration();
      celebrationBanner.classList.add('is-active');
    }, 600);
  }

  // Pointer handlers for mouse/touch/pen hold interaction
  blowCandleBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    blowCandleBtn.setPointerCapture(e.pointerId);
    startBlowing();
  });
  blowCandleBtn.addEventListener('pointerup', stopBlowing);
  blowCandleBtn.addEventListener('pointercancel', stopBlowing);
  blowCandleBtn.addEventListener('lostpointercapture', stopBlowing);

  // Spacebar hold support
  let isSpaceHeld = false;
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isSpaceHeld && !isCandleExtinguished) {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
        e.preventDefault();
        isSpaceHeld = true;
        startBlowing();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && isSpaceHeld) {
      isSpaceHeld = false;
      stopBlowing();
    }
  });

  // Relight Button
  relightCandleBtn.addEventListener('click', () => {
    isCandleExtinguished = false;
    candleFlame.classList.remove('is-extinguished');
    candleSmoke.classList.remove('is-active');
    celebrationBanner.classList.remove('is-active');
    blowProgress = 0;
    updateProgressBar(0);
    blowBtnLabel.textContent = 'Hold to Blow';
    wishInstructions.textContent = 'Hold down the button below (or press & hold Space) to blow! 💨';
    playTone(523.25, 'sine', 0.3, 0.1);
  });

  // Launch more fireworks button
  fireworksBurstBtn.addEventListener('click', () => {
    playCelebrationFanfare();
    launchGrandCelebration();
  });

  // --- FIREWORKS & CONFETTI ENGINE (Adapted from workspace references) ---
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas.getContext('2d');
  let fireworks = [];
  let fwParticles = [];
  let fwAnimationActive = false;

  function resizeFwCanvas() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFwCanvas);
  resizeFwCanvas();

  const fwColors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff', '#e5a963', '#ffffff', '#ffd166'];

  class FireworkRocket {
    constructor(startX, startY, targetX, targetY) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.speed = 3;
      this.angle = Math.atan2(targetY - startY, targetX - startX);
      this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.color = fwColors[Math.floor(Math.random() * fwColors.length)];
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= 1.05;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = Math.hypot(vx, vy) + this.distanceTraveled;

      if (this.distanceTraveled >= this.distanceToTarget) {
        createFireworkExplosion(this.targetX, this.targetY, this.color);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw() {
      fwCtx.beginPath();
      fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      fwCtx.lineTo(this.x, this.y);
      fwCtx.strokeStyle = this.color;
      fwCtx.lineWidth = 3;
      fwCtx.stroke();
    }
  }

  class FireworkSpark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 10 + 2;
      this.friction = 0.95;
      this.gravity = 0.8;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        fwParticles.splice(index, 1);
      }
    }

    draw() {
      fwCtx.beginPath();
      fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      fwCtx.lineTo(this.x, this.y);
      fwCtx.strokeStyle = `rgba(${hexToRgb(this.color)}, ${this.alpha})`;
      fwCtx.lineWidth = 2.5;
      fwCtx.stroke();
    }
  }

  function hexToRgb(hex) {
    if (!hex || hex[0] !== '#') return '255, 200, 87';
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }

  function createFireworkExplosion(x, y, color) {
    const particleCount = 70;
    for (let i = 0; i < particleCount; i++) {
      fwParticles.push(new FireworkSpark(x, y, color));
    }
    launchConfettiBurst(x, y, 15);
  }

  function launchConfettiBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const color = fwColors[Math.floor(Math.random() * fwColors.length)];
      fwParticles.push(new FireworkSpark(x, y, color));
    }
  }

  function animateFireworks() {
    if (!fwAnimationActive && fireworks.length === 0 && fwParticles.length === 0) {
      fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
      return;
    }

    fwCtx.globalCompositeOperation = 'destination-out';
    fwCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwCtx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
      fireworks[i].update(i);
      if (fireworks[i]) fireworks[i].draw();
    }

    let j = fwParticles.length;
    while (j--) {
      fwParticles[j].update(j);
      if (fwParticles[j]) fwParticles[j].draw();
    }

    requestAnimationFrame(animateFireworks);
  }

  function launchGrandCelebration() {
    fwAnimationActive = true;
    animateFireworks();

    const bursts = 14;
    for (let i = 0; i < bursts; i++) {
      setTimeout(() => {
        const startX = window.innerWidth * (0.2 + Math.random() * 0.6);
        const startY = window.innerHeight;
        const targetX = window.innerWidth * (0.15 + Math.random() * 0.7);
        const targetY = window.innerHeight * (0.15 + Math.random() * 0.45);
        fireworks.push(new FireworkRocket(startX, startY, targetX, targetY));
      }, i * 280);
    }

    setTimeout(() => {
      fwAnimationActive = false;
    }, bursts * 280 + 3000);
  }

  // Helper Toast for nice feedback
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(30px);
      background: rgba(42, 24, 16, 0.95);
      color: #f7ede2;
      border: 1px solid #e5a963;
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      z-index: 10000;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(30px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

})();
