# Prep Dash 🚀

**The Ultimate Student Planner for Academic Success**

Prep Dash is a dynamic, all-in-one dashboard designed to help students organize their tasks, track their progress, and build consistent habits. Built with vanilla JavaScript and Firebase, this application provides a robust suite of tools to manage a demanding academic schedule, visualize progress, and stay motivated through the power of continuous improvement.

**[➡️ View Live Demo](https://prep-dash-application.vercel.app/)**



---

## ✨ Core Features

-   **Today's Dashboard:** A focused view of your daily tasks and habits, with a progress bar to track completion in real-time.
-   **Monthly Calendar:** Visualize your schedule for the entire month, with color-coded days indicating your performance (completed, partially completed, or missed).
-   **Backlog Management:** Never miss a task. All incomplete items from previous days are automatically moved to a dedicated backlog view for easy completion.
-   **Dynamic Subject Progress Tracker:** Monitor your performance in each subject with dynamic progress bars showing your completion rate based on your custom schedule.
-   **Habit Consistency Curve:** Build momentum with the unique "1% Better" tracker. A visual curve shows your compounding growth based on daily habit completion.
-   **Fully Customizable:** Easily edit your daily timetable and add or remove habits through the intuitive settings page. All data is saved to a backend database.

---

## 🛠️ Tech Stack

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
-   **Styling:** Tailwind CSS
-   **Backend & Database:** Google Firebase (Firestore, Authentication)
-   **Charting:** Chart.js
-   **Deployment:** Vercel

---

## ⚙️ Local Setup & Installation

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/prep-dash.git](https://github.com/your-username/prep-dash.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd prep-dash
    ```

3.  **Set up your Firebase Configuration:**
    -   This is the most important step. The application requires a connection to a Firebase project to function.
    -   In the `script.js` file, locate the `firebaseConfig` object.
    -   You must replace the placeholder values with your own Firebase project's configuration.

    ```javascript
    // In script.js
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY", // IMPORTANT!
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    ```

4.  **Secure Your API Key:**
    -   For security, it is **critical** that you restrict your Firebase API key.
    -   Go to the **Google Cloud Console**, navigate to **APIs & Services > Credentials**.
    -   Select your API key and under "Application restrictions," add your local development URL (`http://localhost:your-port`) and your deployed Vercel URL.
    -   Under "API restrictions," ensure you have enabled the **Identity Toolkit API** and the **Cloud Firestore API**.

5.  **Run the application:**
    -   The easiest way to run the project locally is by using a live server extension in your code editor (like VS Code's "Live Server").
    -   Right-click on `index.html` and select "Open with Live Server".

---

## ⚠️ Current Limitations

-   **No User Accounts:** The app currently uses Firebase's anonymous authentication. This means data is tied to a single browser session and cannot be accessed across different devices without a full user account system.
-   **Single User Focus:** The application is designed for individual use and does not support collaboration or team features.
-   **No Offline Support:** An active internet connection is required to sync all data with Firebase.

---

## 🔮 Future Scope & Coming Soon

The goal is to continue evolving Prep Dash into an even more powerful tool for students.

### Future Enhancements:
-   **Full Authentication:** Implementing email/password and social logins (Google, GitHub) to allow users to access their data across multiple devices securely.
-   **Data Export:** Adding functionality to export progress reports and schedules as PDF or CSV files.
-   **Mobile App:** Developing native iOS and Android applications for a seamless mobile experience.
-   **Gamification:** Introducing points, achievement badges, and leaderboards to further motivate users and make learning more engaging.

### Coming Soon:
-   **Expense Tracker:** A new module to help students manage their budget, track spending, and stay on top of their finances.

---

## 👨‍💻 Connect with Me

This project was created by **Ayush Patil**. Feel free to reach out!

[<img src="https://img.icons8.com/fluent/48/000000/github.png" width="30">](https://github.com/ayushsp29) &nbsp;&nbsp;
[<img src="https://img.icons8.com/fluent/48/000000/linkedin.png" width="30">](https://www.linkedin.com/in/ayush-patil-techie) &nbsp;&nbsp;
[<img src="https://img.icons8.com/fluent/48/000000/gmail.png" width="30">](mailto:work.ayushsp29@gmail.com) &nbsp;&nbsp;
[<img src="https://img.icons8.com/fluent/48/000000/phone.png" width="30">](tel:+918055289366)

