// Telegram Bot Credentials
const BOT_TOKEN = "9146192523:AAEKz1pb-yTH4mFeW2ujMBPPOMLNlDwwn2Y";
const CHAT_ID = "8870818890";

// Select job and update dropdown
function selectJob(jobTitle) {
    const select = document.getElementById('preferredRole');
    if (select) {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === jobTitle) {
                select.selectedIndex = i;
                break;
            }
        }
    }
    const applySec = document.getElementById('apply');
    if (applySec) {
        applySec.scrollIntoView({ behavior: 'smooth' });
    }
}

// Ensure DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', function (e) {
            e.preventDefault();
            processSubmission(this, "Job Application");
        });
    }

    const partnerForm = document.getElementById('partnerForm');
    if (partnerForm) {
        partnerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            processSubmission(this, "Partner Enquiry");
        });
    }

    // Modal background click to close
    window.addEventListener('click', function (e) {
        const modal = document.getElementById('successModal');
        if (modal && e.target === modal) {
            closeModal();
        }
    });
});

async function processSubmission(formElement, type) {
    const submitBtn = formElement.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerText : "Submit";
    
    if (submitBtn) {
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;
    }

    const formData = new FormData(formElement);
    let telegramMsg = "";
    let whatsappMsg = "";

    if (type === "Job Application") {
        const name = formData.get('fullName') || "";
        const phone = formData.get('phone') || "";
        const age = formData.get('age') || "";
        const gender = formData.get('gender') || "";
        const qual = formData.get('qualification') || "";
        const exp = formData.get('experience') || "";
        const role = formData.get('preferredRole') || "";
        const loc = formData.get('location') || "";

        // Plain text message (telegram Markdown errors avoid karne ke liye)
        telegramMsg = `🚨 NEW JOB APPLICATION (NUCX)\n\n` +
                      `👤 Name: ${name}\n` +
                      `📞 Phone: ${phone}\n` +
                      `🎂 Age/Gender: ${age} / ${gender}\n` +
                      `🎓 Qual/Exp: ${qual} (${exp})\n` +
                      `🏭 Role: ${role}\n` +
                      `📍 Location: ${loc}`;

        whatsappMsg = `Hello NUCX Group, I have submitted my job application.\n\nName: ${name}\nRole: ${role}\nPhone: ${phone}\nLocation: ${loc}`;
    } else {
        const agency = formData.get('companyName') || formData.get('fullName') || "";
        const phone = formData.get('phone') || "";
        const loc = formData.get('location') || "";
        const manpower = formData.get('manpowerCount') || formData.get('qualification') || "";

        telegramMsg = `🤝 NEW PARTNER ENQUIRY (NUCX)\n\n` +
                      `🏢 Agency: ${agency}\n` +
                      `📞 Phone: ${phone}\n` +
                      `📍 Location: ${loc}\n` +
                      `👥 Manpower Needed: ${manpower}`;

        whatsappMsg = `Hello NUCX Group, I want to discuss a Manpower Partnership.\n\nAgency: ${agency}\nPhone: ${phone}\nManpower: ${manpower}`;
    }

    // Send Telegram Notification
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMsg
            })
        });
    } catch (err) {
        console.warn("Telegram alert error:", err);
    } finally {
        // Reset form & button
        formElement.reset();
        if (submitBtn) {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }

        // Show Modal Har Haal Me Chalyega
        showModal(whatsappMsg);
    }
}

function showModal(whatsappMsg) {
    const modal = document.getElementById('successModal');
    const whatsappBtn = document.getElementById('whatsappRedirectBtn');
    
    if (modal) {
        modal.classList.add('active');
    }

    if (whatsappBtn) {
        whatsappBtn.onclick = function () {
            const whatsappUrl = `https://wa.me/919335085991?text=${encodeURIComponent(whatsappMsg)}`;
            window.open(whatsappUrl, '_blank');
            closeModal();
        };
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Language Switcher Toggle (EN/HI)
let isHindi = false;
const langToggleBtn = document.getElementById('langToggle');
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
        isHindi = !isHindi;
        if (isHindi) {
            document.getElementById('heroTitle').innerText = "औद्योगिक मैनपावर और रोजगार समाधान";
            document.getElementById('heroDesc').innerText = "बावल और रेवाड़ी, हरियाणा में नौकरी चाहने वालों, मैनपावर पार्टनर और औद्योगिक अवसरों को जोड़ना। शुरुआती वेतन ₹15,000/माह से शुरू।";
            document.getElementById('btnFindJobs').innerText = "नौकरी खोजें";
            document.getElementById('btnPartner').innerText = "मैनपावर दें";
            document.getElementById('jobsHeading').innerText = "उत्पादन और फैक्ट्री स्टाफ रिक्तियां";
            document.getElementById('jobsSub').innerText = "बावल / रेवाड़ी इकाइयों में पुरुष और महिला उम्मीदवारों के लिए।";
            this.innerText = "EN / HI";
        } else {
            document.getElementById('heroTitle').innerText = "Powering Industrial Workforce.";
            document.getElementById('heroDesc').innerText = "Connecting job seekers, manpower partners and industrial opportunities in Bawal & Rewari, Haryana. Starting salary from ₹15,000/month with transparent terms.";
            document.getElementById('btnFindJobs').innerText = "Explore Opportunities";
            document.getElementById('btnPartner').innerText = "Supply Manpower";
            document.getElementById('jobsHeading').innerText = "Production & Factory Staff Openings";
            document.getElementById('jobsSub').innerText = "Male & Female vacancies across Bawal / Rewari industrial units. 10th / 12th / ITI / Diploma.";
            this.innerText = "HI / EN";
        }
    });
}
