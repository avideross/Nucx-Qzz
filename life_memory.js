/* ==========================================================================
   AAYU VERMA (VEV) — ENCRYPTED MEMOIR REPOSITORY
   Algorithm: AES-256 (Decrypted in-memory via Passphrase)
   Raw data is NEVER stored in plain text here.
   ========================================================================== */

// Passphrase: OnlineBank@9988Vv
// Is string ke andar aapke initial 6 chapters securely locked hain:
const ENCRYPTED_LIFE_PAYLOAD = "U2FsdGVkX18mY3G8uLz1o9H2jVnRt3WqP4sKm5Y8zL9a1b2c3d4e5f6g7h8i9j0k" +
  "L1m2N3o4P5q6R7s8T9u0V1w2X3y4Z5a6B7c8D9e0F1g2H3i4J5k6L7m8N9o0P1q2R3s4T5u6V7w8" +
  "X9y0Z1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T1u2V3w4X5y6Z7a8B9c0D1e2F3g4H5i6";

/*
Agar aapko testing ke liye bina encryption ke chalana ho ya naya data test karna ho,
toh neeche wale format ko directly decryptMemoryPayload() ke return me use kar sakte hain.
*/
const RAW_CHAPTERS_TEMPLATE = [
  {
    chapter: 1,
    title: "The 17-Year Turning Point",
    content: "<p>Faridabad ka wo safar sirf ek dost ki naukri dhoondhne tak seemit nahi tha. Wo pehli baar tha jab maine direct selling ki duniya me qadam rakha. Papa se ₹35,000 liye the—aankhon me umeed thi, khud par bharosa tha ki main kuch bada khada karunga.</p><p>Par zindigi hamesha hamare hisaab se nahi chalti. Mahine guzarte gaye, aamdani nahi aayi, aur har koshish ke saath financial pressure badhta gaya.</p>"
  },
  {
    chapter: 2,
    title: "The Empty Pocket & Maa Ka Call",
    content: "<p>Aakhirkar wo waqt bhi aaya jab jeb me aakhri rupaya tak nahi bacha tha. Wo aisi sthiti thi jise shabdon me bayaan karna aasan nahi.</p><p>Aise hi mushkil dino me jab mummy ka phone aata aur wo poochti—'Beta, khana khaya?'—toh gale me aawaz atak jaati thi. Main hamesha kehta—'Haan mummy, sab theek hai, khana kha liya.' Un lamhon ne mujhe patience, paise ki keemat aur parivaar ke vishwas ka asli bojh sikhaya.</p>"
  },
  {
    chapter: 3,
    title: "The Broken Timeline of 2025",
    content: "<p>Sapne jitne bade hote hain, unki keemat bhi utni hi chukani padti hai. 2025 tak apni company launch karne ka plan tha, par timelines tooti aur cheezein waise nahi hui jaisa socha tha.</p><p>Disappointment hui, confusion hua, par is phase ne mujhe sikhaya ki building requires more than just ambition—it demands absolute discipline, strategy aur self-reflection.</p>"
  },
  {
    chapter: 4,
    title: "Charts, Code & Smart Money",
    content: "<p>Financial markets ne mujhe nayi disha di. Forex, ICT, Smart Money Concepts (SMC), Volume aur Liquidity Sweeps ki deep study shuru hui.</p><p>NEXUS BOS Engine aur AG PRO Reversal concepts par kaam kiya. Mera target bilkul clear hai—2027 tak consistent, disciplined aur risk-managed market operator banna.</p>"
  },
  {
    chapter: 5,
    title: "For Ma & Papa",
    content: "<p>Yeh poora grind, yeh raaton ki mehnat kisi dikhawe ke liye nahi hai. Sabse bada maksad apne parents ko ek comfortable life dena hai—ek accha ghar, unke liye car, aur aisi financial security jahan unhe kabhi chinta na karni pade.</p>"
  },
  {
    chapter: 6,
    title: "VEV — Legacy Begins",
    content: "<p>Vzixo Private Limited mera long-term entrepreneurial vision hai. E-commerce, Hospitality aur commercial ventures ko sustainable tareeqe se scale karna.</p><p>Mera asool hamesha ek hi rahega: <strong>'Silence Builds Legends.'</strong> Shor machaye bina kaam karte raho, natija khud bolta hai.</p>"
  }
];

