# 🐾 PawFinder

**ItFest 2025 Submission**  
*Find Your Lost Friend, Fast.*

PawFinder is a cross-platform mobile app built with React Native that helps users **report and find missing pets** using **AI-powered image matching**. With real-time updates, location-based searches, and a user-friendly interface, PawFinder makes reuniting with lost pets easier and faster.

> ⚠️ **Note:** This app was developed in just 48 hours during the ItFest hackathon. It is **very unfinished** — I ran out of time and tokens for the AI API, so features like matching are incomplete or stubbed.

---

## 🚀 Features

- 📸 **Post Missing or Found Pets**  
  Upload images, write descriptions, and mark the pet’s last known location.

- 🤖 **AI Image Matching**  
  Smart detection and comparison to match lost pets with found ones using visual similarity. *(Currently non-functional due to token limits.)*

- 🔐 **User Authentication**  
  Sign up and log in securely via Firebase Authentication.

- 🔄 **Live Data Sync**  
  Real-time updates for all listings using Firebase’s cloud database.

---

## 🛠️ Tech Stack

- **React Native** – Cross-platform app development  
- **Firebase** – Realtime database & user authentication  
- **AI Image Matching** – Smart comparison of pet images *(concept only)*  
- **Expo** – Development & testing framework

---

## 📷 Screenshots (Very Early UI Preview)

<p align="center">
  <img src="https://github.com/user-attachments/assets/873b6cbd-2449-4231-a410-a979dacbe2f4" alt="Screenshot 1" width="30%"/>
  <img src="https://github.com/user-attachments/assets/e74936d0-b0d6-486b-b2ce-b195184901a1" alt="Screenshot 2" width="30%"/>
  <img src="https://github.com/user-attachments/assets/10583e34-58e8-407f-b929-fc6537101193" alt="Screenshot 3" width="30%"/>
</p>

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/pawfinder.git
cd pawfinder
npm install
npx expo start
```
