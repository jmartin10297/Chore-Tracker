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
                ${chore.name}
            </div>

            <div class="taskDetails hidden" id="details-${chore.id}">
                <div>Recurs Every ${chore.intervalDays} Days</div>
                <div>Next Due: ${chore.dueDate}</div>
                <div>Assigned To: ${getPersonName(chore.assignedTo)}</div>
                <div>Rotation Group: ${chore.rotationGroup}</div>
                <div>Last Completed: ${chore.lastCompleted || "Never"}</div>
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