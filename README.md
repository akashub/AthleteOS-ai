# AthleteOS.ai

**AI-Powered Fitness Platform**

AthleteOS.ai is a modern, full-stack fitness application that leverages artificial intelligence to help users plan, track, and optimize their workouts. With a beautiful React frontend, robust FastAPI backend, secure JWT authentication, and Google Gemini AI integration, AthleteOS.ai delivers personalized fitness plans and seamless workout management for athletes and enthusiasts.

---

## Features

- 🏋️ **Personalized AI Workout Plans**  
  Generate custom workout plans using Google Gemini AI based on your goals, equipment, and preferences.

- 📅 **Workout Collections & Tracking**  
  Organize workouts into collections, track progress, and view workout history.

- 👤 **User Profiles & Authentication**  
  Secure JWT-based authentication and profile management.

- 📊 **Progress & Analytics**  
  Visualize your progress with charts and stats.

- ⚡ **Modern UI/UX**  
  Responsive, mobile-friendly interface built with React, Tailwind CSS, and Radix UI.

- 🔒 **Backend API**  
  FastAPI backend with PostgreSQL database and modular architecture.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Radix UI, Framer Motion
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy, JWT Auth
- **AI Integration:** Google Gemini API (stubbed for local dev)
- **Other:** React Router, date-fns, Lucide Icons

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AthleteOS-ai.git
cd AthleteOS-ai
```

### 2. Setup the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Configure your .env file for DB and secrets
uvicorn app.main:app --reload
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

- Visit [http://localhost:5173](http://localhost:5173) to use the app.

---

## Project Structure

AthleteOS.ai/
  ├── backend/         # FastAPI backend (Python, PostgreSQL, JWT, Gemini AI)
  │   ├── app/
  │   │   ├── ai/      # AI integration (Google Gemini, stubs for local dev)
  │   │   ├── routers/ # API route definitions (users, workouts, ai, etc.)
  │   │   ├── auth.py  # Authentication logic
  │   │   ├── crud.py  # Database CRUD operations
  │   │   └── ...      # Other backend modules
  │   └── requirements.txt
  └── frontend/        # React frontend (Vite, Tailwind CSS, Radix UI)
      ├── Components/  # Reusable UI components (dashboard, plan, progress, etc.)
      ├── Entities/    # Entity definitions (User, Workout, etc.)
      ├── Pages/       # Top-level pages (Dashboard, Progress, etc.)
      ├── src/         # App entry, main.jsx, utils, integrations
      ├── index.html
      ├── package.json
      └── tailwind.config.js

---

## AI Integration

- The AI features are powered by Google Gemini (stubbed for local development).
- To enable real AI, add your Gemini API key and update the backend integration.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

---

## License

[MIT](LICENSE)

---

## Credits

- [React](https://react.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Google Gemini AI](https://ai.google.dev/gemini-api)

---

**AthleteOS.ai** – Level up your fitness with AI.
