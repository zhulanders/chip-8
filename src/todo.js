export function createTodo({ title, description, dueDate, priority, notes = "", checklist = [] }) {
    return {
      title,
      description,
      dueDate,
      priority,
      notes,
      checklist,
      completed: false,
  
      toggleComplete() {
        this.completed = !this.completed;
      },
  
      addChecklistItem(item) {
        this.checklist.push({ task: item, done: false });
      },
  
      toggleChecklistItem(index) {
        if (this.checklist[index]) {
          this.checklist[index].done = !this.checklist[index].done;
        }
      }
    };
}