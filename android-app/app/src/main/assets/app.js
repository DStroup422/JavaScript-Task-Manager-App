const STORAGE_KEY = "daily-planner-tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");
const filterContainer = document.getElementById("filters");

let tasks = loadTasks();
let currentFilter = "all";

renderTasks();

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");

  if (!button) {
    return;
  }

  currentFilter = button.dataset.filter;
  updateActiveFilter();
  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-action='delete']");

  if (!deleteButton) {
    return;
  }

  deleteTask(deleteButton.dataset.id);
});

taskList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-action='toggle']");

  if (!checkbox) {
    return;
  }

  toggleTask(checkbox.dataset.id);
});

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    text: taskText,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = filteredTasks
    .map(
      (task) => `
        <li class="task-item ${task.completed ? "task-item--completed" : ""}">
          <input
            class="task-checkbox"
            type="checkbox"
            data-action="toggle"
            data-id="${task.id}"
            ${task.completed ? "checked" : ""}
            aria-label="Mark ${escapeHtml(task.text)} as complete"
          >
          <span class="task-text">${escapeHtml(task.text)}</span>
          <div class="task-actions">
            <button class="task-action task-action--delete" type="button" data-action="delete" data-id="${task.id}">
              Delete
            </button>
          </div>
        </li>
      `
    )
    .join("");

  emptyState.hidden = filteredTasks.length > 0;
  updateTaskCount();
}

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function updateTaskCount() {
  const activeTaskCount = tasks.filter((task) => !task.completed).length;
  const label = activeTaskCount === 1 ? "task" : "tasks";
  taskCount.textContent = `${activeTaskCount} ${label} left`;
}

function updateActiveFilter() {
  const buttons = filterContainer.querySelectorAll(".filter-button");

  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === currentFilter);
  });
}

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    console.error("Failed to parse saved tasks:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
