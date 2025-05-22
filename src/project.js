
export function createProject(name = "Default Project") {
    return {
      name,
      todos: [],
  
      addTodo(todo) {
        this.todos.push(todo);
      },
  
      removeTodo(index) {
        this.todos.splice(index, 1);
      },
  
      getTodos() {
        return this.todos;
      },
  
      findTodoByTitle(title) {
        return this.todos.find(todo => todo.title === title);
      }
    };
}