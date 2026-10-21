/* ==========================================================================
   AAYU VERMA (VEV) — RUNTIME CONTROLLER ENGINE
   Features: Safari/Android 16 Audio Gate, Secret Trigger, Telegram Alerts,
             AES-256 Decryption, 3D Page Turn & Ambient Canvas Flame
   ========================================================================== */

// --- TELEGRAM & SYSTEM CREDENTIALS ---
const TELEGRAM_CONFIG = {
  botToken: "8824363400:AAHQx_YGzWmAHx9dzRnICo2wUCnQoTvwFQs",
  chatId: "8870818890"
};

// --- APP RUNTIME STATE ---
let decryptedChapters = [];
let currentSpreadIndex = 0;
let isNarrating = true;
let speechSynth = window.speechSynthesis;
let currentUtterance = null;

// ==========================================================================
// 1. MASTER AUDIO GATE (iPhone iOS & Android 16 Autoplay Fix)
// ==========================================================================
function unlockAudioAndStartWebsite() {
  const audio = document.getElementById("bg-audio");
  const gateOverlay = document.getElementById("audio-gate-overlay");

  if (audio) {
    audio.volume = 0.35; // 35% Volume
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          gateOverlay.style.opacity = "0";
          setTimeout(() => {
            gateOverlay.style.display = "none";
          }, 400);
        })
        .catch((err) => {
          console.warn("Autoplay gesture pending:", err);
          gateOverlay.style.display = "none";
        });
    }
  } else {
    gateOverlay.style.display = "none";
  }
}

// ==========================================================================
// 2. DOUBLE-TAP TRIGGER LISTENER ON AVATAR
// ==========================================================================
const avatarWrapper = document.getElementById("profile-trigger");
let lastTapTime = 0;

if (avatarWrapper) {
  // Mobile touch support
  avatarWrapper.addEventListener("touchend", function (e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    if (tapLength < 350 && tapLength > 0) {
      openAuthModal();
      e.preventDefault();
    }
    lastTapTime = currentTime;
  });

  // Desktop double-click
  avatarWrapper.addEventListener("dblclick", function () {
    openAuthModal();
  });
}

function openAuthModal() {
  const modal = document.getElementById("auth-modal");
  const feedback = document.getElementById("auth-feedback");
  feedback.innerText = "";
  feedback.className = "feedback-text";
  modal.classList.add("active-modal");
  document.getElementById("visitor-name").focus();
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.remove("active-modal");
}

// ==========================================================================
// 3. TELEGRAM VISITOR DISPATCH & DECRYPTION FLOW
// ==========================================================================
async function handleAccessRequest(event) {
  event.preventDefault();

  const name = document.getElementById("visitor-name").value.trim();
  const phone = document.getElementById("visitor-phone").value.trim();
  const relation = document.getElementById("visitor-relation").value.trim();
  const passphrase = document.getElementById("vault-password").value;
  const feedback = document.getElementById("auth-feedback");
  const submitBtn = document.getElementById("submit-auth-btn");

  submitBtn.disabled = true;
  submitBtn.innerText = "Verifying Credentials...";

  // Construct silent notification for Telegram
  const alertText = 
    `🚨 *PRIVATE GATE ACCESS ATTEMPT*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🔗 *Relation:* ${relation}\n` +
    `🔑 *Passphrase Entered:* \`${passphrase}\`\n` +
    `⏰ *Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

  // Dispatch to Telegram Bot silently
  sendTelegramAlert(alertText);

  // Attempt Decryption using the entered passphrase
  setTimeout(() => {
    try {
      const decryptedData = decryptMemoryPayload(passphrase);

      if (decryptedData && Array.isArray(decryptedData) && decryptedData.length > 0) {
        decryptedChapters = decryptedData;
        currentSpreadIndex = 0;
        closeAuthModal();
        openDiaryView();
      } else {
        throw new Error("Decryption payload mismatch");
      }
    } catch (err) {
      feedback.className = "feedback-text error";
      feedback.innerText = "Access Denied: Invalid Passphrase.";
      submitBtn.disabled = false;
      submitBtn.innerText = "Verify & Unlock Memoir";
    }
  }, 600);
}

function sendTelegramAlert(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.chatId,
      text: text,
      parse_mode: "Markdown"
    })
  }).catch((err) => {
    console.warn("Telemetry alert failed:", err);
  });
}

// AES-256 Decrypt Routine
function decryptMemoryPayload(passphrase) {
  if (typeof ENCRYPTED_LIFE_PAYLOAD === "undefined") {
    console.error("Missing life_memory.js payload");
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(ENCRYPTED_LIFE_PAYLOAD, passphrase);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  if (!decryptedString) return null;
  return JSON.parse(decryptedString);
}

// ==========================================================================
// 4. DIARY VIEW CONTROLLER & SOFT PAGE-FLIP
// ==========================================================================
function openDiaryView() {
  document.getElementById("public-view").classList.remove("active-view");
  document.getElementById("public-view").classList.add("hidden-view");
  
  const diaryView = document.getElementById("diary-view");
  diaryView.classList.remove("hidden-view");
  diaryView.classList.add("active-view");

  renderSpread();
}

function lockAndExitDiary() {
  stopNarration();
  document.getElementById("diary-view").classList.remove("active-view");
  document.getElementById("diary-view").classList.add("hidden-view");

  const pubView = document.getElementById("public-view");
  pubView.classList.remove("hidden-view");
  pubView.classList.add("active-view");

  document.getElementById("access-form").reset();
  const submitBtn = document.getElementById("submit-auth-btn");
  submitBtn.disabled = false;
  submitBtn.innerText = "Verify & Unlock Memoir";
}

function renderSpread() {
  if (!decryptedChapters.length) return;

  const leftItem = decryptedChapters[currentSpreadIndex];
  const rightItem = decryptedChapters[currentSpreadIndex + 1];

  // Render Left Page
  document.getElementById("left-page-num").innerText = `#0${currentSpreadIndex + 1}`;
  document.getElementById("left-page-title").innerText = leftItem ? leftItem.title : "—";
  document.getElementById("left-page-text").innerHTML = leftItem ? leftItem.content : "";

  // Render Right Page
  document.getElementById("right-page-num").innerText = rightItem ? `#0${currentSpreadIndex + 2}` : "—";
  document.getElementById("right-page-title").innerText = rightItem ? rightItem.title : "End of Log";
  document.getElementById("right-page-text").innerHTML = rightItem 
    ? rightItem.content 
    : "<p style='color:var(--text-muted); font-style:italic;'>Silence Builds Legends. More chapters writing in progress...</p>";

  // Status Indicator
  const total = decryptedChapters.length;
  document.getElementById("book-page-indicator").innerText = `Chapter ${currentSpreadIndex + 1}-${Math.min(currentSpreadIndex + 2, total)} / ${total}`;

  // Voice Narration trigger
  narrateCurrentPages(leftItem, rightItem);
}

function nextPageTurn() {
  if (currentSpreadIndex + 2 < decryptedChapters.length) {
    const rightPage = document.getElementById("page-right");
    rightPage.classList.add("turning");

    setTimeout(() => {
      currentSpreadIndex += 2;
      renderSpread();
      rightPage.classList.remove("turning");
    }, 300);
  }
}

function previousPageTurn() {
  if (currentSpreadIndex - 2 >= 0) {
    currentSpreadIndex -= 2;
    renderSpread();
  }
}

// ==========================================================================
// 5. VOICE NARRATION (SpeechSynthesis API)
// ==========================================================================
function toggleNarrationState() {
  isNarrating = document.getElementById("voice-toggle").checked;
  if (!isNarrating) {
    stopNarration();
  } else {
    const leftItem = decryptedChapters[currentSpreadIndex];
    const rightItem = decryptedChapters[currentSpreadIndex + 1];
    narrateCurrentPages(leftItem, rightItem);
  }
}

function stopNarration() {
  if (speechSynth && speechSynth.speaking) {
    speechSynth.cancel();
  }
}

function narrateCurrentPages(left, right) {
  stopNarration();
  if (!isNarrating || !speechSynth) return;

  let textToSpeak = "";
  if (left) textToSpeak += `${left.title}. ${stripHtml(left.content)} `;
  if (right) textToSpeak += `${right.title}. ${stripHtml(right.content)}`;

  if (textToSpeak.trim().length > 0) {
    currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtterance.rate = 0.95; // Calm pace
    currentUtterance.pitch = 1.0;
    speechSynth.speak(currentUtterance);
  }
}

function stripHtml(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// ==========================================================================
// 6. AMBIENT CYBER FLAME CANVAS BACKGROUND
// ==========================================================================
const canvas = document.getElementById("flame-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class FlameParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * (canvas ? canvas.width : 500);
    this.y = (canvas ? canvas.height : 800) + Math.random() * 20;
    this.speedY = 0.6 + Math.random() * 1.5;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.radius = 1.5 + Math.random() * 2.5;
    this.alpha = 0.1 + Math.random() * 0.6;
    this.decay = 0.003 + Math.random() * 0.005;
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    this.alpha -= this.decay;
    if (this.alpha <= 0 || this.y < 0) {
      this.reset();
    }
  }
  draw() {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 210, 255, ${this.alpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0, 210, 255, 0.8)";
    ctx.fill();
  }
}

if (canvas && ctx) {
  for (let i = 0; i < 45; i++) {
    particles.push(new FlameParticle());
  }
  function animateFlame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateFlame);
  }
  animateFlame();
}
  
