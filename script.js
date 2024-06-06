const inputField = document.getElementById("inputField");
const addButton = document.getElementById("addButton");
const listItem = document.getElementById("list");
const allButton = document.getElementById("allButton");
const activeButton = document.getElementById("activeButton");
const completeButton = document.getElementById("completeButton");
const clearButton = document.getElementById("clearButton");
const numberDisplay = document.getElementById("number");

const tasks = [];

addButton.addEventListener("click", addTodo);
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});
allButton.addEventListener("click", showAllTasks);
activeButton.addEventListener("click", showActiveTasks);
completeButton.addEventListener("click", showCompletedTasks);
clearButton.addEventListener("click", clearCompletedTasks);

function addTodo() {
  const task = {
    text: inputField.value,
    completed: false,
  };

  if (inputField.value === "") return;

  tasks.push(task);
  inputField.value = "";
  updateTasks();
}

function todoElement(task, index) {
  const itemall = document.createElement("div");
  itemall.classList.add("itemall");

  const item = document.createElement("p");
  item.classList.add("item");
  item.innerText = task.text;
  if (task.completed) {
    item.classList.add("completed");
  }
  itemall.appendChild(item);

  listItem.appendChild(itemall);

  const checkbutton = document.createElement("button");
  checkbutton.classList.add("fas", "fa-check");
  itemall.appendChild(checkbutton);

  const trashbutton = document.createElement("button");
  trashbutton.classList.add("fas", "fa-trash");
  itemall.appendChild(trashbutton);
  listItem.appendChild(itemall);

  checkbutton.addEventListener("click", () => TaskCompletion(index));
  trashbutton.addEventListener("click", () => deleteTask(index));
  item.addEventListener("dblclick", () => editTask(index, item));
}

function updateDisplay() {
  listItem.innerHTML = "";

  tasks.forEach((task, index) => {
    todoElement(task, index);
  });

  updateTaskCount();
}

function updateTasks() {
  listItem.innerHTML = "";

  tasks.forEach((task, index) => {
      todoElement(task, index);
  });

  updateDisplay();
}

function TaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTasks();
}

function editTask(index, itemElement) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;
  input.classList.add("edit-input");

  input.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          tasks[index].text = input.value;
          updateTasks();
      }
  });

  input.addEventListener("blur", function() {
      tasks[index].text = input.value;
      updateTasks();
  });

  itemElement.innerHTML = '';
  itemElement.appendChild(input);
  input.focus();
}


function deleteTask(index) {
  tasks.splice(index, 1);
  updateTasks()
  updateDisplay();
}

function showAllTasks() {
  allButton.style.background = "green";
  completeButton.style.background = "black";
  activeButton.style.background = "black";
  updateTasks()
  updateDisplay();
}

function showActiveTasks() {
  activeButton.style.background = "green";
  allButton.style.background = "black";
  completeButton.style.background = "black";
  listItem.innerHTML = "";

  tasks.forEach((task, index) => {
    if (!task.completed) {
      todoElement(task, index);
    }
  });

  updateTaskCount();
}

function showCompletedTasks() {
  allButton.style.background = "black";
  completeButton.style.background = "green";
  activeButton.style.background = "black";
  listItem.innerHTML = "";

  tasks.forEach((task, index) => {
    if (task.completed) {
      todoElement(task, index);
    }
  });

  updateTaskCount();
}

function clearCompletedTasks() {
  clearButton.style.background = "gray";

  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].completed) {
      tasks.splice(i, 1);
    }
  }
  updateTasks()
  updateDisplay();
}

function updateTaskCount() {
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  numberDisplay.innerText = `Total: ${totalTasks}, Active: ${activeTasks}, Completed: ${completedTasks}`;
}

// Initial display update
updateDisplay();
