## Overview

The frontend application of JyotishConnect provides a rich user experience through a modern UI for:
- User and astrologer authentication
- Real‑time chat and call consultations using Socket.IO
- Astrological services such as personalized horoscopes, free kundli, and compatibility reports
- Review and rating system for astrologers
- Educational content, blog articles, and free live astrology sessions

---

## Features

- **Authentication & Authorization**  
  Seamless login, signup (both regular users and astrologers) with JWT‑based authentication.

- **Real‑Time Communication**  
  Chat and call functionalities using Socket.IO, including typing indicators, chat summaries, and browser notifications.

- **Astrologer Listing & Filtering**  
  Dynamic filtering and pagination for astrologers based on rating, experience, languages, and specializations.

- **Astrological Reports & Horoscopes**  
  User input forms to generate personalized horoscopes by proxying requests to a Dockerized API (VedAstro).

- **Review System**  
  Submit, edit, and view reviews for astrologers with sorting and pagination.

- **Responsive UI**  
  Built using Next.js and Tailwind CSS with responsive components for an optimal experience on all devices.

- **Real‑Time Call Functionality**  
  Audio/video calls powered by WebRTC (using the simple-peer library) with options for screen sharing and call control.

---

## Technologies Used

- **Framework:** Next.js, React
- **State Management:** Redux Toolkit
- **Real-Time Communication:** Socket.IO, WebRTC (simple-peer)
- **Styling:** Tailwind CSS, CSS modules
- **Animations:** Framer Motion
- **APIs:** REST API endpoints (base URL: `/api/v1`) and integration with external horoscope API (VedAstro)
- **Authentication:** JWT-based (integrated with the backend)

---

### Installation

1. **repository:**

   ```bash
   cd jyotishconnect-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or using yarn:
   yarn install
   ```

3. **Set Up Environment Variables:**

   Create a `.env.local` file in the project root with the following variables (adjust as needed):

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:7000/api/v1
   NEXT_PUBLIC_SOCKET_URL=https://jyotishconnect.onrender.com
   ```

   These variables ensure the frontend knows where to send API requests and connect via Socket.IO.

---

## Scripts

In the project directory, you can run:

- **`npm run dev`**  
  Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **`npm run build`**  
  Builds the app for production.

- **`npm run start`**  
  Runs the production build.

- **`npm run lint`**  
  Lints the codebase for potential issues.

