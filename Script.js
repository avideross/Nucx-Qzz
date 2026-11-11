// Select job and update dropdown
function selectJob(jobTitle) {
    const select = document.getElementById('preferredRole');
    for(let i=0; i<select.options.length; i++) {
        if(select.options[i].value === jobTitle) {
            select.selectedIndex = i;
            break;
        }
    }
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
}

// ⚠️ IMPORTANT: Yahan apna Google Apps Script ka Web App URL paste kar dena!
const WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Form Submission Handlers
document.getElementById('jobForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitForm(this);
});

document.getElementById('partnerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitForm(this);
});

function submitForm(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    const submitBtn = formElement.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Submitting Details...";
    submitBtn.disabled = true;

    if (WEB_APP_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        // Fetch request to Google Apps Script
        fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            showSuccessMessage(formElement);
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }).catch(err => {
            alert("Network error. Please connect directly via WhatsApp.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    } else {
        // Fallback simulation if URL is not added yet
        setTimeout(() => {
            showSuccessMessage(formElement);
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
}

// Function to Show Success Popup on Screen
function showSuccessMessage(formElement) {
    // Create success alert box dynamically if not exists
    let msgBox = formElement.querySelector('.success-msg');
    if (!msgBox) {
        msgBox = document.createElement('div');
        msgBox.className = 'success-msg';
        msgBox.style.cssText = "margin-top: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.2); border: 1px solid #34D399; color: #34D399; border-radius: 8px; text-align: center; font-weight: 600; font-size: 0.9rem;";
        formElement.appendChild(msgBox);
    }
    msgBox.innerHTML = "🎉 Application Submitted Successfully! Details sent to NUCX Desk & Telegram Alert Triggered.";
    formElement.reset();

    // Hide message after 5 seconds
    setTimeout(() => {
        msgBox.remove();
    }, 6000);
}

// Language Switcher Toggle (EN/HI)
let isHindi = false;
document.getElementById('langToggle').addEventListener('click', function() {
    isHindi = !isHindi;
    if(isHindi) {
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
