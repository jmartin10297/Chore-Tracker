const taskListContainer = document.getElementById("taskListContainer");

let chores = [];

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


    document.querySelectorAll(".taskNameRow")
        .forEach(task => {

            task.addEventListener("click", function() {

                const id = this.dataset.id;

                const details = document.getElementById(`details-${id}`);

                details.classList.toggle("hidden");

                const arrow = this.querySelector(".taskArrow");

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