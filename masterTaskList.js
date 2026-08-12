const taskListContainer = document.getElementById("taskListContainer");

const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskNameInput");
const assignedToInput = document.getElementById("assignedToInput");
const activeInput = document.getElementById("activeInput");
const intervalInput = document.getElementById("intervalInput");
const rotationGroupInput = document.getElementById("rotationGroupInput");
const dueDateInput = document.getElementById("dueDateInput");
const saveEditButton = document.getElementById("saveEditButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const addTaskButton = document.getElementById("addTaskButton");

saveEditButton.addEventListener("click", async function() {

    // ==========================================
    // ADD NEW CHORE
    // ==========================================

    if (addingChore) {

        const newChore = {

            name: taskNameInput.value,
            assignedTo: assignedToInput.value
                ? Number(assignedToInput.value)
                : null,

            active: activeInput.checked,

            intervalDays: intervalInput.value
                ? Number(intervalInput.value)
                : null,

            dueDate: dueDateInput.value || null,

            rotationGroup: rotationGroupInput.value || null,

            completed: false,

            lastCompleted: null

        };

        console.log("Adding new chore:", newChore);

        const success = await addChoreToSupabase(newChore);

        if (success) {

            taskForm.classList.add("hidden");

            addingChore = false;

            initializeMasterTaskList();

        }

        return;
    }


    // ==========================================
    // EDIT EXISTING CHORE
    // ==========================================

    const chore = chores.find(
        chore => chore.id == editingChoreId
    );

    if (!chore) {

        console.error("Could not find chore being edited.");

        return;

    }

    chore.name = taskNameInput.value;

    chore.assignedTo = assignedToInput.value
        ? Number(assignedToInput.value)
        : null;

    chore.active = activeInput.checked;

    chore.intervalDays = intervalInput.value
        ? Number(intervalInput.value)
        : null;

    chore.dueDate = dueDateInput.value || null;

    chore.rotationGroup = rotationGroupInput.value || null;

    console.log("Saving chore:", chore);

    const success = await updateChoreInSupabase(chore);

    if (success) {

        taskForm.classList.add("hidden");

        editingChoreId = null;

        initializeMasterTaskList();

    }

});

addTaskButton.addEventListener("click", function() {

    addingChore = true;
    editingChoreId = null;

    // Clear task name
    taskNameInput.value = "";

    // Clear interval
    intervalInput.value = "";

    // Clear due date
    dueDateInput.value = "";

    // Default active status
    activeInput.checked = false;

    // Populate Assigned To
    assignedToInput.innerHTML = `
    <option value="">Select a person</option>
`;

    people
        .filter(person => person.active)
        .forEach(person => {

            const option = document.createElement("option");

            option.value = person.id;
            option.textContent = person.name;

        assignedToInput.appendChild(option);

        });

assignedToInput.value = "";

    // Select first active person by default
    if (assignedToInput.options.length > 0) {
        assignedToInput.selectedIndex = 0;
    }

    // Populate Rotation Groups
    rotationGroupInput.innerHTML = `
        <option value="">Select a rotation group</option>
    `;

    Object.keys(rotationGroups)
        .forEach(groupName => {

            const option = document.createElement("option");

            option.value = groupName;
            option.textContent = groupName;

            rotationGroupInput.appendChild(option);

        });

rotationGroupInput.value = "";

    // Select first rotation group by default
    if (rotationGroupInput.options.length > 0) {
        rotationGroupInput.selectedIndex = 0;
    }

    // Show form
    taskForm.classList.remove("hidden");

});

cancelEditButton.addEventListener("click", function() {

    console.log("CANCEL CLICKED");

    taskForm.classList.add("hidden");

    editingChoreId = null;

});

let chores = [];

let editingChoreId = null;
let addingChore = false;

async function initializeMasterTaskList() {

    chores = await getAllChores();

    let html = "";

    chores.forEach(chore => {

        html += `
        <div class="taskCard">

            <div class="taskNameRow" data-id="${chore.id}">
                <span class="taskArrow">▶</span>
                ${chore.name} ${chore.active ? "" : "(Inactive)"}
            </div>

            <div class="taskDetails hidden" id="details-${chore.id}">

                <div>Status: ${chore.active ? "Active" : "Inactive"}</div>

                <div>Recurs Every ${chore.intervalDays} Days</div>

                <div>Next Due: ${chore.dueDate}</div>

                <div>Assigned To: ${getPersonName(chore.assignedTo)}</div>

                <div>Rotation Group: ${chore.rotationGroup}</div>

                <div>Last Completed: ${chore.lastCompleted || "Never"}</div>

                <div class="taskActions">

                    <button class="editButton" data-id="${chore.id}">
                        Edit
                    </button>

                    <button class="removeButton" data-id="${chore.id}">
                        Remove
                    </button>

                </div>

            </div>

        </div>
        `;

    });

    taskListContainer.innerHTML = html;


    // ==========================================
    // EDIT BUTTONS
    // ==========================================

    document.querySelectorAll(".editButton")
        .forEach(button => {

            button.addEventListener("click", function(event) {

                event.stopPropagation();

                const choreId = this.dataset.id;

                const chore = chores.find(chore => chore.id == choreId);

                console.log("Editing chore:", chore);
                editingChoreId = chore.id;
                console.log("Currently editing:", editingChoreId);

                // Task Name

                taskNameInput.value = chore.name;


                // Interval

                intervalInput.value = chore.intervalDays;

                // Due Date

                dueDateInput.value = chore.dueDate;

                // Active Status

                activeInput.checked = chore.active;


                // Assigned To

                assignedToInput.innerHTML = "";

                people
                    .filter(person => person.active)
                    .forEach(person => {

                        const option = document.createElement("option");

                        option.value = person.id;

                        option.textContent = person.name;

                        if (person.id == chore.assignedTo) {
                            option.selected = true;
                        }

                        assignedToInput.appendChild(option);

                    });


                // Rotation Group

                rotationGroupInput.innerHTML = "";

                Object.keys(rotationGroups)
                    .forEach(groupName => {

                        const option = document.createElement("option");

                        option.value = groupName;

                        option.textContent = groupName;

                        if (groupName === chore.rotationGroup) {
                            option.selected = true;
                        }

                        rotationGroupInput.appendChild(option);

                    });


                // Show Form

                taskForm.classList.remove("hidden");

            });

        });


    // ==========================================
    // REMOVE BUTTONS
    // ==========================================

    document.querySelectorAll(".removeButton")
        .forEach(button => {

            button.addEventListener("click", async function(event) {

                event.stopPropagation();

                const choreId = this.dataset.id;

                const confirmed = confirm(
                    "Are you sure you want to permanently remove this chore?"
                );

                if (!confirmed) {
                    return;
                }

                const success = await deleteChoreFromSupabase(choreId);

                if (success) {
                    initializeMasterTaskList();
                }

            });

        });


    // ==========================================
    // TASK NAME / ARROW
    // ==========================================

    document.querySelectorAll(".taskNameRow")
        .forEach(task => {

            task.addEventListener("click", function() {

                const id = this.dataset.id;

                const details =
                    document.getElementById(`details-${id}`);

                details.classList.toggle("hidden");


                const arrow =
                    this.querySelector(".taskArrow");


                if (details.classList.contains("hidden")) {

                    arrow.textContent = "▶";

                }
                else {

                    arrow.textContent = "▼";

                }

            });

        });

}

initializeMasterTaskList();