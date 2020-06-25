'use strict';

let counter = 0;

function createId() {
  return counter++;
}

class TodoState {
  state = [];

  findById(id) {
    return this.state.find((todo) => todo.id === id);
  }

  addTodo(todo) {
    this.state.push(todo);
    return todo;
  }

  toggleCheckById(id) {
    const todo = this.findById(id);
    todo.checked = !todo.checked;
    return todo;
  }

  removeTodoById(id) {
    const index = this.state.findIndex((item) => item.id === id);
    const [todo] = this.state.splice(index, 1);
    return todo;
  }
}

class TodoItem {
  constructor(label, onCheckClick, onCrossClick) {
    this.id = createId();
    this.label = label;
    this.checked = false;
    this.onCheckClick = onCheckClick;
    this.onCrossClick = onCrossClick;
  }
}

class TodoView {
  constructor() {
    this.root = document.querySelector('.todo-app .todo-app__body');
  }

  createCheck(listener) {
    const check = document.createElement('div');
    check.classList.add('todo__check');
    check.addEventListener('click', listener);
    return check;
  }

  createText(label) {
    const text = document.createElement('span');
    text.classList.add('todo__text');
    text.appendChild(document.createTextNode(label));
    return text;
  }

  createCross(listener) {
    const cross = document.createElement('div');
    cross.classList.add('todo__cross');
    cross.appendChild(document.createTextNode('X'));
    cross.addEventListener('click', listener);
    return cross;
  }

  addTodo(todo) {
    const item = document.createElement('div');
    item.dataset.id = todo.id;
    item.classList.add('todo');
    item.appendChild(this.createCheck(todo.onCheckClick));
    item.appendChild(this.createText(todo.label));
    item.appendChild(this.createCross(todo.onCrossClick));
    this.root.prepend(item);
  }

  updateTodo(todo) {
    if (todo.checked) {
      document.querySelector(`[data-id="${todo.id}"] .todo__check`).classList.add('checked');
    } else {
      document.querySelector(`[data-id="${todo.id}"] .todo__check`).classList.remove('checked');
    }
  }

  removeTodo(todo) {
    const item = document.querySelector(`[data-id="${todo.id}"]`);
    this.root.removeChild(item);
  }
}

class TodoController {
  constructor() {
    this.state = new TodoState();
    this.view = new TodoView();
  }

  addTodo(e) {
    const todo = new TodoItem(
      e.target.value,
      this.checkTodo.bind(this),
      this.removeTodo.bind(this),
    );
    const item = this.state.addTodo(todo);
    this.view.addTodo(item);
    e.target.value = '';
    console.log('STATE: ', this.state);
  }

  checkTodo(e) {
    const id = +e.target.parentNode.dataset.id;
    const todo = this.state.toggleCheckById(id);
    this.view.updateTodo(todo);
    console.log('STATE: ', this.state);
  }

  removeTodo(e) {
    const id = +e.target.parentNode.dataset.id;
    const todo = this.state.removeTodoById(id);
    this.view.removeTodo(todo);
    console.log('STATE: ', this.state);
  }
}

const controller = new TodoController();

document.querySelector('.input').addEventListener('keypress', (e) => {
  if (e.keyCode === 13 && e.target.value) {
    controller.addTodo(e);
  }
});
