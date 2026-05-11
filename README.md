# 👥 Employee Management System

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A **full-featured employee management system** with secure login authentication, complete CRUD operations, and a modern dashboard interface. Demonstrates frontend architecture, state management, and secure authentication patterns.

## 🌐 Live Demo

🔗 **[View Live App →](https://kunchamarjun05.github.io/employee-management-system/)**

---

## 📸 Screenshots

<!-- 
  TODO: Add screenshots!
  ![Login Page](screenshots/login.png)
  ![Dashboard](screenshots/dashboard.png)
  ![Employee List](screenshots/employees.png)
-->

*Screenshots coming soon — [Try the live app](https://kunchamarjun05.github.io/employee-management-system/)!*

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Login** | Authentication with input validation & error handling |
| 👤 **Full CRUD** | Create, Read, Update & Delete employee records |
| 📊 **Dashboard** | Overview with employee statistics & metrics |
| 🔍 **Search & Filter** | Instantly find employees by name, department, or role |
| 📱 **Responsive Design** | Professional layout on all screen sizes |
| 🎨 **Modern UI** | Clean, corporate-grade interface design |
| 💾 **Local Storage** | Data persists across browser sessions |

## 🔐 Authentication Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌────────────┐
│ Login     │ ──> │ Validate    │ ──> │ Set Session  │ ──> │ Dashboard  │
│ Page      │     │ Credentials │     │ Token        │     │ Access     │
└──────────┘     └─────────────┘     └──────────────┘     └────────────┘
                        │
                  ┌─────┴─────┐
                  │ Invalid?  │
                  │ Show Error│
                  └───────────┘
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic Structure |
| **CSS3** | Professional Styling & Animations |
| **JavaScript (ES6+)** | Auth Logic, CRUD & State Management |
| **Local Storage** | Client-side Data Persistence |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kunchamarjun05/employee-management-system.git
cd employee-management-system

# Open login page
open login.html
```

## 📁 Project Structure

```
employee-management-system/
├── login.html    # Login page with authentication
├── login.css     # Login page styling (14KB)
├── login.js      # Auth validation logic (8KB)
├── index.html    # Main dashboard (20KB)
├── style.css     # Dashboard styling (20KB)
├── app.js        # CRUD operations & state management (23KB)
└── README.md
```

**Total codebase: ~96KB of hand-written code** — No frameworks, no libraries, 100% vanilla JavaScript.

## 📚 What I Learned

- Client-side authentication patterns and session management
- CRUD operations with JavaScript and DOM manipulation
- State management without frameworks (vanilla JS)
- Local Storage API for data persistence
- Form validation and error handling UX patterns
- Building a multi-page application with shared state

## 👨‍💻 Author

**Arjun Kuncham**  
🌐 [Portfolio](https://kunchamarjun05.github.io/portfolio/) • 💻 [GitHub](https://github.com/kunchamarjun05) • 📧 arjunkuncham05@gmail.com

---

⭐ Star this repo if you found it useful!
