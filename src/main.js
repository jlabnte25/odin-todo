// Default arrays for tasks
const toDoArray = [];
const arrayContainerForParentObject = [];

// Button references
const addToDoBtn = document.getElementById("addToDo");
const updateToDoBtn = document.getElementById("updateToDo");
const addProjectBtn = document.getElementById("addProject");
const deleteProjectBtn = document.getElementById("deleteProject");
const updateProjectBtn = document.getElementById("updateProject");
const cancelProjectBtn = document.getElementById("cancelProject");
let projectActiveObject = null;
let toDoActiveObject = null;

// Load data from localStorage
function loadFromLocalStorage() {
  const storedData = localStorage.getItem("projects");
  if (storedData) {
    const storedProjects = JSON.parse(storedData);
    console.log(storedProjects);

    // Clear existing data
    arrayContainerForParentObject.length = 0;

    // Add stored projects
    storedProjects.forEach((project) => {
      arrayContainerForParentObject.push(project);

      // Display stored project
      const projectInstance = new CreateProject();
      projectInstance.displayParentObject(project);

      // Render to-do items
      if (project.projectItems && project.projectItems.length > 0) {
        project.projectItems.forEach((toDoItem) => {
          const toDoInstance = new AssignToDoContent();
          toDoInstance.displayToDoItem(toDoItem);
        });
      }
    });
  }
}

// Save data to localStorage
function saveToLocalStorage() {
  localStorage.setItem(
    "projects",
    JSON.stringify(arrayContainerForParentObject)
  );
}

// Parent project class
class CreateProject {
  constructor() {
    this.projectName = document.getElementById("projectTitle").value;
    this.projectItems = [];
  }

  createParentObject() {
    return {
      projectName: this.projectName,
      projectItems: this.projectItems,
    };
  }

  pushParentObject() {
    const projectExists = arrayContainerForParentObject.some(
      (project) => project.projectName === this.projectName
    );

    if (!projectExists) {
      const newProject = this.createParentObject();
      arrayContainerForParentObject.push(newProject);
      return newProject;
    } else {
      alert("Project name exists.");
      return null;
    }
  }

  displayParentObject(projectItem) {
    const projectList = document.getElementById("projectList");

    // Create project container
    const projectItemContainer = document.createElement("div");
    projectItemContainer.classList.add("projectItemContainer");

    // Create project title button
    const projectTitleBtn = document.createElement("button");
    projectTitleBtn.classList.add("projectTitle");
    projectTitleBtn.textContent = projectItem.projectName;
    projectTitleBtn.setAttribute("data-id", projectItem.projectName);
    projectTitleBtn.onclick = () =>
      showToDosForProject(projectItem.projectName);

    projectItemContainer.appendChild(projectTitleBtn);

    // Create edit button
    const projectEditBtn = document.createElement("button");
    projectEditBtn.classList.add("projectEditButton");
    projectEditBtn.textContent = "...";
    projectEditBtn.setAttribute("data-id", projectItem.projectName);
    projectEditBtn.onclick = () => {
      editProject(projectItem.projectName);
      openProjectDialogUponEdit();
    };
    projectEditBtn.id = `projectEditBtn`;
    projectItemContainer.appendChild(projectEditBtn);

    projectList.appendChild(projectItemContainer);
  }
}

// Child to-do item class
class AssignToDoContent {
  constructor() {
    this.toDoTitle = document.getElementById("toDoTitle").value;
    this.toDoDescription = document.getElementById("toDoDescription").value;
    this.toDoDueDate = document.getElementById("toDoDueDate").value;
    this.toDoUrgency = document.getElementById("toDoUrgency").value;
    this.toDoImportance = document.getElementById("toDoImportance").value;
  }

  static toDoIDCount = 0;

  createToDoObj() {
    return {
      id: AssignToDoContent.toDoIDCount++,
      title: this.toDoTitle,
      description: this.toDoDescription,
      dueDate: this.toDoDueDate,
      urgency: this.toDoUrgency,
      importance: this.toDoImportance,
    };
  }

  pushToDoItem() {
    const toDoItem = this.createToDoObj();
    projectActiveObject.projectItems.push(toDoItem);
    return toDoItem;
  }

  displayToDoItem(toDoItem) {
    const toDoList = document.getElementById("toDoList");

    const toDoRow = document.createElement("tr");
    toDoRow.classList.add("toDoItem");
    toDoRow.setAttribute("data-id", toDoItem.id);

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkboxCell.appendChild(checkbox);
    toDoRow.appendChild(checkboxCell);

    const urgencyCell = document.createElement("td");
    urgencyCell.classList.add("urgencyCell");

    // Add urgency/importance categories
    if (toDoItem.importance === "Important" && toDoItem.urgency === "Urgent") {
      const quadrant = document.createElement("div");
      quadrant.textContent = "DO";
      quadrant.setAttribute("class", "do");
      urgencyCell.appendChild(quadrant);
    }
    if (
      toDoItem.importance === "Important" &&
      toDoItem.urgency === "Not Urgent"
    ) {
      const quadrant = document.createElement("div");
      quadrant.textContent = "DECIDE";
      quadrant.setAttribute("class", "decide");
      urgencyCell.appendChild(quadrant);
    }
    if (
      toDoItem.importance === "Not Important" &&
      toDoItem.urgency === "Urgent"
    ) {
      const quadrant = document.createElement("div");
      quadrant.textContent = "DELEGATE";
      quadrant.setAttribute("class", "delegate");
      urgencyCell.appendChild(quadrant);
    }
    if (
      toDoItem.importance === "Not Important" &&
      toDoItem.urgency === "Not Urgent"
    ) {
      const quadrant = document.createElement("div");
      quadrant.textContent = "ELIMINATE";
      quadrant.setAttribute("class", "eliminate");
      urgencyCell.appendChild(quadrant);
    }

    const urgencyDiv = document.createElement("div");
    urgencyDiv.textContent = toDoItem.urgency;
    urgencyCell.appendChild(urgencyDiv);

    const importanceDiv = document.createElement("div");
    importanceDiv.textContent = toDoItem.importance;
    urgencyCell.appendChild(importanceDiv);
    toDoRow.appendChild(urgencyCell);

    const detailsCell = document.createElement("td");
    const titleCell = document.createElement("div");
    titleCell.classList.add("titleCell");
    titleCell.textContent = toDoItem.title;
    detailsCell.appendChild(titleCell);

    const dueDateCell = document.createElement("div");
    dueDateCell.classList.add("dueDateCell");
    dueDateCell.textContent = toDoItem.dueDate;
    detailsCell.appendChild(dueDateCell);

    const descriptionCell = document.createElement("div");
    descriptionCell.classList.add("descriptionCell");
    descriptionCell.textContent = toDoItem.description;
    detailsCell.appendChild(descriptionCell);

    toDoRow.appendChild(detailsCell);

    const actionsCell = document.createElement("td");

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.id = "deleteToDo";
    deleteButton.setAttribute("data-id", toDoItem.id);
    deleteButton.onclick = () => deleteToDoItem(toDoItem.id, toDoRow);
    actionsCell.appendChild(deleteButton);

    // Add delete icon
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "./assets/delete.png";
    deleteIcon.setAttribute("class", "icon");
    deleteButton.appendChild(deleteIcon);

    // Add edit button
    const editButton = document.createElement("button");
    editButton.id = "editToDo";
    editButton.setAttribute("data-id", toDoItem.id);
    editButton.onclick = () => {
      editToDoItem(toDoItem.id);
      openToDoDialogUponEdit();
    };

    // Add edit icon
    const editIcon = document.createElement("img");
    editIcon.src = "./assets/edit.png";
    editIcon.setAttribute("class", "icon");
    editButton.appendChild(editIcon);

    actionsCell.appendChild(editButton);

    toDoRow.appendChild(actionsCell);

    toDoList.appendChild(toDoRow);
  }
}

// Display to-dos for selected project
function showToDosForProject(projectName) {
  projectActiveObject = arrayContainerForParentObject.find(
    (project) => project.projectName === projectName
  );
  const titleContainer = document.getElementById("titleContainer");
  titleContainer.textContent = projectActiveObject.projectName;

  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";

  projectActiveObject.projectItems.forEach((toDoItem) => {
    const toDoInstance = new AssignToDoContent();
    toDoInstance.displayToDoItem(toDoItem);
  });

  toDoList.classList.add("active");
}

// Delete to-do item
function deleteToDoItem(toDoItemId, toDoRow) {
  const index = projectActiveObject.projectItems.findIndex(
    (toDo) => toDo.id === toDoItemId
  );
  if (index !== -1) {
    projectActiveObject.projectItems.splice(index, 1);
    toDoRow.remove();
    saveToLocalStorage();
  }
}

// Edit to-do item
function editToDoItem(toDoItemId) {
  const toDoItem = projectActiveObject.projectItems.find(
    (item) => item.id === toDoItemId
  );

  toDoActiveObject = toDoItem;

  const titleInput = document.getElementById("toDoTitle");
  const descriptionInput = document.getElementById("toDoDescription");
  const dueDateInput = document.getElementById("toDoDueDate");
  const urgencyInput = document.getElementById("toDoUrgency");
  const importanceInput = document.getElementById("toDoImportance");

  titleInput.value = toDoItem.title;
  descriptionInput.value = toDoItem.description;
  dueDateInput.value = toDoItem.dueDate;
  urgencyInput.value = toDoItem.urgency;
  importanceInput.value = toDoItem.importance;
}

// Update to-do item
function updateToDoItem() {
  toDoActiveObject.title = document.getElementById("toDoTitle").value;
  toDoActiveObject.description =
    document.getElementById("toDoDescription").value;
  toDoActiveObject.dueDate = document.getElementById("toDoDueDate").value;
  toDoActiveObject.urgency = document.getElementById("toDoUrgency").value;
  toDoActiveObject.importance = document.getElementById("toDoImportance").value;
  saveToLocalStorage();
  resetToDoForm();
  updateToDoListDisplay();
}

// Reset to-do form
function resetToDoForm() {
  document.getElementById("toDoTitle").value = "";
  document.getElementById("toDoDescription").value = "";
  document.getElementById("toDoDueDate").value = "";
  document.getElementById("toDoUrgency").value = "";
  document.getElementById("toDoImportance").value = "";
}

// Update to-do list display
function updateToDoListDisplay() {
  const toDoList = document.getElementById("toDoList");
  toDoList.innerHTML = "";
  projectActiveObject.projectItems.forEach((toDoItem) => {
    const toDoInstance = new AssignToDoContent();
    toDoInstance.displayToDoItem(toDoItem);
  });
}

// Event listener for addToDoBtn
addToDoBtn.addEventListener("click", () => {
  const toDoInstance = new AssignToDoContent();
  toDoInstance.pushToDoItem();
  saveToLocalStorage();
  resetToDoForm();
  updateToDoListDisplay();
});

// Event listener for addProjectBtn
addProjectBtn.addEventListener("click", () => {
  const projectInstance = new CreateProject();
  projectInstance.pushParentObject();
  saveToLocalStorage();
  resetProjectForm();
  displayProjects();
});

// Event listener for updateProjectBtn
updateProjectBtn.addEventListener("click", () => {
  const projectInstance = new CreateProject();
  projectInstance.pushParentObject();
  saveToLocalStorage();
  resetProjectForm();
  displayProjects();
});

// Event listener for deleteProjectBtn
deleteProjectBtn.addEventListener("click", () => {
  deleteProject(projectActiveObject);
  saveToLocalStorage();
  resetProjectForm();
  displayProjects();
});

// Event listener for cancelProjectBtn
cancelProjectBtn.addEventListener("click", () => {
  resetProjectForm();
});

// Delete project
function deleteProject(projectToDelete) {
  const index = arrayContainerForParentObject.findIndex(
    (project) => project === projectToDelete
  );
  if (index !== -1) {
    arrayContainerForParentObject.splice(index, 1);
    saveToLocalStorage();
    displayProjects();
  }
}

// Reset project form
function resetProjectForm() {
  document.getElementById("projectTitle").value = "";
}

// Display all projects
function displayProjects() {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";
  arrayContainerForParentObject.forEach((project) => {
    const projectInstance = new CreateProject();
    projectInstance.displayParentObject(project);
  });
}

// Initialize data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});
