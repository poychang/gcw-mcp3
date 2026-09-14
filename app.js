// 待辦清單應用程式：使用原生 JavaScript 操作 DOM 與 localStorage

const STORAGE_KEY = "todo-list-items";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyHint = document.getElementById("empty-hint");
const remainingCount = document.getElementById("remaining-count");

// 從 localStorage 讀取資料,若不存在則回傳空陣列
function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// 將目前的待辦資料寫回 localStorage
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();

// 依據目前資料重新繪製整個清單
function render() {
  list.innerHTML = "";

  emptyHint.style.display = todos.length === 0 ? "block" : "none";

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "刪除";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteBtn);
    list.appendChild(item);
  });

  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${remaining} 項`;
}

// 新增一筆待辦事項
function addTodo(text) {
  todos.push({
    id: Date.now().toString(),
    text,
    completed: false,
  });
  saveTodos(todos);
  render();
}

// 切換某筆待辦事項的完成狀態
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(todos);
  render();
}

// 刪除某筆待辦事項
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos(todos);
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  // 內容為空白時不新增
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

render();
