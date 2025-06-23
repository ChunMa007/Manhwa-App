# Manhwa App
A full-stack Manhwa bookmarking application with Django as the backend and React (Vite) as the frontend.

---

## 🛠️ Getting Started

Follow these steps to run the project after cloning.

### 📥 Clone the Repository
```bash
git clone https://github.com/ChunMa007/Manhwa-App.git
```



### 🔧 Backend Setup (Django)
##### 1. Optional: Set Execution Policy (Windows Only)
If your system has restricted execution policies, run:
```bash
set-executionpolicy -scope process -executionpolicy bypass
```

##### 2. Activate the Virtual Environment
```bash
venv/Scripts/activate
```

##### 3. Navigate to the Backend Directory
```bash
cd backend
```

##### 4. Run the Django Development Server
```bash
py manage.py runserver
```

### 💻 Frontend Setup (React + Vite)
Open a new terminal while the backend server is running.

##### 1. Optional: Set Execution Policy (Windows Only)
If your system has restricted execution policies, run:
```bash
set-executionpolicy -scope process -executionpolicy bypass
```

##### 2. Activate the Virtual Environment
```bash
venv/Scripts/activate
```

##### 3. Navigate to the Frontend Directory
```bash
cd frontend
```

##### 4. Install Dependencies
```bash
npm install
```

##### 5.Run the React Dev Server
```bash
npm run dev
```

### ✅ Project Structure
```bash
Manhwa-App/
├── backend/     # Django backend
├── frontend/    # React frontend
├── venv/        # Python virtual environment
```

### ⚠️ Notes
  ###### Make sure Python, Node.js, and npm are installed on your machine.
  ###### The venv/ folder must already exist in the cloned repo or be created manually with python -m venv venv.
  ###### React runs on http://localhost:5173 by default.
  ###### Django runs on http://localhost:8000 by default.

