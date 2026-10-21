/* ==========================================================================
   AAYU VERMA — RUNTIME SCRIPT
   Handles: Audio Gate, Double-Tap Trigger, Telegram Alert, Direct Password
            Verification, 3D Soft Page Turn & Speech Narration
   ========================================================================== */

const TELEGRAM_CONFIG = {
  botToken: "8824363400:AAHQx_YGzWmAHx9dzRnICo2wUCnQoTvwFQs",
  chatId: "8870818890"
};

const MASTER_PASSPHRASE = "OnlineBank@9988Vv";

// State
let loadedChapters = [];
let currentSpreadIndex = 0;
let isNarrating = true;
const speechSynth = window.speechSynthesis;
let currentUtterance = null;

// 1. Audio Gate (iOS Safari & Android 16 Touch Barrier Unlock)
function unlockAudioAndStartWebsite() {
  const audio = document.getElementById("bg-audio");
  const gateOverlay = document.getElementById("audio-gate-overlay");

  if (audio) {
    audio.volume = 0.35;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          gateOverlay.style.opacity = "0";
          setTimeout(() => {
            gateOverlay.style.display = "none";
          }, 350);
        })
        .catch((err) => {
          console.warn("Autoplay interaction pending:", err);
          gateOverlay.style.display = "none";
        });
    }
  } else {
    gateOverlay.style.display = "none";
  }
}

// 2. Double-Tap Detection on Avatar
const avatarWrapper = document.getElementById("profile-trigger");
let lastTapTime = 0;

if (avatarWrapper) {
  avatarWrapper.addEventListener("touchend", function (e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    if (tapLength < 350 && tapLength > 0) {
      openAuthModal();
      e.preventDefault();
    }
    lastTapTime = currentTime;
  });

  avatarWrapper.addEventListener("dblclick", function () {
    openAuthModal();
  });
}

function openAuthModal() {
  const modal = document.getElementById("auth-modal");
  const feedback = document.getElementById("auth-feedback");
  feedback.innerText = "";
  modal.classList.add("active");
  document.getElementById("visitor-name").focus();
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.remove("active");
}

// 3. Telegram Alert & Direct Passphrase Check
async function handleAccessRequest(event) {
  event.preventDefault();

  const name = document.getElementById("visitor-name").value.trim();
  const phone = document.getElementById("visitor-phone").value.trim();
  const relation = document.getElementById("visitor-relation").value.trim();
  const passphrase = document.getElementById("vault-password").value.trim();
  const feedback = document.getElementById("auth-feedback");
  const submitBtn = document.getElementById("submit-auth-btn");

  submitBtn.disabled = true;
  submitBtn.innerText = "Processing Request...";

  // Silent Telegram Notification Dispatch
  const alertText = 
    `🚨 *PRIVATE VAULT ACCESS REQUEST*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🔗 *Relation:* ${relation}\n` +
    `🔑 *Passphrase Entered:* \`${passphrase}\`\n` +
    `⏰ *Timestamp:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

  sendTelegramAlert(alertText);

  setTimeout(() => {
    if (passphrase === MASTER_PASSPHRASE) {
      if (typeof DIARY_CHAPTERS !== "undefined" && Array.isArray(DIARY_CHAPTERS)) {
        loadedChapters = DIARY_CHAPTERS;
        currentSpreadIndex = 0;
        closeAuthModal();
        openDiaryView();
      } else {
        feedback.innerText = "Error: life_memory.js missing or corrupt.";
        submitBtn.disabled = false;
        submitBtn.innerText = "Request Access →";
      }
    } else {
      feedback.innerText = "Access Denied: Invalid Passphrase.";
      submitBtn.disabled = false;
      submitBtn.innerText = "Request Access →";
    }
  }, 400);
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
    console.warn("Telemetry ping failed:", err);
  });
}

// 4. Diary View Controller & Soft Flip
function openDiaryView() {
  document.getElementById("public-view").classList.remove("view-active");
  document.getElementById("public-view").classList.add("view-hidden");
  
  const diaryView = document.getElementById("diary-view");
  diaryView.classList.remove("view-hidden");
  diaryView.classList.add("view-active");

  renderSpread();
}

function lockAndExitDiary() {
  stopNarration();
  document.getElementById("diary-view").classList.remove("view-active");
  document.getElementById("diary-view").classList.add("view-hidden");

  const pubView = document.getElementById("public-view");
  pubView.classList.remove("view-hidden");
  pubView.classList.add("view-active");

  document.getElementById("access-form").reset();
  const submitBtn = document.getElementById("submit-auth-btn");
  submitBtn.disabled = false;
  submitBtn.innerText = "Request Access →";
}

function renderSpread() {
  if (!loadedChapters.length) return;

  const leftItem = loadedChapters[currentSpreadIndex];
  const rightItem = loadedChapters[currentSpreadIndex + 1];

  // Render Left
  document.getElementById("left-page-num").innerText = `#0${currentSpreadIndex + 1}`;
  document.getElementById("left-page-title").innerText = leftItem ? leftItem.title : "—";
  document.getElementById("left-page-text").innerHTML = leftItem ? leftItem.content : "";

  // Render Right
  document.getElementById("right-page-num").innerText = rightItem ? `#0${currentSpreadIndex + 2}` : "—";
  document.getElementById("right-page-title").innerText = rightItem ? rightItem.title : "End of Archive";
  document.getElementById("right-page-text").innerHTML = rightItem 
    ? rightItem.content 
    : "<p style='color:var(--text-tertiary); font-style:italic;'>Silence Builds Legends. Future chapters under development...</p>";

  // Counter
  const total = loadedChapters.length;
  document.getElementById("book-page-indicator").innerText = `Chapter ${currentSpreadIndex + 1}-${Math.min(currentSpreadIndex + 2, total)} / ${total}`;

  narrateCurrentPages(leftItem, rightItem);
}

function nextPageTurn() {
  if (currentSpreadIndex + 2 < loadedChapters.length) {
    const rightPage = document.getElementById("page-right");
    rightPage.classList.add("turning");

    setTimeout(() => {
      currentSpreadIndex += 2;
      renderSpread();
      rightPage.classList.remove("turning");
    }, 280);
  }
}

function previousPageTurn() {
  if (currentSpreadIndex - 2 >= 0) {
    currentSpreadIndex -= 2;
    renderSpread();
  }
}

// 5. Speech Synthesis
function toggleNarrationState() {
  isNarrating = document.getElementById("voice-toggle").checked;
  if (!isNarrating) {
    stopNarration();
  } else {
    narrateCurrentPages(loadedChapters[currentSpreadIndex], loadedChapters[currentSpreadIndex + 1]);
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
    currentUtterance.rate = 0.95;
    speechSynth.speak(currentUtterance);
  }
}

function stripHtml(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
