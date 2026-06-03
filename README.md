# 🚩 Event Cashbook
Node.js Express MongoDB HTML5 CSS3 JavaScript License

A complete financial management system built with Node.js, Express, MongoDB, and modern web technologies to track Ganpati vargani (donations) and daily expenses. Features both a public web interface and a secure Admin dashboard.

🚀 Features • 🛠️ Tech Stack • 📦 Installation • 📖 Usage • 🌐 API Endpoints

![Project Banner](logo/logo.jpeg)

---

## 🎯 Purpose and Use Case

Managing a Ganpati Mandal's finances manually on paper is prone to errors, damage, and lacks transparency. This system solves that problem by providing:
- **Digital Cashbook:** Add, view, and manage daily Cash-In (Jama) and Cash-Out (Kharch) entries.
- **Automatic Calculations:** Instantly calculates total collections, total expenses, and the remaining balance.
- **Yearly Archives:** Organize records by year. Previous years' data can be archived and locked as PDFs.
- **PDF Generation:** Instantly generate beautiful, structured PDF reports of the cashbook to share with mandal members.
- **Secure Admin Panel:** Ensure that only authorized people (Admins) can modify the data.

---

## 🛠️ Technologies Used

- **Frontend (UI/UX):** HTML5, CSS3, Vanilla JavaScript (Dynamic DOM manipulation)
- **Backend (Server):** Node.js with Express.js
- **Database:** MongoDB (via Mongoose)
- **PDF Generation:** 
  - `html2canvas` and `jsPDF` for client-side rendering
  - `pdf-lib` for merging and managing uploaded PDFs
- **Styling:** Custom CSS (Modern UI, Glassmorphism, Responsive Design)
- **Fonts & Typography:** Google Fonts (Poppins, Noto Sans Devanagari)

---

## 🔒 Security Features

1. **Admin Login:** The Admin panel is protected by a password system (Local Storage based).
2. **Action Protection:** All destructive actions (Deleting entries, deleting panels, or deleting PDFs) are strictly controlled.
3. **Dual Password System:**
   - **Login Password:** Used to enter the admin dashboard.
   - **Super Admin PIN (Default Master Password):** Used as an extra layer of security before deleting any data or changing passwords.
4. **Environment Variables:** Sensitive data like the MongoDB connection string is hidden in a `.env` file and completely ignored by Git.

---

## 🚀 Setup & Installation Guide

Follow these steps to run the project locally on your machine.

### Prerequisites:
- **Node.js** (v14 or higher installed)
- **Git** (to clone the repository)
- A **MongoDB** database (Local or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/dhananjayranate-25/Shivsrushti-Boyz.git
cd Shivsrushti-Boyz
```

### 2. Install Dependencies
Run the following command in the project root to install all required Node modules:
```bash
npm install
```

### 3. Environment Variables (.env)
Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/GanpatiDB?retryWrites=true&w=majority
PORT=3003
```
*(Make sure to replace `<username>`, `<password>`, and the database URL with your actual MongoDB credentials)*

### 4. Start the Server
Run the Node.js server:
```bash
node server.js
```
The server will start running at `http://localhost:3003`.

### 5. Access the Web App
- **Public Home Page:** Open `http://localhost:3003/index.html` in your browser. Here, users can view uploaded Previous Year Cashbooks.
- **Admin Dashboard:** Open `http://localhost:3003/admin.html` to manage the cashbook.

---

## 🔑 Default Credentials

If you are running the project for the first time, the client-side local storage will use these defaults:
- **Admin Login Password:** `admin123`
- **Super Admin PIN (Master Password):** `Dhanu3010`

*(Note: You can change both of these from the "Change Password" section in the Admin Dashboard)*

---

## 📁 Project Structure

```
Shivsrushti-Boyz/
│
├── index.html        # Public Home Page (View Uploaded PDFs)
├── admin.html        # Admin Dashboard (Manage Entries, Panels, Settings)
├── style.css         # Global Stylesheet
├── script.js         # Frontend Logic (API Calls, DOM updates, PDF Generation)
│
├── server.js         # Node.js Backend Server (Express, MongoDB integration)
├── models/           # Mongoose Database Schemas
│   └── Entry.js      # Schema for Cashbook Entries
│
├── logo/             # Mandal Logos and Images
├── uploads/          # Directory where generated PDFs are stored (Ignored by Git)
│
├── package.json      # Node.js dependencies
├── .gitignore        # Ignored files (node_modules, .env, uploads)
└── README.md         # Project Documentation
```

---

## 👨‍💻 Developed By
**Dhananjay Ranate**
*Dedicated to the transparency and efficient management of Ganpati Mandals.*

|| ॐ गण गणपतये नमः ||
|| हर हर महादेव 🔱 ||
