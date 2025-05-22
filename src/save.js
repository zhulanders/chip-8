export function saveProjectsToLocalStorage(projects) {
    const raw = projects.map(p => ({
      name: p.name,
      todos: p.getTodos().map(t => ({
        title: t.title,
        description: t.description,
        dueDate: t.dueDate,
        priority: t.priority,
        completed: t.completed
      }))
    }));
    localStorage.setItem("projects", JSON.stringify(raw));
  }