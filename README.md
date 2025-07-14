# 🚗 Smart Parking Finder – TAP Assignment

> Find nearby parking with ease, even on low networks.

A smart parking web app that helps users **find, view, and book nearby parking spots** based on their current location. The app adapts to network speed, lazily loads content for performance, and visualizes routes to the parking destination.

---

## 🎯 Problem Solved

In urban areas, finding a nearby parking spot in real-time is a common frustration. This app:
- Uses the **user's current location** to fetch nearby parking
- Shows a list of available spots with live details
- Lets users **select and book** a parking spot
- **Visualizes route** to the selected parking spot
- Handles **low-network conditions** gracefully
- Enhances performance on scroll with lazy loading

---

## 🧩 Technologies Used

- **React** – UI and state management
- **TailwindCSS** – Styling
- **Browser Web APIs** – For real-time, performance-enhanced UX
- **(Optional)** GPT API – (If added) to recommend best spots based on time/distance

---

## 🌐 Web APIs Used

### 1. 📍 Geolocation API
- Fetches user’s **live current location** to find nearby parking spots
- Updates user location at intervals during live routing

### 2. 👁️ Intersection Observer API
- **Lazy loads parking cards** and images as the user scrolls
- Improves load time and performance on mobile devices

### 3. 🌐 Network Information API
- Detects **network speed and connection type**
- If connection is slow:
  - Switches to a simplified map
  - Limits location update frequency
  - Reduces image resolution for a smoother experience

---

## 📸 Screenshots
-  <img width="1914" height="963" alt="image" src="https://github.com/user-attachments/assets/43977923-51cd-4578-bcd7-bc22839d93b5" />
 ### Find parking buttons
- <img width="1918" height="964" alt="image" src="https://github.com/user-attachments/assets/2fc1a661-e2bc-432a-8454-d68e0619de71" />
### shows nearby spots
- <img width="1919" height="958" alt="image" src="https://github.com/user-attachments/assets/e1334351-7de0-4854-acbd-df4b7b5a37f1" />
### shows route to destination

