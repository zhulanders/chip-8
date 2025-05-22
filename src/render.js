import {isLater} from './index.js'
import { saveProjectsToLocalStorage } from './save.js';
export function renderTodos(project, projects) {
    const listContainer = document.querySelector(".list");
    listContainer.innerHTML = "";
  
    project.getTodos().forEach((todo, index) => {
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");
  
      todoItem.innerHTML = `
        <h3>${todo.title}</h3>
        <p>${todo.description}</p>
        <p>Due: ${todo.dueDate}</p>
        <p>Priority: ${todo.priority}</p>
        <p>Status: <span class="emoji">${todo.completed ? "✅" : "❌"}</span> ${todo.completed ? "Completed" : "Not Completed"}</p>
        <button data-index="${index}" class="toggle-complete">Toggle Complete</button>
        <button class="delete-todo" data-index="${index}">Delete</button>
    `;

  
      listContainer.appendChild(todoItem);
    });
  
    document.querySelectorAll(".toggle-complete").forEach(button => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        project.todos[index].toggleComplete();
        saveProjectsToLocalStorage(projects);
        renderTodos(project, projects);
      });
    });
    document.querySelectorAll(".delete-todo").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      project.removeTodo(index);
      saveProjectsToLocalStorage(projects);
      renderTodos(project, projects); 
    });
  });
  }
export function renderTodosList(filteredTodos, project, projects) {
    const listContainer = document.querySelector(".list");
    if (!listContainer) return;
  
    listContainer.innerHTML = "";
  
    filteredTodos.forEach((todo) => {
      const indexInProject = project.getTodos().indexOf(todo); 
  
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");
  
      todoItem.innerHTML = `
        <h3>${todo.title}</h3>
        <p>${todo.description}</p>
        <p>Due: ${todo.dueDate}</p>
        <p>Priority: ${todo.priority}</p>
        <p>Status: <span class="emoji">${todo.completed ? "✅" : "❌"}</span> ${todo.completed ? "Completed" : "Not Completed"}</p>
        <button data-index="${indexInProject}" class="toggle-complete">Toggle Complete</button>
        <button data-index="${indexInProject}" class="delete-todo">Delete</button>
      `;
  
      listContainer.appendChild(todoItem);
    });
  
    document.querySelectorAll(".toggle-complete").forEach(button => {
      button.addEventListener("click", e => {
        const index = e.target.getAttribute("data-index");
        project.todos[index].toggleComplete();
        const updatedFiltered = project.getTodos().filter(todo => isLater(todo.dueDate)); 
        saveProjectsToLocalStorage(projects);
        renderTodosList(updatedFiltered, project, projects); 
      });
    });
  
    document.querySelectorAll(".delete-todo").forEach(button => {
      button.addEventListener("click", e => {
        const index = e.target.getAttribute("data-index");
        project.removeTodo(index);
        const updatedFiltered = project.getTodos().filter(todo => isLater(todo.dueDate)); 
        saveProjectsToLocalStorage(projects);
        renderTodosList(updatedFiltered, project, projects); 
      });
    });
  }
  
  