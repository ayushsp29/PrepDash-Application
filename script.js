// --- Firebase and Global State Initialization ---

// Import the functions you need from the Firebase SDKs (Modern v9+ modular syntax)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your web app's Firebase configuration - PLEASE REPLACE WITH YOUR NEW, RESTRICTED API KEY
const firebaseConfig = {
    apiKey: "AIzaSyAsKuZFDCmOhEoBMqR21unqWNNlyMM3GAA",
    authDomain: "prepdash-ayush.firebaseapp.com",
    projectId: "prepdash-ayush",
    storageBucket: "prepdash-ayush.appspot.com",
    messagingSenderId: "271092355525",
    appId: "1:271092355525:web:3975358e5ec21056d7bbac"
};

// Initialize Firebase services using the modern syntax
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global state variables
let userId;
let weeklyProgressChart = null;
let habitCurveChart = null; // New chart instance
let currentView = 'today';
let currentDate = new Date();
let calendarDate = new Date(currentDate);
let userTimetable = [];
let taskStatuses = {};
let selectedCalendarDate = null;
let subjectTotalCounts = {};

// --- NEW: Habit Tracker State ---
let userHabits = [];
let habitCompletion = {}; // { "YYYY-MM-DD": { "Habit Name": true/false } }
let habitCurveState = { day: 0, value: 1.0, history: [] }; // Tracks the curve's state


// --- Application Data Constants ---
const dailyTasks = {
    // AUGUST DATA
    "2025-08-06": { "JAVA Core": "Core Java", "Apna Clg": "8,9,10" },
    "2025-08-07": { "Apna Clg": "11,12" },
    "2025-08-09": { "Apna Clg": "15,16" },
    "2025-08-10": { "Web Dev": "JS Pratice", "Apna Clg": "17,18.5" },
    "2025-08-11": { "DSA": "Arrays Easy: Q9–Q11", "Web Dev": "JS OOPS", "Apna Clg": "18.5,19" },
    "2025-08-12": { "DSA": "Arrays Easy: Q12–Q14", "Web Dev": "JS DOM and BOM", "T.I.M.E": "T.I.M.E #20" },
    "2025-08-13": { "DSA": "Arrays Medium: Q1–Q3", "Web Dev": "Advanced JS", "T.I.M.E": "T.I.M.E #21" },
    "2025-08-14": { "DSA": "Arrays Medium: Q4–Q6", "Web Dev": "Project on JS", "T.I.M.E": "T.I.M.E #22" },
    "2025-08-15": { "DSA": "Arrays Medium: Q7–Q9", "Web Dev": "Git and Github", "T.I.M.E": "T.I.M.E #23" },
    "2025-08-16": { "DSA": "Arrays Medium: Q10–Q12", "T.I.M.E": "T.I.M.E #24" },
    "2025-08-17": { "DSA": "Arrays Medium: Q13–Q14", "T.I.M.E": "T.I.M.E #25" },
    "2025-08-18": { "DSA": "Arrays Hard: Q1–Q3", "T.I.M.E": "T.I.M.E #26" },
    "2025-08-19": { "DSA": "Arrays Hard: Q4–Q6", "Web Dev": "Backend and Node", "T.I.M.E": "T.I.M.E #27" },
    "2025-08-20": { "DSA": "Arrays Hard: Q7–Q9", "Web Dev": "Databases", "JAVA Core": "J Unit", "T.I.M.E": "T.I.M.E #28" },
    "2025-08-21": { "DSA": "Arrays Hard: Q10–Q12", "Web Dev": "Mega Project", "T.I.M.E": "T.I.M.E #29" },
    "2025-08-22": { "DSA": "BS on 1D Arrays: Q1–Q3", "Web Dev": "Mega Project", "T.I.M.E": "T.I.M.E #30" },
    "2025-08-23": { "DSA": "BS on 1D Arrays: Q4–Q6", "Web Dev": "Mega Project" },
    "2025-08-24": { "DSA": "BS on 1D Arrays: Q7–Q9", "Web Dev": "MongoDB" },
    "2025-08-25": { "DSA": "BS on 1D Arrays: Q10–Q12" },
    "2025-08-26": { "DSA": "BS on 1D Arrays: Q13–Q13" },
    "2025-08-27": { "DSA": "BS on Answers: Q1–Q3", "JAVA Core": "DSA" },
    "2025-08-28": { "DSA": "BS on Answers: Q4–Q6", "Web Dev": "Mega Project" },
    "2025-08-29": { "DSA": "BS on Answers: Q7–Q9", "Web Dev": "Mega Project" },
    "2025-08-30": { "DSA": "BS on Answers: Q10–Q12", "Web Dev": "Mega Project" },
    "2025-08-31": { "DSA": "BS on Answers: Q13–Q14", "Web Dev": "Full stack Auth. Sys" },
    "2025-09-01": { "DSA": "BS on 2D Arrays: Q1–Q3", "Web Dev": "Full stack Auth. Sys" },
    "2025-09-02": { "DSA": "BS on 2D Arrays: Q4–Q5" },
    "2025-09-03": { "DSA": "Basic and Easy Strings: Q1–Q3", "JAVA Core": "Git and JDBC" },
    "2025-09-04": { "DSA": "Basic and Easy Strings: Q4–Q6" },
    "2025-09-05": { "DSA": "Basic and Easy Strings: Q7–Q7", "Web Dev": "Next Js." },
    "2025-09-06": { "DSA": "Medium String Problems: Q1–Q3", "Web Dev": "Next Js." },
    "2025-09-07": { "DSA": "Medium String Problems: Q4–Q6", "Web Dev": "Deploy" },
    "2025-09-08": { "DSA": "Medium String Problems: Q7–Q8", "Web Dev": "AI Powered" },
    "2025-09-09": { "DSA": "1D LinkedList: Q1–Q3", "Web Dev": "AI Powered" },
    "2025-09-10": { "DSA": "1D LinkedList: Q4–Q5", "Web Dev": "Master SQL", "JAVA Core": "Servlet and JSP" },
    "2025-09-11": { "DSA": "Doubly LinkedList: Q1–Q3", "Web Dev": "Master SQL" },
    "2025-09-12": { "DSA": "Doubly LinkedList: Q4–Q4" },
    "2025-09-13": { "DSA": "Medium Problems of LL: Q1–Q3" },
    "2025-09-14": { "DSA": "Medium Problems of LL: Q4–Q6" },
    "2025-09-15": { "DSA": "Medium Problems of LL: Q7–Q9", "Web Dev": "Event Driven" },
    "2025-09-16": { "DSA": "Medium Problems of LL: Q10–Q12", "Web Dev": "Event Driven" },
    "2025-09-17": { "DSA": "Medium Problems of LL: Q13–Q15", "Web Dev": "Fastify Framework", "JAVA Core": "Hibernet" },
    "2025-09-18": { "DSA": "Medium Problems of DLL: Q1–Q3", "Web Dev": "Fastify Framework" },
    "2025-09-19": { "DSA": "Hard Problems of LL: Q1–Q3", "Web Dev": "Secure LMS" },
    "2025-09-20": { "DSA": "Hard Problems of LL: Q4–Q4", "Web Dev": "Secure LMS" },
    "2025-09-21": { "DSA": "Get a Strong Hold (Recursion): Q1–Q3", "Web Dev": "Secure LMS" },
    "2025-09-22": { "DSA": "Get a Strong Hold (Recursion): Q4–Q5", "Web Dev": "Secure LMS" },
    "2025-09-23": { "DSA": "Subsequences Pattern (Recursion): Q1–Q3" },
    "2025-09-24": { "DSA": "Subsequences Pattern (Recursion): Q4–Q6", "JAVA Core": "Rest API web Service" },
    "2025-09-25": { "DSA": "Subsequences Pattern (Recursion): Q7–Q9", "Web Dev": "Docker" },
    "2025-09-26": { "DSA": "Subsequences Pattern (Recursion): Q10–Q12", "Web Dev": "Docker" },
    "2025-09-27": { "DSA": "Trying all Combos / Hard (Recursion): Q1–Q3" },
    "2025-09-28": { "DSA": "Trying all Combos / Hard (Recursion): Q4–Q6" },
    "2025-09-29": { "DSA": "Trying all Combos / Hard (Recursion): Q7–Q8" },
    "2025-09-30": { "DSA": "Learn Bit Manipulation: Q1–Q3" },
    "2025-10-01": { "DSA": "Learn Bit Manipulation: Q4–Q6", "JAVA Core": "Spring Framework" },
    "2025-10-02": { "DSA": "Learn Bit Manipulation: Q7–Q8" },
    "2025-10-03": { "DSA": "Interview Problems (Bit Manipulation): Q1–Q3" },
    "2025-10-04": { "DSA": "Interview Problems (Bit Manipulation): Q4–Q5" },
    "2025-10-05": { "DSA": "Advanced Maths (Bit Manipulation): Q1–Q3" },
    "2025-10-06": { "DSA": "Advanced Maths (Bit Manipulation): Q4–Q5" },
    "2025-10-07": { "DSA": "Learning (Stack & Queues): Q1–Q3" },
    "2025-10-08": { "DSA": "Learning (Stack & Queues): Q4–Q6", "JAVA Core": "Spring Th." },
    "2025-10-09": { "DSA": "Learning (Stack & Queues): Q7–Q8" },
    "2025-10-10": { "DSA": "Prefix, Infix, PostFix Conversion: Q1–Q3" },
    "2025-10-11": { "DSA": "Prefix, Infix, PostFix Conversion: Q4–Q6" },
    "2025-10-12": { "DSA": "Monotonic Stack/Queue Problems: Q1–Q3" },
    "2025-10-13": { "DSA": "Monotonic Stack/Queue Problems: Q4–Q6" },
    "2025-10-14": { "DSA": "Monotonic Stack/Queue Problems: Q7–Q9" },
    "2025-10-15": { "DSA": "Monotonic Stack/Queue Problems: Q10–Q11", "Web Dev": "Rest API", "JAVA Core": "Rest API" },
    "2025-10-16": { "DSA": "Implementation Problems (Stack & Queues): Q1–Q3" },
    "2025-10-17": { "DSA": "Implementation Problems (Stack & Queues): Q4–Q5" },
    "2025-10-18": { "DSA": "Medium Problems (Sliding Window & 2P): Q1–Q3" },
    "2025-10-19": { "DSA": "Medium Problems (Sliding Window & 2P): Q4–Q6" },
    "2025-10-20": { "DSA": "Medium Problems (Sliding Window & 2P): Q7–Q8" },
    "2025-10-21": { "DSA": "Hard Problems (Sliding Window & 2P): Q1–Q3" },
    "2025-10-22": { "DSA": "Hard Problems (Sliding Window & 2P): Q4–Q4", "Web Dev": "Projects", "JAVA Core": "Projects" },
    "2025-10-23": { "DSA": "Learning (Heap): Q1–Q3" },
    "2025-10-24": { "DSA": "Learning (Heap): Q4–Q4" },
    "2025-10-25": { "DSA": "Medium Problems (Heap): Q1–Q3" },
    "2025-10-26": { "DSA": "Medium Problems (Heap): Q4–Q6" },
    "2025-10-27": { "DSA": "Medium Problems (Heap): Q7–Q7" },
    "2025-10-28": { "DSA": "Hard Problems (Heap): Q1–Q3" },
    "2025-10-29": { "DSA": "Hard Problems (Heap): Q4–Q6", "Web Dev": "Spring AOP", "JAVA Core": "Spring AOP" },
    "2025-10-30": { "DSA": "Easy Problems (Greedy): Q1–Q3" },
    "2025-10-31": { "DSA": "Easy Problems (Greedy): Q4–Q5" },
    "2025-11-01": { "DSA": "Medium/Hard (Greedy): Q1–Q3" },
    "2025-11-02": { "DSA": "Medium/Hard (Greedy): Q4–Q6" },
    "2025-11-03": { "DSA": "Medium/Hard (Greedy): Q7–Q9" },
    "2025-11-04": { "DSA": "Medium/Hard (Greedy): Q10–Q11" },
    "2025-11-05": { "DSA": "Traversals (Binary Trees): Q1–Q3" },
    "2025-11-06": { "DSA": "Traversals (Binary Trees): Q4–Q6" },
    "2025-11-07": { "DSA": "Traversals (Binary Trees): Q7–Q9" },
    "2025-11-08": { "DSA": "Traversals (Binary Trees): Q10–Q12" },
    "2025-11-09": { "DSA": "Traversals (Binary Trees): Q13–Q13" },
    "2025-11-10": { "DSA": "Medium Problems (Binary Trees): Q1–Q3" },
    "2025-11-11": { "DSA": "Medium Problems (Binary Trees): Q4–Q6" },
    "2025-11-12": { "DSA": "Medium Problems (Binary Trees): Q7–Q9" },
    "2025-11-13": { "DSA": "Medium Problems (Binary Trees): Q10–Q12" },
    "2025-11-14": { "DSA": "Hard Problems (Binary Trees): Q1–Q3" },
    "2025-11-15": { "DSA": "Hard Problems (Binary Trees): Q4–Q6" },
    "2025-11-16": { "DSA": "Hard Problems (Binary Trees): Q7–Q9" },
    "2025-11-17": { "DSA": "Hard Problems (Binary Trees): Q10–Q12" },
    "2025-11-18": { "DSA": "Hard Problems (Binary Trees): Q13–Q14" },
    "2025-11-19": { "DSA": "Concepts (BST): Q1–Q3" },
    "2025-11-20": { "DSA": "Practice Problems (BST): Q1–Q3" },
    "2025-11-21": { "DSA": "Practice Problems (BST): Q4–Q6" },
    "2025-11-22": { "DSA": "Practice Problems (BST): Q7–Q9" },
    "2025-11-23": { "DSA": "Practice Problems (BST): Q10–Q12" },
    "2025-11-24": { "DSA": "Practice Problems (BST): Q13–Q13" },
    "2025-11-25": { "DSA": "Learning (Graphs): Q1–Q3" },
    "2025-11-26": { "DSA": "Learning (Graphs): Q4–Q6" },
    "2025-11-27": { "DSA": "Problems on BFS/DFS (Graphs): Q1–Q3" },
    "2025-11-28": { "DSA": "Problems on BFS/DFS (Graphs): Q4–Q6" },
    "2025-11-29": { "DSA": "Problems on BFS/DFS (Graphs): Q7–Q9" },
    "2025-11-30": { "DSA": "Problems on BFS/DFS (Graphs): Q10–Q12" },
    "2025-12-01": { "DSA": "Problems on BFS/DFS (Graphs): Q13–Q14" },
    "2025-12-02": { "DSA": "Topo Sort and Problems (Graphs): Q1–Q3" },
    "2025-12-03": { "DSA": "Topo Sort and Problems (Graphs): Q4–Q6" },
    "2025-12-04": { "DSA": "Topo Sort and Problems (Graphs): Q7–Q7" },
    "2025-12-05": { "DSA": "Shortest Path Algorithms (Graphs): Q1–Q3" },
    "2025-12-06": { "DSA": "Shortest Path Algorithms (Graphs): Q4–Q6" },
    "2025-12-07": { "DSA": "Shortest Path Algorithms (Graphs): Q7–Q9" },
    "2025-12-08": { "DSA": "Shortest Path Algorithms (Graphs): Q10–Q12" },
    "2025-12-09": { "DSA": "Shortest Path Algorithms (Graphs): Q13–Q13" },
    "2025-12-10": { "DSA": "MST/DSU (Graphs): Q1–Q3" },
    "2025-12-11": { "DSA": "MST/DSU (Graphs): Q4–Q6" },
    "2025-12-12": { "DSA": "MST/DSU (Graphs): Q7–Q9" },
    "2025-12-13": { "DSA": "MST/DSU (Graphs): Q10–Q11" },
    "2025-12-14": { "DSA": "Other Algorithms (Graphs): Q1–Q3" },
    "2025-12-15": { "DSA": "Introduction to DP: Q1–Q1" },
    "2025-12-16": { "DSA": "1D DP: Q1–Q3" },
    "2025-12-17": { "DSA": "1D DP: Q4–Q5" },
    "2025-12-18": { "DSA": "2D/3D DP: Q1–Q3" },
    "2025-12-19": { "DSA": "2D/3D DP: Q4–Q6" },
    "2025-12-20": { "DSA": "2D/3D DP: Q7–Q7" },
    "2025-12-21": { "DSA": "DP on Subsequences: Q1–Q3" },
    "2025-12-22": { "DSA": "DP on Subsequences: Q4–Q6" },
    "2025-12-23": { "DSA": "DP on Subsequences: Q7–Q9" },
    "2025-12-24": { "DSA": "DP on Subsequences: Q10–Q11" },
    "2025-12-25": { "DSA": "DP on Strings: Q1–Q3" },
    "2025-12-26": { "DSA": "DP on Strings: Q4–Q6" },
    "2025-12-27": { "DSA": "DP on Strings: Q7–Q9" },
    "2025-12-28": { "DSA": "DP on Strings: Q10–Q10" },
    "2025-12-29": { "DSA": "DP on Stocks: Q1–Q3" },
    "2025-12-30": { "DSA": "DP on Stocks: Q4–Q6" },
    "2025-12-31": { "DSA": "DP on LIS: Q1–Q3" },
    "2026-01-01": { "DSA": "DP on LIS: Q4–Q6" },
    "2026-01-02": { "DSA": "DP on LIS: Q7–Q7" },
    "2026-01-03": { "DSA": "MCM DP / Partition DP: Q1–Q3" },
    "2026-01-04": { "DSA": "MCM DP / Partition DP: Q4–Q6" },
    "2026-01-05": { "DSA": "MCM DP / Partition DP: Q7–Q7" },
    "2026-01-06": { "DSA": "DP on Squares: Q1–Q2" },
    "2026-01-07": { "DSA": "Advanced Maths (Bit Manipulation): Q1–Q1" },
    "2026-01-08": { "DSA": "Problems (Tries): Q1–Q3" },
    "2026-01-09": { "DSA": "Problems (Tries): Q4–Q6" },
    "2026-01-10": { "DSA": "Hard Problems (Strings): Q1–Q3" },
    "2026-01-11": { "DSA": "Hard Problems (Strings): Q4–Q6" },
    "2026-01-12": { "DSA": "Hard Problems (Strings): Q7–Q9" }
};
const coreCseRotation = ['OS', 'OS', 'OS', 'CN', 'CN', 'CN', 'DBMS', 'DBMS', 'SEPM', 'SEPM', 'OOPS'];
const defaultTimetable = [{ time: "5:45am–6:30am", activity: "Morning Fresh", from: "2025-08-01", to: "2026-01-31" }, { time: "6:30am–10:00am", activity: "DSA", from: "2025-08-01", to: "2026-01-31" }, { time: "10:00am–2:00pm", activity: "Internship", from: "2025-08-01", to: "2026-01-31" }, { time: "2:00pm–4:00pm", activity: "Core CSE", from: "2025-08-01", to: "2026-01-31" }, { time: "5:00pm–6:00pm", activity: "JAVA Core", from: "2025-08-01", to: "2026-01-31" }, { time: "6:00pm–8:00pm", activity: "T.I.M.E", from: "2025-08-01", to: "2026-01-31" }, { time: "8:30pm–10:30pm", activity: "Web Dev", from: "2025-08-01", to: "2026-01-31" }, { time: "11:00pm–12:00am", activity: "DSA Revision", from: "2025-08-01", to: "2026-01-31" }];
const startDate = new Date('2025-08-01T00:00:00');
const endDate = new Date('2026-01-15T00:00:00');

// --- Helper Functions ---
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function displayDate(date) { return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); }

// --- Core Application Logic ---
function main() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
            await loadUserData();
            calculateTotalSubjectOccurrences();
            setupInitialView();
            setupEventListeners();
        } else {
            await signInAnonymously(auth);
        }
    });
}

async function loadUserData() {
    // Timetable
    const timetableDocRef = doc(db, `users/${userId}/data/timetable`);
    const timetableDoc = await getDoc(timetableDocRef);
    if (timetableDoc.exists()) {
        userTimetable = timetableDoc.data().schedule.map(task => ({
            ...task,
            from: task.from || "2025-08-01",
            to: task.to || "2026-01-31"
        }));
    } else {
        userTimetable = defaultTimetable;
    }

    // Task Statuses
    const tasksCollectionRef = collection(db, `users/${userId}/tasks`);
    const tasksSnapshot = await getDocs(tasksCollectionRef);
    taskStatuses = {};
    tasksSnapshot.forEach(doc => {
        taskStatuses[doc.id] = doc.data();
    });

    // Habits
    const habitsDocRef = doc(db, `users/${userId}/data/habits`);
    const habitsDoc = await getDoc(habitsDocRef);
    if (habitsDoc.exists()) {
        userHabits = habitsDoc.data().habits || [];
    }

    // Habit Completion History
    const habitCompletionCollectionRef = collection(db, `users/${userId}/habitCompletion`);
    const habitCompletionSnapshot = await getDocs(habitCompletionCollectionRef);
    habitCompletion = {};
    habitCompletionSnapshot.forEach(doc => {
        habitCompletion[doc.id] = doc.data();
    });

    // Habit Curve State
    const habitCurveStateRef = doc(db, `users/${userId}/data/habitCurveState`);
    const habitCurveStateDoc = await getDoc(habitCurveStateRef);
    if (habitCurveStateDoc.exists()) {
        habitCurveState = habitCurveStateDoc.data();
    }
}


function setupInitialView() {
    document.getElementById('current-date-display').textContent = displayDate(currentDate);
    updateAllViews();
    switchView('today');
    checkYesterdayBacklogs();
}

function setupEventListeners() {
    window.switchView = switchView;
    window.changeMonth = changeMonth;
    window.handleCheckboxChange = handleCheckboxChange;
    window.completeBacklogTask = completeBacklogTask;
    window.saveTimetable = saveTimetable;
    window.saveHabits = saveHabits; // New event listener
    window.handleHabitChange = handleHabitChange; // New event listener
}

// --- Schedule Generation ---
function getScheduleForDay(date) {
    const dayOfWeek = date.getDay();
    const dateString = formatDate(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let schedule = userTimetable.filter(task => {
        const fromDate = new Date(task.from + 'T00:00:00');
        const toDate = new Date(task.to + 'T23:59:59');
        return date >= fromDate && date <= toDate;
    });

    if (isWeekend) {
        schedule = schedule.filter(t => t.activity !== 'Internship');
    }

    schedule.forEach(task => {
        task.details = (dailyTasks[dateString] && dailyTasks[dateString][task.activity]) || getDynamicDetail(task.activity, date) || '';
    });
    return schedule;
}

function getDynamicDetail(activity, date) {
    if (activity === 'Core CSE') {
        return getCoreCseTopic(date);
    }
    if (['DSA', 'Web Dev', 'T.I.M.E', 'JAVA Core'].includes(activity)) {
        return `Revision for ${activity}`;
    }
    return null;
}

function getCoreCseTopic(date) {
    let daysPassed = 0;
    let tempDate = new Date(startDate);
    while (formatDate(tempDate) < formatDate(date)) {
        if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
            daysPassed++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }
    return coreCseRotation[daysPassed % coreCseRotation.length];
}


// --- View Rendering ---
function renderToday() {
    const container = document.getElementById('view-today');
    container.innerHTML = `
        <div class="mb-6"><h2 class="text-3xl font-bold text-slate-900">Plan for ${displayDate(currentDate)}</h2></div>
        <div id="today-content-wrapper">
            <div class="bg-white p-6 rounded-xl shadow-sm">
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <h4 class="font-semibold text-slate-600">Daily Progress</h4>
                        <span id="daily-progress-text" class="text-sm font-semibold text-slate-600">0%</span>
                    </div>
                    <div class="progress-bar-container"><div id="daily-progress-bar" class="progress-bar-fill" style="width: 0%;"></div></div>
                </div>
                <h3 class="text-xl font-semibold mb-4 border-t pt-4">Daily Schedule</h3>
                <div id="daily-schedule-list" class="space-y-2"></div>
            </div>
        </div>`;
    renderSchedule(document.getElementById('daily-schedule-list'), currentDate);
    updateDailyProgressBar();
    renderDailyHabits(document.getElementById('today-content-wrapper'));
}

function renderCalendar() {
    const container = document.getElementById('view-calendar');
    const month = calendarDate.getMonth();
    const year = calendarDate.getFullYear();

    container.innerHTML = `
        <div class="mb-6"><h2 class="text-3xl font-bold text-slate-900">Monthly Calendar</h2><p class="text-slate-500">Get a high-level view of your schedule.</p></div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <button onclick="changeMonth(-1)" class="p-2 rounded-full hover:bg-slate-100">&lt;</button>
                <h3 id="calendar-month-year" class="text-xl font-bold">${calendarDate.toLocaleString('default', { month: 'long' })} ${year}</h3>
                <button onclick="changeMonth(1)" class="p-2 rounded-full hover:bg-slate-100">&gt;</button>
            </div>
            <div id="calendar-grid" class="grid grid-cols-7 gap-1 text-center"></div>
        </div>
        <div id="selected-day-details" class="mt-6 bg-white p-6 rounded-xl shadow-sm hidden"></div>`;

    const grid = document.getElementById('calendar-grid');
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => grid.innerHTML += `<div class="font-bold text-slate-600 text-sm py-2">${d}</div>`);
    for (let i = 0; i < new Date(year, month, 1).getDay(); i++) grid.appendChild(document.createElement('div'));

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = formatDate(date);
        const schedule = getScheduleForDay(date);
        const totalTasks = schedule.length;
        const completedTasks = schedule.filter(t => getTaskStatus(dateString, t.activity)).length;

        const dayEl = document.createElement('button');
        dayEl.textContent = day;
        dayEl.className = 'p-2 rounded-lg hover:bg-amber-100 transition-colors duration-200 relative';
        if (new Date(dateString) < new Date(formatDate(currentDate)) && totalTasks > 0) {
            if (completedTasks === totalTasks) dayEl.classList.add('bg-green-100', 'text-green-800');
            else if (completedTasks > 0) dayEl.classList.add('bg-yellow-100', 'text-yellow-800');
            else dayEl.classList.add('bg-red-100', 'text-red-800');
        }
        if (dateString === formatDate(currentDate)) dayEl.classList.add('ring-2', 'ring-amber-500');

        dayEl.onclick = () => {
            selectedCalendarDate = date;
            const detailView = document.getElementById('selected-day-details');
            detailView.classList.remove('hidden');
            detailView.innerHTML = `<h3 class="text-xl font-semibold mb-4">Plan for <span id="selected-date-display">${displayDate(date)}</span></h3><div id="selected-day-schedule-list" class="space-y-2"></div>`;
            renderSchedule(document.getElementById('selected-day-schedule-list'), date);
        };
        grid.appendChild(dayEl);
    }
    if (selectedCalendarDate && selectedCalendarDate.getMonth() === month) {
        const detailView = document.getElementById('selected-day-details');
        if (!detailView.classList.contains('hidden')) {
            detailView.innerHTML = `<h3 class="text-xl font-semibold mb-4">Plan for <span id="selected-date-display">${displayDate(selectedCalendarDate)}</span></h3><div id="selected-day-schedule-list" class="space-y-2"></div>`;
            renderSchedule(document.getElementById('selected-day-schedule-list'), selectedCalendarDate);
        }
    }
}

function renderBacklogs() {
    const container = document.getElementById('view-backlogs');
    container.innerHTML = `
        <div class="mb-6"><h2 class="text-3xl font-bold text-slate-900">Overdue Tasks</h2><p class="text-slate-500">Incomplete tasks from dates before today.</p></div>
        <div id="backlog-list" class="space-y-4"></div>`;
    const backlogs = calculateBacklogs();
    const listContainer = document.getElementById('backlog-list');
    if (backlogs.length === 0) {
        listContainer.innerHTML = `<div class="bg-green-100 text-green-800 p-4 rounded-lg text-center">Great job! No overdue tasks. ✅</div>`;
        return;
    }
    backlogs.forEach(({ date, task }) => {
        const dateString = formatDate(date);
        listContainer.innerHTML += `
            <div class="p-4 bg-white rounded-xl shadow-sm border-l-4 border-red-500 flex items-center">
                <div class="flex-1">
                    <p class="font-semibold">${task.activity}</p>
                    <p class="text-sm text-slate-500">${task.details || ''}</p>
                    <p class="text-xs font-bold text-red-600 mt-1">${displayDate(date)}</p>
                </div>
                <button onclick="completeBacklogTask('${dateString}', '${task.activity}')" class="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Complete</button>
            </div>`;
    });
}

function renderProgress() {
    const container = document.getElementById('view-progress');
    container.innerHTML = `
        <div class="mb-6"><h2 class="text-3xl font-bold text-slate-900">Progress Tracker</h2><p class="text-slate-500">Visualize your consistency.</p></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h3 class="text-xl font-semibold mb-4">Overall Weekly Completion</h3>
                <div class="chart-container"><canvas id="weeklyProgressChart"></canvas></div>
            </div>
            <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl shadow-sm text-center"><h3 class="text-xl font-semibold mb-2">Completion Streak</h3><p class="text-6xl font-bold text-amber-500"><span id="streak-count">0</span></p><p class="text-slate-500">days in a row</p></div>
                <div class="bg-white p-6 rounded-xl shadow-sm text-center"><h3 class="text-xl font-semibold mb-2">Overall Completion</h3><p class="text-6xl font-bold text-amber-500"><span id="overall-completion">0</span>%</p><p class="text-slate-500">of all tasks</p></div>
            </div>
        </div>
        <div>
            <h2 class="text-3xl font-bold text-slate-900 mb-6">Subject-wise Progress</h2>
            <div id="subject-progress-grid" class="subject-progress-grid"></div>
        </div>
        <div class="mt-8 pt-6 border-t">
            <h2 class="text-3xl font-bold text-slate-900 mb-6">Habit Consistency Curve</h2>
            <div class="bg-white p-6 rounded-xl shadow-sm">
                <div class="chart-container"><canvas id="habitCurveChart"></canvas></div>
            </div>
        </div>`;

    let totalTasks = 0,
        totalCompleted = 0,
        streak = 0;
    const weeklyData = {};
    let tempDate = new Date(startDate);

    while (formatDate(tempDate) <= formatDate(currentDate)) {
        const dateString = formatDate(tempDate);
        const schedule = getScheduleForDay(tempDate);
        const dayTasks = schedule.length;
        const dayCompleted = schedule.filter(t => getTaskStatus(dateString, t.activity)).length;
        if (dayTasks > 0) {
            const weekStart = new Date(tempDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekString = formatDate(weekStart);
            if (!weeklyData[weekString]) weeklyData[weekString] = { total: 0, completed: 0 };
            weeklyData[weekString].total += dayTasks;
            weeklyData[weekString].completed += dayCompleted;
        }
        totalTasks += dayTasks;
        totalCompleted += dayCompleted;
        tempDate.setDate(tempDate.getDate() + 1);
    }
    let streakDate = new Date(currentDate);
    streakDate.setDate(streakDate.getDate() - 1);
    while (true) {
        if (streakDate < startDate) break;
        const schedule = getScheduleForDay(streakDate);
        if (schedule.length > 0) {
            if (schedule.every(t => getTaskStatus(formatDate(streakDate), t.activity))) {
                streak++;
            } else {
                break;
            }
        }
        streakDate.setDate(streakDate.getDate() - 1);
    }
    document.getElementById('streak-count').textContent = streak;
    document.getElementById('overall-completion').textContent = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
    const labels = Object.keys(weeklyData).sort();
    const completionRates = labels.map(w => (weeklyData[w].total > 0 ? (weeklyData[w].completed / weeklyData[w].total) * 100 : 0));

    const chartType = completionRates.length > 1 ? 'line' : 'bar';

    if (weeklyProgressChart) weeklyProgressChart.destroy();

    const chartCtx = document.getElementById('weeklyProgressChart').getContext('2d');
    if (chartCtx) {
        const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');

        weeklyProgressChart = new Chart(chartCtx, {
            type: chartType,
            data: {
                labels: labels.map(l => `Week of ${l}`),
                datasets: [{
                    label: 'Weekly Completion %',
                    data: completionRates,
                    fill: true,
                    backgroundColor: chartType === 'line' ? gradient : '#fcd34d',
                    borderColor: '#f59e0b',
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#f59e0b',
                    tension: 0.3,
                    maxBarThickness: 60
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Completion: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    const subjectProgress = calculateSubjectProgress();
    const gridContainer = document.getElementById('subject-progress-grid');
    gridContainer.innerHTML = '';
    for (const subject in subjectProgress) {
        const data = subjectProgress[subject];
        const totalCount = subjectTotalCounts[subject] || 0;
        if (totalCount === 0) continue;

        const overallPercentage = totalCount > 0 ? Math.round((data.overall.completed / totalCount) * 100) : 0;
        const card = document.createElement('div');
        card.className = 'subject-progress-card';
        card.innerHTML = `
            <h4 class="text-lg font-bold text-slate-800">${subject}</h4>
            <p class="text-sm text-slate-500 mb-4">Overall: <span class="font-semibold">${data.overall.completed} / ${totalCount} tasks</span></p>
            <div class="flex justify-between items-center mb-1">
                <h5 class="text-sm font-semibold text-slate-600">Overall Progress</h5>
                <span class="text-sm font-semibold text-slate-600">${overallPercentage}%</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${overallPercentage}%;">${overallPercentage}%</div></div>`;
        gridContainer.appendChild(card);
    }
    renderHabitChart(); // New function call
}

function renderSettings() {
    const container = document.getElementById('view-settings');
    let timetableHTML = `<div class="grid grid-cols-12 gap-2 items-center mb-2 text-sm font-semibold text-slate-600"><div class="col-span-3">Time</div><div class="col-span-3">Activity</div><div class="col-span-2">Valid From</div><div class="col-span-2">Valid To</div><div class="col-span-2"></div></div>`;
    timetableHTML += userTimetable.map((task) => `<div class="grid grid-cols-12 gap-2 items-center timetable-row"><input type="text" value="${task.time}" class="col-span-3 p-2 border rounded-md timetable-time" placeholder="e.g., 9:00am-11:00am"><input type="text" value="${task.activity}" class="col-span-3 p-2 border rounded-md timetable-activity" placeholder="Activity Name"><input type="date" value="${task.from}" class="col-span-2 timetable-date-input timetable-from"><input type="date" value="${task.to}" class="col-span-2 timetable-date-input timetable-to"><div class="col-span-2 flex justify-end"><button onclick="this.closest('.timetable-row').remove()" class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">✕</button></div></div>`).join('');
    
    let habitsHTML = '';
    userHabits.forEach(habit => {
        habitsHTML += `
            <div class="grid grid-cols-12 gap-2 items-center habit-row">
                <input type="text" class="col-span-6 p-2 border rounded-md habit-name" placeholder="e.g., Read for 30 minutes" value="${habit.name}">
                <input type="date" class="col-span-2 timetable-date-input habit-from" value="${habit.from}">
                <input type="date" class="col-span-2 timetable-date-input habit-to" value="${habit.to}">
                <div class="col-span-2 flex justify-end">
                    <button onclick="this.closest('.habit-row').remove()" class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">✕</button>
                </div>
            </div>`;
    });

    container.innerHTML = `
        <div class="mb-6"><h2 class="text-3xl font-bold text-slate-900">Settings</h2><p class="text-slate-500">Customize your default daily timetable.</p></div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Edit Timetable</h3>
            <div id="timetable-editor" class="space-y-3">${timetableHTML}</div>
            <div class="mt-4"><button id="add-task-btn" class="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Add Task</button></div>
            <div class="mt-6 border-t pt-4"><button onclick="saveTimetable()" class="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600">Save Changes</button></div>
        
            <div class="mt-8 pt-6 border-t">
                <h3 class="text-xl font-semibold mb-4">Edit Habits</h3>
                <div id="habit-editor" class="space-y-3">${habitsHTML}</div>
                <div class="mt-4">
                    <button id="add-habit-btn" class="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Add Habit</button>
                </div>
                <div class="mt-6">
                    <button onclick="saveHabits()" class="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600">Save Habits</button>
                </div>
            </div>
        </div>`;
    
    document.getElementById('add-task-btn').onclick = () => { document.getElementById('timetable-editor').insertAdjacentHTML('beforeend', `<div class="grid grid-cols-12 gap-2 items-center timetable-row"><input type="text" class="col-span-3 p-2 border rounded-md timetable-time" placeholder="e.g., 9:00am-11:00am"><input type="text" class="col-span-3 p-2 border rounded-md timetable-activity" placeholder="Activity Name"><input type="date" value="2025-08-01" class="col-span-2 timetable-date-input timetable-from"><input type="date" value="2026-01-31" class="col-span-2 timetable-date-input timetable-to"><div class="col-span-2 flex justify-end"><button onclick="this.closest('.timetable-row').remove()" class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">✕</button></div></div>`); };
    document.getElementById('add-habit-btn').onclick = () => {
        document.getElementById('habit-editor').insertAdjacentHTML('beforeend', `
            <div class="grid grid-cols-12 gap-2 items-center habit-row">
                <input type="text" class="col-span-6 p-2 border rounded-md habit-name" placeholder="e.g., Read for 30 minutes">
                <input type="date" class="col-span-2 timetable-date-input habit-from">
                <input type="date" class="col-span-2 timetable-date-input habit-to">
                <div class="col-span-2 flex justify-end">
                    <button onclick="this.closest('.habit-row').remove()" class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">✕</button>
                </div>
            </div>`);
    };
}


function renderSchedule(container, date) {
    container.innerHTML = '';
    const dateString = formatDate(date);
    const schedule = getScheduleForDay(date);
    schedule.forEach(task => {
        const taskId = `task-${dateString}-${task.activity.replace(/\s+/g, '-')}`;
        const isChecked = getTaskStatus(dateString, task.activity);
        container.innerHTML += `
            <div class="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div class="w-32 text-sm font-semibold text-slate-600">${task.time}</div>
                <div class="flex-1">
                    <input type="checkbox" id="${taskId}" class="task-checkbox mr-3" onchange="handleCheckboxChange('${dateString}', '${task.activity}', this.checked)" ${isChecked ? 'checked' : ''}>
                    <label for="${taskId}" class="font-semibold">${task.activity}</label>
                    ${task.details ? `<p class="text-sm text-slate-500 ml-7">${task.details}</p>` : ''}
                </div>
            </div>`;
    });
}

// --- Data Handling and State Management ---
async function handleCheckboxChange(dateString, activity, isChecked) {
    if (!taskStatuses[dateString]) taskStatuses[dateString] = {};
    taskStatuses[dateString][activity] = isChecked;
    const taskDocRef = doc(db, `users/${userId}/tasks/${dateString}`);
    await setDoc(taskDocRef, taskStatuses[dateString], { merge: true });
    updateAllViews();
}

async function saveTimetable() {
    const editor = document.getElementById('timetable-editor');
    const newTimetable = Array.from(editor.querySelectorAll('.timetable-row')).map(row => ({
        time: row.querySelector('.timetable-time').value,
        activity: row.querySelector('.timetable-activity').value,
        from: row.querySelector('.timetable-from').value,
        to: row.querySelector('.timetable-to').value
    })).filter(task => task.time && task.activity && task.from && task.to);
    const timetableDocRef = doc(db, `users/${userId}/data/timetable`);
    await setDoc(timetableDocRef, { schedule: newTimetable });
    userTimetable = newTimetable;
    calculateTotalSubjectOccurrences();
    alert('Timetable saved successfully!');
    updateAllViews();
}

function calculateBacklogs() {
    const backlogs = [];
    let tempDate = new Date(startDate);
    const todayString = formatDate(currentDate);
    while (formatDate(tempDate) < todayString) {
        const dateString = formatDate(tempDate);
        getScheduleForDay(tempDate).forEach(task => {
            if (!getTaskStatus(dateString, task.activity)) {
                backlogs.push({ date: new Date(tempDate), task });
            }
        });
        tempDate.setDate(tempDate.getDate() + 1);
    }
    return backlogs;
}

async function completeBacklogTask(dateString, activity) {
    await handleCheckboxChange(dateString, activity, true);
}

function checkYesterdayBacklogs() {
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday >= startDate) {
        const dateString = formatDate(yesterday);
        const backlogs = getScheduleForDay(yesterday).filter(task => !getTaskStatus(dateString, task.activity));
        if (backlogs.length > 0) {
            document.getElementById('modal-backlog-count').textContent = backlogs.length;
            document.getElementById('email-modal').classList.remove('hidden');
        }
    }
}

// --- View Switching and Updates ---
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-content').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${view}`).classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('bg-slate-700'));
    document.querySelector(`button[onclick="switchView('${view}')"]`).classList.add('bg-slate-700');
    updateView(view);
}

function updateView(view) {
    document.getElementById(`view-${view}`).innerHTML = '';
    if (view === 'today') renderToday();
    else if (view === 'calendar') renderCalendar();
    else if (view === 'backlogs') renderBacklogs();
    else if (view === 'progress') renderProgress();
    else if (view === 'settings') renderSettings();
}

function updateAllViews() {
    updateView(currentView);
    const backlogCount = calculateBacklogs().length;
    const badge = document.getElementById('backlog-badge');
    if (backlogCount > 0) {
        badge.textContent = backlogCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// --- NEW/MODIFIED Feature Logic & Helpers ---
function updateDailyProgressBar() {
    const trackableTasks = getScheduleForDay(currentDate).filter(task => task.activity !== 'Morning Fresh');
    if (trackableTasks.length === 0) {
        document.getElementById('daily-progress-text').textContent = 'No tasks today';
        document.getElementById('daily-progress-bar').style.width = '0%';
        return;
    }
    const completedTasks = trackableTasks.filter(task => getTaskStatus(formatDate(currentDate), task.activity)).length;
    const percentage = Math.round((completedTasks / trackableTasks.length) * 100);
    const bar = document.getElementById('daily-progress-bar');
    const text = document.getElementById('daily-progress-text');

    bar.style.width = `${percentage}%`;
    bar.textContent = `${percentage}%`;
    text.textContent = `${completedTasks} / ${trackableTasks.length} tasks completed`;
}

function calculateTotalSubjectOccurrences() {
    // A set of all possible Core CSE subjects from the rotation.
    const coreSubjects = new Set(coreCseRotation);
    // Subjects that should not be tracked in the progress view.
    const nonTrackableSubjects = ['Morning Fresh', 'Internship', 'DSA Revision', 'Core CSE'];

    const counts = {};

    // --- Logic for non-Core CSE subjects ---
    // Calculate totals based on the duration of their timetable entry.
    userTimetable.forEach(task => {
        const subjectName = task.activity;
        // Process only if it's a trackable subject and NOT a Core CSE subject.
        if (!coreSubjects.has(subjectName) && !nonTrackableSubjects.includes(subjectName)) {
            const fromDate = new Date(task.from + 'T00:00:00');
            const toDate = new Date(task.to + 'T00:00:00');

            // Ensure dates are valid before calculating.
            if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
                const diffTime = Math.abs(toDate - fromDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to make the range inclusive.

                // If the subject already has a count (from another timetable entry), add to it.
                counts[subjectName] = (counts[subjectName] || 0) + diffDays;
            }
        }
    });

    // --- Logic for Core CSE subjects ---
    // Initialize their counts to 0.
    coreSubjects.forEach(sub => {
        counts[sub] = 0;
    });

    // Iterate day-by-day to count actual appearances, as their schedule is rotational.
    let tempDate = new Date(startDate);
    while (tempDate <= endDate) {
        // This check is specifically for the 'Core CSE' task in the timetable.
        if (userTimetable.some(task => task.activity === 'Core CSE')) {
            let activeCoreSubject = getCoreCseTopic(tempDate);
            if (counts.hasOwnProperty(activeCoreSubject)) {
                // We only count on weekdays, consistent with the original logic.
                const dayOfWeek = tempDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    counts[activeCoreSubject]++;
                }
            }
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }

    subjectTotalCounts = counts;
}


function calculateSubjectProgress() {
    // The subjects to track are now the keys of the dynamically generated subjectTotalCounts object.
    const subjectsToTrack = Object.keys(subjectTotalCounts);
    const progress = {};

    // Initialize the progress object for all dynamically found subjects.
    subjectsToTrack.forEach(sub => {
        progress[sub] = {
            overall: { completed: 0, total: subjectTotalCounts[sub] || 0 }
        };
    });

    let tempDate = new Date(startDate);
    // Changed < to <= to include today's date in calculations.
    while (formatDate(tempDate) <= formatDate(currentDate)) {
        const dateString = formatDate(tempDate);
        const schedule = getScheduleForDay(tempDate);
        schedule.forEach(task => {
            let subject = task.activity === 'Core CSE' ? getCoreCseTopic(tempDate) : task.activity;
            // Check if the subject exists in our progress object and is marked as completed.
            if (progress.hasOwnProperty(subject) && getTaskStatus(dateString, task.activity)) {
                progress[subject].overall.completed++;
            }
        });
        tempDate.setDate(tempDate.getDate() + 1);
    }
    return progress;
}

function changeMonth(offset) {
    selectedCalendarDate = null;
    calendarDate.setMonth(calendarDate.getMonth() + offset);
    renderCalendar();
}

function getTaskStatus(dateString, activity) {
    return taskStatuses[dateString] ? taskStatuses[dateString][activity] === true : false;
}

// --- NEW Habit Functions ---

async function saveHabits() {
    const editor = document.getElementById('habit-editor');
    const newHabits = Array.from(editor.querySelectorAll('.habit-row')).map(row => ({
        name: row.querySelector('.habit-name').value,
        from: row.querySelector('.habit-from').value,
        to: row.querySelector('.habit-to').value
    })).filter(h => h.name && h.from && h.to);

    const habitsDocRef = doc(db, `users/${userId}/data/habits`);
    await setDoc(habitsDocRef, { habits: newHabits });
    userHabits = newHabits;
    alert('Habits saved successfully!');
    updateAllViews();
}

function getActiveHabitsForDay(date) {
    const dateString = formatDate(date);
    return userHabits.filter(habit => {
        return dateString >= habit.from && dateString <= habit.to;
    });
}

function getHabitStatus(date, habitName) {
    const dateString = formatDate(date);
    return habitCompletion[dateString] ? habitCompletion[dateString][habitName] === true : false;
}

async function handleHabitChange(dateString, habitName, isChecked) {
    const date = new Date(dateString + 'T00:00:00');
    if (!habitCompletion[dateString]) {
        habitCompletion[dateString] = {};
    }
    habitCompletion[dateString][habitName] = isChecked;

    // Save individual habit completion status
    const habitCompletionRef = doc(db, `users/${userId}/habitCompletion/${dateString}`);
    await setDoc(habitCompletionRef, habitCompletion[dateString], { merge: true });

    // Update the curve based on the day's total completion
    await updateHabitCurve(date);
    updateAllViews();
}

async function updateHabitCurve(date) {
    const dateString = formatDate(date);
    const activeHabits = getActiveHabitsForDay(date);

    if (activeHabits.length === 0) return; // No habits to track for this day

    // Prevent re-calculating for an already processed day
    if (habitCurveState.lastProcessedDate === dateString && habitCurveState.day >= 100) {
        return;
    }
    
    // Check if all active habits for the given day are completed
    const allHabitsCompleted = activeHabits.every(habit => getHabitStatus(date, habit.name));

    // Only update if it's a new day or the first time processing today
    if (habitCurveState.lastProcessedDate !== dateString) {
        if (habitCurveState.day >= 100) { // Reset after 100 days
             habitCurveState = { day: 0, value: 1.0, history: [] };
        }
        
        const newDay = habitCurveState.day + 1;
        const newValue = allHabitsCompleted ? habitCurveState.value * 1.01 : habitCurveState.value * 0.99;
        
        habitCurveState.day = newDay;
        habitCurveState.value = newValue;
        habitCurveState.lastProcessedDate = dateString;
        habitCurveState.history.push({ day: newDay, value: newValue });

        // Save the updated curve state to Firestore
        const habitCurveStateRef = doc(db, `users/${userId}/data/habitCurveState`);
        await setDoc(habitCurveStateRef, habitCurveState);
    }
}


function renderDailyHabits(container) {
    const activeHabits = getActiveHabitsForDay(currentDate);
    if (activeHabits.length === 0) return;

    let habitsHTML = `
        <div class="mt-6 bg-white p-6 rounded-xl shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Daily Habits</h3>
            <div id="daily-habits-list" class="space-y-2">`;
    
    const dateString = formatDate(currentDate);
    activeHabits.forEach(habit => {
        const habitId = `habit-${dateString}-${habit.name.replace(/\s+/g, '-')}`;
        const isChecked = getHabitStatus(currentDate, habit.name);
        habitsHTML += `
            <div class="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <input type="checkbox" id="${habitId}" class="task-checkbox mr-3" onchange="handleHabitChange('${dateString}', '${habit.name}', this.checked)" ${isChecked ? 'checked' : ''}>
                <label for="${habitId}" class="font-semibold">${habit.name}</label>
            </div>`;
    });

    habitsHTML += `</div></div>`;
    container.insertAdjacentHTML('beforeend', habitsHTML);
}

function renderHabitChart() {
    if (habitCurveChart) {
        habitCurveChart.destroy();
    }
    if (!habitCurveState.history || habitCurveState.history.length === 0) {
        return; // Don't render an empty chart
    }

    const labels = habitCurveState.history.map(d => `Day ${d.day}`);
    const dataPoints = habitCurveState.history.map(d => d.value);

    const ctx = document.getElementById('habitCurveChart').getContext('2d');
    habitCurveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Habit Growth',
                data: dataPoints,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2); // Format to 2 decimal places
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Value: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        }
    });
}


// --- Entry Point ---
main();
