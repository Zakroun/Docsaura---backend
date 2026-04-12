# 🚀 DocsAura API

Backend API built with Node.js for AI-powered features and email services.
Deployed on Vercel with serverless functions.

---

## ✨ Features

* 🤖 AI Integration (OpenAI)
* 📧 Email Sending (Nodemailer)
* ☁️ Serverless Deployment (Vercel)
* 🛢️ MongoDB Atlas Support
* 🔐 Environment-based configuration

---

## 📁 Project Structure

```
backend/
 ├── api/
 │   ├── index.js        # API info
 │   ├── ai.js           # OpenAI endpoint
 │   ├── sendMail.js     # Email endpoint
 │   └── testDB.js       # Database test
 ├── config/
 │   ├── db.js           # MongoDB connection
 │   ├── openai.js       # OpenAI config
 │   └── mailer.js       # Nodemailer config
 ├── models/
 │   └── User.js         # Example model
 ├── .env
 ├── package.json
 └── vercel.json
```

---

## ⚙️ Installation

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🚀 Deployment (Vercel)

1. Push project to GitHub
2. Import project into Vercel
3. Add environment variables in Vercel dashboard
4. Deploy 🚀

---

## 📡 API Endpoints

### 🤖 AI Endpoint

```
POST /api/ai
```

**Body:**

```json
{
  "message": "Hello AI"
}
```

---

### 📧 Send Email

```
POST /api/sendMail
```

**Body:**

```json
{
  "to": "example@gmail.com",
  "subject": "Test",
  "text": "Hello from DocsAura"
}
```

---

### 🧪 Test Database

```
GET /api/testDB
```

---

## 🛠️ Tech Stack

* Node.js
* Express (light usage in serverless)
* OpenAI API
* Nodemailer
* MongoDB Atlas
* Vercel Serverless Functions

---

## ⚠️ Notes

* Use **App Password** for Gmail (not your real password)
* Make sure MongoDB Atlas allows access (0.0.0.0/0)
* Keep your `.env` secure and never push it to GitHub

---

## 👨‍💻 Author

DocsAura Team

---

## 📜 License

This project is licensed for educational and personal use.
