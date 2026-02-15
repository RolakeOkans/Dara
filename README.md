# 💜 Dara

**Date Alert Response App — Your AI-Powered Dating Safety Companion**

[Demo Video](https://youtu.be/muTiKrY_Hzo?si=pqhh6e5E1mIV3tx2)

---

## About

Dara (meaning "good" in Yoruba) is an AI-powered safety companion for dating. It helps users feel confident and protected when meeting someone new.

Built for HackFax x PatriotHacks 2026.

---

## Features

🛡️ **AI Safety Analysis** — Get risk scores and personalized safety tips before your date

📞 **Fake Call Escape** — Trigger realistic AI-generated phone calls to help you leave uncomfortable situations

💬 **Chat with Dara** — Your AI companion, always there for advice and support

🆘 **One Tap SOS** — Alert your trusted contacts with your location instantly

⏱️ **Date Tracking** — Real-time timer and location sharing during active dates

👥 **Trusted Contacts** — Build your safety circle of people who can help in emergencies

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React, Vite, JavaScript |
| Backend | Firebase Authentication, Firestore |
| AI Chat & Safety Analysis | Google Gemini API |
| AI Voice Generation | ElevenLabs API |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase account
- Google Gemini API key
- ElevenLabs API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/RolakeOkans/Dara.git
cd dara
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173)

---

## What's Next

- Real SMS alerts via Twilio integration
- Live location sharing with trusted contacts
- Apple Watch app for discreet SOS triggers
- Community safety ratings for date locations

---

## Author

**Morolake Okanlawon**

- [LinkedIn](https://www.linkedin.com/in/morolake-okanlawon)
- [GitHub](https://github.com/RolakeOkans)

---

## Acknowledgments

- Google Gemini API for AI-powered safety analysis and chat
- ElevenLabs for realistic voice generation
- HackFax x PatriotHacks 2026

---

*Because everyone deserves to date without fear. 💜*