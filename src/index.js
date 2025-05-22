import { createProject } from "./project";
import { createTodo } from "./todo";
import { renderTodos, renderTodosList } from "./render";
import { saveProjectsToLocalStorage } from "./save";
import "./styles.css";

const projects = [];
let currentProject = null;

function init() {
  const storedData = localStorage.getItem("projects");

  if (storedData) {
    const parsed = JSON.parse(storedData);
    parsed.forEach((p) => {
      const loadedProject = createProject(p.name);
      p.todos.forEach((t) => {
        const todo = createTodo(t);
        if (t.completed) todo.completed = true;
        loadedProject.addTodo(todo);
      });
      projects.push(loadedProject);
    });
    currentProject = projects[0];
  } else {
    const defaultProject = createProject("Project 1");
    projects.push(defaultProject);
    currentProject = defaultProject;
  }

  renderTodos(currentProject, projects);
  renderProjectList();
}

const addProjectButton = document.querySelector(".addProject");

addProjectButton.addEventListener("click", () => {
  const name = prompt("Enter project name:");
  if (!name) return;

  const newProject = createProject(name);
  projects.push(newProject);
  currentProject = newProject;
  saveProjectsToLocalStorage(projects);
  renderTodos(currentProject, projects);
  renderProjectList();
});

function renderProjectList() {
  const projectListContainer = document.querySelector(".projList");
  projectListContainer.innerHTML = "";

  projects.forEach((project, index) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-item");

    const btn = document.createElement("button");
    btn.textContent = project.name;
    btn.classList.add("project-button");

    if (project === currentProject) {
      btn.classList.add("active-project");
    }

    btn.addEventListener("click", () => {
      currentProject = project;
      renderTodos(currentProject, projects);
      renderProjectList();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-project");

    deleteButton.addEventListener("click", () => {
      if (projects.length > 1) {
        projects.splice(index, 1);
        if (currentProject === project) {
          currentProject = projects[0];
        }
        saveProjectsToLocalStorage(projects);
        renderTodos(currentProject, projects);
        renderProjectList();
      } else {
        alert("You must have at least one project.");
      }
    });

    projectDiv.appendChild(btn);
    projectDiv.appendChild(deleteButton);

    projectListContainer.appendChild(projectDiv);
  });
}

const addTodoButton = document.querySelector(".addTodo");
const modal = document.querySelector(".todo-modal");
const form = document.getElementById("todoForm");
const cancelBtn = document.getElementById("cancelForm");

addTodoButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  form.reset();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = form.title.value;
  const description = form.description.value;
  const dueDate = form.dueDate.value;
  const priority = form.priority.value;

  const newTodo = createTodo({ title, description, dueDate, priority });
  currentProject.addTodo(newTodo);

  form.reset();
  modal.classList.add("hidden");
  saveProjectsToLocalStorage(projects);
  renderTodos(currentProject, projects);
});
const todayBtn = document.querySelector(".today");
const weekBtn = document.querySelector(".week");
const laterBtn = document.querySelector(".later");

function isToday(dateStr) {
  const date = new Date(`${dateStr  }T00:00:00`);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isThisWeek(dateStr) {
  const date = new Date(`${dateStr  }T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  return date >= today && date <= endOfWeek;
}
export function isLater(dateStr) {
  const date = new Date(`${dateStr  }T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
}
todayBtn.addEventListener("click", () => {
  const filtered = currentProject
    .getTodos()
    .filter((todo) => isToday(todo.dueDate));
  renderTodosList(filtered, currentProject, projects);
});

weekBtn.addEventListener("click", () => {
  const filtered = currentProject
    .getTodos()
    .filter((todo) => isThisWeek(todo.dueDate));
  renderTodosList(filtered, currentProject, projects);
});

laterBtn.addEventListener("click", () => {
  const filtered = currentProject
    .getTodos()
    .filter((todo) => isLater(todo.dueDate));
  renderTodosList(filtered, currentProject, projects);
});
init();
