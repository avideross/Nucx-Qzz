// Select job and update dropdown
function selectJob(jobTitle) {
    const select = document.getElementById('preferredRole');
    if(select) {
        for(let i=0; i<select.options.length; i++) {
            if(select.options[i].value === jobTitle) {
                select.selectedIndex = i;
                break;
            }
        }
    }
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
}

// Form Submission Handlers (Direct WhatsApp Redirect)
document.getElementById('jobForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitToWhatsApp(this, "Job Application");
});

document.getElementById('partnerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitToWhatsApp(this, "Partner Enquiry");
});

function submitToWhatsApp(formElement, type) {
    const formData = new FormData(formElement);
    let message = "";

    if (type === "Job Application") {
        const name = formData.get('fullName');
        const phone = formData.get('phone');
        const age = formData.get('age');
        const gender = formData.get('gender');
        const qual = formData.get('qualification');
        const exp = formData.get('experience');
        const role = formData.get('preferredRole');
        const loc = formData.get('location');

        message = `🚨 *NEW JOB APPLICATION (NUCX)*\n\n` +
                  `👤 *Name:* ${name}\n` +
                  `📞 *Phone:* ${phone}\n` +
                  `🎂 *Age/Gender:* ${age} / ${gender}\n` +
                  `🎓 *Qual/Exp:* ${qual} (${exp})\n` +
                  `🏭 *Role:* ${role}\n` +
                  `📍 *Location:* ${loc}`;
    } else {
        const agency = formData.get('fullName');
        const phone = formData.get('phone');
        const loc = formData.get('location');
        const manpower = formData.get('qualification');

        message = `🤝 *NEW PARTNER ENQUIRY (NUCX)*\n\n` +
                  `🏢 *Agency:* ${agency}\n` +
                  `📞 *Phone:* ${phone}\n` +
                  `📍 *Location:* ${loc}\n` +
                  `👥 *Manpower Needed:* ${manpower}`;
    }

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919335085991?text=${encodedMessage}`;

    // Show success alert and open WhatsApp
    alert("Form submitted successfully! Redirecting to WhatsApp to send details...");
    formElement.reset();
    
    // Open WhatsApp chat with pre-filled message
    window.open(whatsappUrl, '_blank');
}

// Language Switcher Toggle (EN/HI)
let isHindi = false;
const langToggleBtn = document.getElementById('langToggle');
if(langToggleBtn) {
    langToggleBtn.addEventListener('click', function() {
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
}
