# ÉVENTRA — Where Moments Become Memories

**A premium event discovery and management experience.**

ÉVENTRA is a responsive event discovery and registration website designed to help users explore events, discover experiences based on their interests, register for upcoming events, and manage their digital event passes.

Live Demo:- https://eventra-pi-five.vercel.app/

Built using **HTML5, CSS3, and Vanilla JavaScript**.
 ÉVENTRA provides an interactive event management experience without requiring frontend frameworks, package installations, or complex build tools.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Website Pages](#website-pages)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [How It Works](#how-it-works)
8. [Local Storage and Data Persistence](#local-storage-and-data-persistence)
9. [Demo and Security Limitations](#demo-and-security-limitations)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)

---

## 1. Overview

ÉVENTRA aims to make event discovery more personalized, interactive, and convenient.

Rather than functioning as a simple event listing website, it combines event exploration, personalized recommendations, event compatibility scoring, registration management, and digital event passes in one platform.

The website features a premium visual design with responsive layouts, smooth animations, interactive elements, and persistent user preferences.

**Project Highlights:**
- Explore and discover upcoming events.
- Find events based on personal interests.
- Take an interactive personality quiz.
- View personalized event compatibility scores.
- Register for events through a validated form.
- Generate QR-coded digital registration passes.
- View and manage registered events.
- Explore events through an interactive calendar.

---

## 2. Features

### 2.1 Event Discovery and Exploration
- Browse available and featured events.
- Explore events across different categories.
- Search events using keywords.
- Filter events by category and date.
- Sort events based on event dates.
- View detailed information about individual events.

### 2.2 Find Your Vibe
A personalized event discovery feature that recommends events based on user interests.

**Highlights:**
- Select multiple interests.
- Match selected interests with event categories and tags.
- Display relevant event recommendations.
- Save preferences for future visits.

### 2.3 Event Personality Quiz
An interactive five-question quiz designed to understand users' event preferences and personalities.

**Personality types include:**
- Explorer
- Creative Soul
- Networker
- Night Owl
- Knowledge Seeker

Based on the quiz results, ÉVENTRA provides personalized event recommendations.

### 2.4 Event Compatibility Score
A recommendation feature that calculates how well an event matches a user's preferences.

**Highlights:**
- Evaluates compatibility using interests, event categories, tags, and quiz preferences.
- Displays a compatibility percentage.
- Helps users identify events that match their interests.
- Provides preference-based results instead of arbitrary random scores.

### 2.5 Interactive Event Calendar
An interactive calendar that makes it easier to explore upcoming events.

**Highlights:**
- Monthly calendar navigation.
- Visual indicators for event dates.
- Select individual dates to view scheduled events.
- Switch between calendar and grid views.
- Navigate directly to event details.

### 2.6 Event Registration System
Users can register for their preferred events through an interactive registration form.

**Highlights:**
- Form validation using JavaScript.
- Required-field verification.
- Duplicate registration checks.
- Registration confirmation.
- Persistent registration records using Local Storage.

### 2.7 Digital Event Pass with QR Code
After successful registration, users can access a digital event pass.

**Pass information includes:**
- Participant information.
- Event name.
- Event date and venue.
- Unique registration reference.
- QR code associated with the registration.

Users can print or download their digital passes.

### 2.8 My Registrations
A dedicated section for managing registered events.

**Highlights:**
- View saved registrations.
- Access digital event passes.
- Review registration information.
- Cancel saved registrations.

### 2.9 Additional Features
- Dark and light theme support.
- Save and manage favorite events.
- Newsletter subscription interaction.
- Smooth scrolling and navigation.
- Hover effects and scroll animations.
- Responsive layouts for desktop, tablet, and mobile devices.
- Prototype checkout with simulated success and decline outcomes.

---

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure and content |
| CSS3 | Styling, layouts, animations, and responsiveness |
| Vanilla JavaScript | Interactivity, application logic, and validation |
| Local Storage | Browser-based data persistence |
| QR Code Library | Generation of QR-coded digital passes |
| Google Fonts | Typography and visual presentation |

**No frontend framework is required.**

The project uses plain HTML, CSS, and JavaScript without React, Angular, Vue, or Vite.

---

## 4. Website Pages

| File | Description |
|---|---|
| `index.html` | Homepage, featured events, categories, about section, and newsletter |
| `events.html` | Event browsing, search, filtering, and date sorting |
| `event-details.html` | Individual event information and countdown |
| `register.html` | Event registration and confirmation |
| `my-registrations.html` | View, manage, and cancel registrations |
| `support.html` | Help center, sample contact information, and sample policies |

Some pages use URL parameters to identify the selected event and registration.

Example:

- `event-details.html?id=1`
- `register.html?eventId=1`

---

## 5. Project Structure

The main project structure is organized as follows:

```text
event-management/
│
├── index.html
├── events.html
├── event-details.html
├── register.html
├── my-registrations.html
├── support.html
│
├── css/
│   └── [Stylesheet files]
│
├── js/
│   └── [JavaScript files]
│
├── assets/
│   └── [Images, icons, and other assets]
│
└── README.md
```

*Note: The CSS, JavaScript, and asset subfolders may contain additional files depending on the current project implementation.*

---

## 6. Getting Started

Follow these instructions to run ÉVENTRA locally.

### Prerequisites

You need:

- A computer running Windows, Linux, or macOS.
- Visual Studio Code or another code editor.
- A modern web browser.
- Git (optional, for version control).

No Node.js installation or package manager is required.

### Step 1: Clone the Repository

```bash
git clone https://github.com/som-cyber/Eventra.git
```

### Step 2: Navigate to the Project Directory

```bash
cd Eventra
```

### Step 3: Open the Project

Open the folder in Visual Studio Code:

```bash
code .
```

### Step 4: Run the Website

You can use either of the following methods.

**Option A: VS Code Live Server**

1. Install the Live Server extension.
2. Open `index.html`.
3. Right-click and select **Open with Live Server**.

**Option B: Python Static Server**

Run:

```bash
py -m http.server 8000
```

Open the following address in your browser:

```text
http://localhost:8000
```

The ÉVENTRA homepage should now be accessible.

---

## 7. How It Works

### Event Discovery

Users browse the available events and use search, category filters, and date filters to find relevant experiences.

### Personalized Recommendations

Users select their interests or complete the personality quiz. The JavaScript recommendation logic uses these preferences to identify relevant events and calculate compatibility scores.

### Event Registration

Users select an event and submit their information through the registration form. JavaScript validates the entered information and checks for duplicate registrations.

### Digital Pass Generation

After registration, the website generates a digital pass containing event and participant information, along with a QR code.

### Registration Management

Registration details and preferences are stored in the browser. Users can revisit the website to view their saved registrations and access their passes.

---

## 8. Local Storage and Data Persistence

ÉVENTRA uses the browser's Local Storage API to preserve selected information between visits.

The stored information includes:

- User interests and preferences.
- Personality quiz results.
- Event recommendations-related preferences.
- Event registrations.
- Demo checkout status and reference information.
- Favorite events.
- Theme preferences.
- Newsletter subscription information.

**Important:** Local Storage is browser-specific. Data is not automatically synchronized between devices or shared between different browsers.

Clearing browser data may remove saved registrations and preferences.

---

## 9. Demo and Security Limitations

ÉVENTRA is a frontend demonstration project.

The following limitations should be understood:

- There is currently no production backend or centralized database.
- User information is stored locally in the browser.
- The checkout system is a simulation and does not process real payments.
- No card, bank, or UPI payment credentials are collected.
- Digital event passes are demonstration references.
- QR codes are not verified entry credentials.
- There is no production authentication or server-side registration verification.

The project demonstrates frontend functionality and interaction rather than a complete production-ready event management infrastructure.

---

## 10. Future Enhancements

Potential improvements for future versions include:

- Backend integration and centralized database management.
- Secure user authentication and account management.
- Real payment gateway integration.
- Organizer dashboard for event management.
- Real-time event availability and seat management.
- Email and registration confirmation notifications.
- Server-side QR code validation.
- Event reviews and ratings.
- Advanced recommendation algorithms.
- Cloud deployment and production monitoring.

---

## 11. Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Commit your changes.

```bash
git add .
git commit -m "Add: describe your changes"
```

5. Push the branch.

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request describing your changes.

---


## Developed With Passion

**ÉVENTRA — Where Moments Become Memories.**

Discover experiences. Explore possibilities. Create memories.
