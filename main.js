let chores = loadChores();

/* -------------------------
   LOAD / SAVE
--------------------------*/

function loadChores() {
    const saved = localStorage.getItem("chores");
    if (saved) return JSON.parse(saved);
    return defaultChores;
}

function saveChores() {
    localStorage.setItem("chores", JSON.stringify(chores));
}

/* -------------------------
   DATE LOGIC
--------------------------*/

function updateDueDate(chore) {
    const interval = chore.intervalDays;

    const [year, month, day] = chore.dueDate.split("-");

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    date.setDate(date.getDate() + interval);

    chore.dueDate = date.toISOString().split("T")[0];
}

function daysUntil(dueDateString) {
    const today = new Date();
    const [year, month, day] = dueDateString.split("-");

    const utcToday = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const utcDue = Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    return Math.round((utcDue - utcToday) / (1000 * 60 * 60 * 24));
}

function getDueText(daysDifference) {
    if (daysDifference < -1) return `Due ${Math.abs(daysDifference)} Days Ago`;
    if (daysDifference === -1) return "Due Yesterday";
    if (daysDifference === 0) return "Due Today";
    if (daysDifference === 1) return "Due Tomorrow";
    return `Due in ${daysDifference} Days`;
}

/* -------------------------
   PEOPLE LOOKUP
--------------------------*/

function getPersonName(personId) {
    const person = people.find(p => p.id === personId);
    return person ? person.name : "Unknown Person";
}

/* -------------------------
   ROTATION LOGIC
--------------------------*/

function getRotationGroup(groupName) {
    return rotationGroups[groupName];
}

function getActiveMembers(groupName) {
    const members = getRotationGroup(groupName);

    return members.filter(memberId => {
        const person = people.find(p => p.id === memberId);
        return person && person.active;
    });
}

function rotateAssignment(chore) {
    const members = getActiveMembers(chore.rotationGroup);
    if (members.length === 0) {
    console.warn(
        `Rotation group "${chore.rotationGroup}" has no active members.`
    );
    chore.assignedTo = null;
    return;
    }
    const currentIndex = members.indexOf(chore.assignedTo);
    let nextIndex;
    if (currentIndex === -1) {
        nextIndex = 0;
    }
    else {
        nextIndex = (currentIndex + 1) % members.length;
    }
    chore.assignedTo = members[nextIndex];
}

/* -------------------------
   RENDERING
--------------------------*/

function renderTasks(taskArray, container) {

    if (taskArray.length === 0) {
        container.innerHTML = `<div class="noTasks">No Tasks Due</div>`;
        return;
    }

    let html = "";

    taskArray.forEach(chore => {

        const dueText = getDueText(chore.daysDifference);

        html += `
            <div class="taskCard">
                <div class="taskRow">
                    <input type="checkbox"
                           data-id="${chore.id}"
                           ${chore.completed ? "checked" : ""}>
                    <span class="taskName">${chore.name}</span>
                </div>
                <div class="assignee">
                    Assigned to: ${getPersonName(chore.assignedTo)}
                </div>
                <div class="dueDate">
                    ${dueText}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/* -------------------------
   MAIN REFRESH
--------------------------*/

function refreshTasks() {

    const overdue = [];
    const dueSoon = [];
    const upcoming = [];

    chores.forEach(chore => {

        // ensure field always exists
        if (chore.completed === undefined) {
            chore.completed = false;
        }

        chore.daysDifference = daysUntil(chore.dueDate);

        if (chore.daysDifference < 0) {
            overdue.push(chore);
        } else if (chore.daysDifference <= 3) {
            dueSoon.push(chore);
        } else if (chore.daysDifference <= 14) {
            upcoming.push(chore);
        }
    });

    overdue.sort((a, b) => a.daysDifference - b.daysDifference);
    dueSoon.sort((a, b) => a.daysDifference - b.daysDifference);
    upcoming.sort((a, b) => a.daysDifference - b.daysDifference);

    overdueTitle.textContent = `Overdue (${overdue.length})`;
    dueSoonTitle.textContent = `Due Soon (${dueSoon.length})`;
    upcomingTitle.textContent = `Upcoming (${upcoming.length})`;

    renderTasks(overdue, overdueDiv);
    renderTasks(dueSoon, dueSoonDiv);
    renderTasks(upcoming, upcomingDiv);
}

/* -------------------------
   EVENT HANDLING
--------------------------*/

document.addEventListener("change", function (event) {

    if (event.target.type !== "checkbox") return;

    const choreId = Number(event.target.dataset.id);
    const chore = chores.find(c => c.id === choreId);

    if (!chore) return;

    setChoreCompleted(chore, event.target.checked);
});

function setChoreCompleted(chore, completed) {

    if (completed) {
        chore.lastCompleted = new Date().toISOString().split("T")[0];
        updateDueDate(chore);
        rotateAssignment(chore);
    }

    chore.completed = false;

    saveChores();
    refreshTasks();
}

/* -------------------------
   DOM REFERENCES
--------------------------*/

const overdueDiv = document.getElementById("overdueContainer");
const dueSoonDiv = document.getElementById("dueSoonContainer");
const upcomingDiv = document.getElementById("upcomingContainer");

const overdueTitle = document.getElementById("overdueTitle");
const dueSoonTitle = document.getElementById("dueSoonTitle");
const upcomingTitle = document.getElementById("upcomingTitle");

/* -------------------------
   INITIAL LOAD
--------------------------*/

refreshTasks();