const TELEGRAM_BOT_TOKEN = "9146192523:AAEKz1pb-yTH4mFeW2ujMBPPOMLNlDwwn2Y";
const TELEGRAM_CHAT_ID = "8870818890";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Agar sheet khali hai toh headers add kar do
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Form Type", "Full Name", "Phone", "Age", "Gender", "Qualification", "Experience", "Preferred Role", "Location"]);
    }
    
    const timestamp = new Date();
    
    // 1. Save data to Google Sheets
    sheet.appendRow([
      timestamp,
      data.formType || "Job Application",
      data.fullName || "",
      data.phone || "",
      data.age || "",
      data.gender || "",
      data.qualification || "",
      data.experience || "",
      data.preferredRole || "",
      data.location || ""
    ]);

    // 2. Format Telegram Notification Message
    let telegramMsg = "";
    const cleanPhone = (data.phone || "").replace(/[^0-9]/g, '');
    
    if (data.formType === "Partner Enquiry") {
      telegramMsg = `🤝 *NEW PARTNER ENQUIRY!*\n\n` +
        `🏢 *Agency:* ${data.fullName}\n` +
        `📞 *Phone:* ${data.phone}\n` +
        `📍 *Location:* ${data.location}\n` +
        `👥 *Manpower Needed:* ${data.qualification || "N/A"}\n\n` +
        `[📲 Connect on WhatsApp](https://wa.me/91${cleanPhone})`;
    } else {
      telegramMsg = `🚨 *NEW JOB APPLICATION!*\n\n` +
        `👤 *Name:* ${data.fullName}\n` +
        `📞 *Phone:* ${data.phone}\n` +
        `🏭 *Role:* ${data.preferredRole}\n` +
        `📍 *Location:* ${data.location}\n` +
        `🎓 *Edu:* ${data.qualification} | *Exp:* ${data.experience}\n\n` +
        `[📲 Connect on WhatsApp](https://wa.me/91${cleanPhone})`;
    }

    // 3. Send Telegram Alert
    sendTelegramMessage(telegramMsg);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: "Markdown"
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}
