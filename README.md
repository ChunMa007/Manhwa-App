# Manhwa App
A full-stack Manhwa bookmarking application built with React on the frontend and Django on the backend.

This app integrates the MangaDex API to retrieve and display manga content, allowing users to browse and read chapters directly. It also uses a custom API built with Django REST Framework to handle user-related features such as:

* Signing up and logging in

* Adding and managing favorites

* Editing account information

* Changing passwords

To secure these operations, the app implements Simple JWT authentication, ensuring that only authenticated users can perform actions like favoriting manga or modifying their profile, and that each request is verified to come from the currently logged-in user.



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

---

### 📄 Page Descriptions

### 🏠 Homepage
The homepage displays a list of all available manga. This page is publicly accessible, meaning both logged-in and guest users can browse and read manga. It serves as the entry point of the app, offering open access to manga content.
![Homepage](screenshots/Screenshot%202025-06-24%20005010.png)

### 🔐 Login Page
Once users create an account, they can log in through this page. Upon successful login, the backend issues two tokens — an access token and a refresh token — using Django REST Framework's Simple JWT authentication system. These tokens are used to securely access user-restricted features throughout the app.
![Login](screenshots/Screenshot%202025-06-24%20005240.png)

### ⭐ Favorites Page
Users can bookmark their favorite manga titles here. However, adding to favorites requires authentication. If a guest tries to add a favorite, they’ll be redirected to sign up or log in first.
![Dashboard](screenshots/Screenshot%202025-06-24%20005023.png)

### ℹ️ Info Page
When a manga is selected on the homepage, users are taken to the Info Page. This page displays detailed information about the manga, including its title, description, and chapter list. A button labeled "Add to Favorites" allows logged-in users to bookmark the manga directly from this page.
![Details](screenshots/Screenshot%202025-06-24%20005153.png)

### 📖 Read Page
This is the reading interface where users can view manga chapters. It includes Next and Previous buttons to navigate between chapter pages, providing a smooth reading experience.
![Bookmarks](screenshots/Screenshot%202025-06-24%20005208.png)

### ⚙️ Settings Page
The Settings Page displays the user's account information. Here, users can update their profile details and change their password. When changes are submitted, a request is sent to the backend to securely update their credentials.
![Settings](screenshots/Screenshot%202025-06-24%20005110.png)


