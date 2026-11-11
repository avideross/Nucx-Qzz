// Select job and update dropdown
function selectJob(jobTitle) {
    const select = document.getElementById('preferredRole');
    for(let i=0; i<select.options.length; i++) {
        if(select.options[i].value === jobTitle) {
            select.selectedIndex = i;
            break;
        }
    }
    // Smooth scroll to apply section
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
}

// Google Apps Script Web App Endpoint (Replace with your deployed Web App URL)
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
    submitBtn.innerText = "Submitting...";
    submitBtn.disabled = true;

    if (WEB_APP_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            alert("Application submitted successfully! Details sent to NUCX Desk.");
            formElement.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }).catch(err => {
            alert("Submission error. Please connect directly via WhatsApp.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    } else {
        setTimeout(() => {
            alert("Thank you! Your details have been received successfully. Redirecting to WhatsApp...");
            window.open(`https://wa.me/919335085991?text=Hello%20NUCX,%20I%20have%20submitted%20my%20details%20for%20${encodeURIComponent(data.preferredRole || 'Manpower Partnership')}.`, '_blank');
            formElement.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
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
