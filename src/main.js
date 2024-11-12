// Default array for projects and tasks
const toDoArray = [];
const arrayContainerForParentObject = [];

// Button selections for adding, updating, and canceling to-dos and projects
const addToDoBtn = document.getElementById('addToDo');
const updateToDoBtn = document.getElementById('updateToDo');
const addProjectBtn = document.getElementById('addProject');
const deleteProjectBtn = document.getElementById('deleteProject');
const updateProjectBtn = document.getElementById('updateProject');
const cancelProjectBtn = document.getElementById('cancelProject');
let projectActiveObject = null;
let toDoActiveObject = null;

// Access local storage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('projects');
    if (storedData) {
        const storedProjects = JSON.parse(storedData);
        console.log (storedProjects);

        // Clear array before adding new data to prevent duplicates
        arrayContainerForParentObject.length = 0;

        // Push each stored project into arrayContainerForParentObject
        storedProjects.forEach(project => {
            arrayContainerForParentObject.push(project);
            
            // Display each project on the page
            const projectInstance = new CreateProject();
            projectInstance.displayParentObject(project);

            // Will be used to re-render default project when it reloads
            // If the project has items, render each to-do item
            if (project.projectItems && project.projectItems.length > 0) {
                project.projectItems.forEach(toDoItem => {
                    const toDoInstance = new AssignToDoContent();
                    toDoInstance.displayToDoItem(toDoItem);
                });
            }
        });
    }
}



// Save to local storage
function saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(arrayContainerForParentObject));
}

// Parent (CreateProject) class
class CreateProject {
    constructor() {
        this.projectName = document.getElementById('projectTitle').value;
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
            project => project.projectName === this.projectName
        );

        if (!projectExists) {
            const newProject = this.createParentObject();
            arrayContainerForParentObject.push(newProject);
            return newProject;
        } else {
            alert("Project name already exists. Choose a different name.");
            return null;
        }
    }

    displayParentObject(projectItem) {
        const projectList = document.getElementById('projectList');

        // Create the project item container
        const projectItemContainer = document.createElement('div');
        projectItemContainer.classList.add("projectItemContainer");

        // Create the project title button
        const projectTitleBtn = document.createElement('button');
        projectTitleBtn.classList.add("projectTitle");
        projectTitleBtn.textContent = projectItem.projectName;
        projectTitleBtn.setAttribute('data-id', projectItem.projectName);
        projectTitleBtn.onclick = () => showToDosForProject(projectItem.projectName);

        projectItemContainer.appendChild(projectTitleBtn);

        // Create the edit button
        const projectEditBtn = document.createElement('button');
        projectEditBtn.classList.add("projectEditButton");
        projectEditBtn.textContent = '...';
        projectEditBtn.setAttribute('data-id', projectItem.projectName);
        projectEditBtn.onclick = () => {editProject(projectItem.projectName);
            openProjectDialogUponEdit();
        };
        projectEditBtn.id = `projectEditBtn`;
        projectItemContainer.appendChild(projectEditBtn);

        projectList.appendChild(projectItemContainer);
    }
}

// Child (AssignToDoContent) class
class AssignToDoContent {
    constructor() {
        this.toDoTitle = document.getElementById('toDoTitle').value;
        this.toDoDescription = document.getElementById('toDoDescription').value;
        this.toDoDueDate = document.getElementById('toDoDueDate').value;
        this.toDoUrgency = document.getElementById('toDoUrgency').value;
        this.toDoImportance = document.getElementById('toDoImportance').value;
    }

    static toDoIDCount = 0;

    createToDoObj() {
        return {
            id: AssignToDoContent.toDoIDCount++,
            title: this.toDoTitle,
            description: this.toDoDescription,
            dueDate: this.toDoDueDate,
            urgency: this.toDoUrgency,
            importance: this.toDoImportance
        };
    }

    pushToDoItem() {
        const toDoItem = this.createToDoObj();
        projectActiveObject.projectItems.push(toDoItem);
        return toDoItem;
    }

    displayToDoItem(toDoItem) {
        const toDoList = document.getElementById('toDoList');

        const toDoRow = document.createElement('tr');
        toDoRow.classList.add("toDoItem");
        toDoRow.setAttribute('data-id', toDoItem.id);

        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkboxCell.appendChild(checkbox);
        toDoRow.appendChild(checkboxCell);
        
        const urgencyCell = document.createElement('td');
        urgencyCell.classList.add('urgencyCell');
        const urgencyDiv = document.createElement('div');
        urgencyDiv.textContent = toDoItem.urgency;
        urgencyCell.appendChild(urgencyDiv);

        const importanceDiv = document.createElement('div');
        importanceDiv.textContent = toDoItem.importance;
        urgencyCell.appendChild(importanceDiv);
        toDoRow.appendChild(urgencyCell);

        const titleCell = document.createElement('td');
        titleCell.classList.add('titleCell');
        titleCell.textContent = toDoItem.title;
        toDoRow.appendChild(titleCell);

        const dueDateCell = document.createElement('td');
        dueDateCell.classList.add('dueDateCell');
        dueDateCell.textContent = toDoItem.dueDate;
        toDoRow.appendChild(dueDateCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.classList.add('descriptionCell');
        descriptionCell.textContent = toDoItem.description;
        toDoRow.appendChild(descriptionCell);


        const actionsCell = document.createElement('td');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.id = 'deleteToDo';
        deleteButton.setAttribute('data-id', toDoItem.id);
        deleteButton.onclick = () => deleteToDoItem(toDoItem.id, toDoRow);
        actionsCell.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.id = 'editToDo';
        editButton.setAttribute('data-id', toDoItem.id);
        editButton.onclick = () => {editToDoItem(toDoItem.id);
            openToDoDialogUponEdit();
        };
        actionsCell.appendChild(editButton);

        toDoRow.appendChild(actionsCell);

        toDoList.appendChild(toDoRow);
    }
}

// Function to show to-dos for selected project
function showToDosForProject(projectName) {
    projectActiveObject = arrayContainerForParentObject.find(project => project.projectName === projectName);
    const titleContainer = document.getElementById('titleContainer');
    titleContainer.textContent = projectActiveObject.projectName;

    const toDoList = document.getElementById('toDoList');
    toDoList.innerHTML = '';

    projectActiveObject.projectItems.forEach(toDoItem => {
        const toDoInstance = new AssignToDoContent();
        toDoInstance.displayToDoItem(toDoItem);
    });
}

// Event listeners for add, update, and delete operations
addToDoBtn.addEventListener('click', () => {
    if (validateToDoInputField()) {
        const toDoInstance = new AssignToDoContent();
        const toDoItem = toDoInstance.pushToDoItem();
        toDoInstance.displayToDoItem(toDoItem);
        emptyToDoInputField();
        console.log("Updated array:", projectActiveObject.projectItems);
        console.log("New item added:", toDoItem);
    } else {
        alert("Please fill in all the required fields.");
    }

    toDoDialog.close();
    saveToLocalStorage();
});

function validateToDoInputField() {
    return document.getElementById('toDoTitle').value !== "" &&
        document.getElementById('toDoDescription').value !== "" &&
        document.getElementById('toDoDueDate').value !== "" &&
        document.getElementById('toDoUrgency').value !== "" &&
        document.getElementById('toDoImportance').value !== "";
}

function emptyToDoInputField() {
    document.getElementById('toDoTitle').value = "";
    document.getElementById('toDoDescription').value = "";
    document.getElementById('toDoDueDate').value = "";
    document.getElementById('toDoUrgency').value = "";
    document.getElementById('toDoImportance').value = "";
}

// Delete a to-do item
function deleteToDoItem(toDoItemID, toDoRow) {
    const index = projectActiveObject.projectItems.findIndex(toDoItem => toDoItem.id === toDoItemID);
    projectActiveObject.projectItems.splice(index, 1);
    toDoRow.remove();

    toDoDialog.close();
    saveToLocalStorage();
}

// Edit a to-do item
function editToDoItem(toDoItemID) {
    toDoActiveObject = projectActiveObject.projectItems.find(toDoItem => toDoItem.id === toDoItemID);
    document.getElementById('toDoTitle').value = toDoActiveObject.title;
    document.getElementById('toDoDescription').value = toDoActiveObject.description;
    document.getElementById('toDoDueDate').value = toDoActiveObject.dueDate;
    document.getElementById('toDoUrgency').value = toDoActiveObject.urgency;
    document.getElementById('toDoImportance').value = toDoActiveObject.importance;
}

updateToDoBtn.addEventListener('click', () => {
    if (validateToDoInputField()) {
        if (toDoActiveObject) {
            toDoActiveObject.title = document.getElementById('toDoTitle').value;
            toDoActiveObject.description = document.getElementById('toDoDescription').value;
            toDoActiveObject.dueDate = document.getElementById('toDoDueDate').value;
            toDoActiveObject.urgency = document.getElementById('toDoUrgency').value;
            toDoActiveObject.importance = document.getElementById('toDoImportance').value;
            const updatedRow = document.querySelector(`tr[data-id='${toDoActiveObject.id}']`);
            updatedRow.querySelector('.titleCell').textContent = toDoActiveObject.title;
            updatedRow.querySelector('.dueDateCell').textContent = toDoActiveObject.dueDate;
            updatedRow.querySelector('.descriptionCell').textContent = toDoActiveObject.description;
            updatedRow.querySelector('.urgencyCell div:nth-child(1)').textContent = toDoActiveObject.urgency;
            updatedRow.querySelector('.urgencyCell div:nth-child(2)').textContent = toDoActiveObject.importance;

            emptyToDoInputField();
        }
    } else {
        alert("Please fill in all the required fields.");
    }

    toDoDialog.close();
    saveToLocalStorage()
});

addProjectBtn.addEventListener('click', () => {
    const newProject = new CreateProject();
    const addedProject = newProject.pushParentObject();
    if (addedProject) {
        newProject.displayParentObject(addedProject);
    }
    projectDialog.close();
    saveToLocalStorage()
});

function editProject(projectID) {
    projectActiveObject = arrayContainerForParentObject.find(project => project.projectName === projectID);
    document.getElementById('projectTitle').value = projectActiveObject.projectName;
}

updateProjectBtn.addEventListener('click', () => {
    if (projectActiveObject) {
        const newTitle = document.getElementById('projectTitle').value;
        document.querySelector(`button[data-id='${projectActiveObject.projectName}']`).textContent = newTitle;

         //change id of the title button
         const titleButton = document.querySelector(`button.projectTitle[data-id='${projectActiveObject.projectName}']`);
         if (titleButton) {
             titleButton.setAttribute('data-id', newTitle);
         } else {
             console.error("Title button not found.");
         }


         //change id of attached edit button
         const editButton = document.querySelector(`button.projectEditButton[data-id='${projectActiveObject.projectName}']`);
         if (editButton) {
             editButton.setAttribute('data-id', newTitle);
         } else {
             console.error("Edit button not found.");
         }

        // change value of the projectName object
        projectActiveObject.projectName = newTitle;

        //empty input field for title
        document.getElementById('projectTitle').value = null;
    }

    projectDialog.close();
    saveToLocalStorage()
});

deleteProjectBtn.addEventListener('click', () => {
    if (projectActiveObject) {
        const index = arrayContainerForParentObject.indexOf(projectActiveObject);
        arrayContainerForParentObject.splice(index, 1);
        document.querySelector(`#projectList button[data-id='${projectActiveObject.projectName}']`).parentElement.remove();
        projectActiveObject = null;
    }

    const toDoList = document.getElementById('toDoList');
    toDoList.innerHTML = '';

    projectDialog.close();
    saveToLocalStorage()
});

// UI UX 
const toDoDialog = document.getElementById('toDoDialog');
const projectDialog = document.getElementById('projectDialog');
const openToDoDialog = document.getElementById('openToDoDialog');
const openProjectDialog = document.getElementById('openProjectDialog');
const projectEditBtn = document.getElementById('projectEditBtn');
const cancelToDoBtn = document.getElementById('cancelToDo');


openProjectDialog.addEventListener('click', () => {
    projectDialog.showModal();
    document.getElementById('titleContainer').textContent = ""; // reset text input
    addProjectBtn.style.display = 'block';
    deleteProjectBtn.style.display = 'none';
    updateProjectBtn.style.display = 'none';
});

cancelProjectBtn.addEventListener('click', () => {
    document.getElementById('titleContainer').textContent = "";
    projectDialog.close();
});

function openProjectDialogUponEdit () {
    projectDialog.showModal(); 
    deleteProjectBtn.style.display = 'block';
    updateProjectBtn.style.display = 'block';
    addProjectBtn.style.display = 'none';
}

openToDoDialog.addEventListener('click', ()=> {
    toDoDialog.showModal();
    updateToDoBtn.style.display = 'none';
    addToDoBtn.style.display = 'block'
})

cancelToDoBtn.addEventListener('click', () => {
    emptyToDoInputField();
    toDoDialog.close();
});

function openToDoDialogUponEdit () {
    toDoDialog.showModal();
    addToDoBtn.style.display = 'none'
    updateToDoBtn.style.display = 'inline-block';
};


// for the sort create a new key:value inside the object that follows a condition
// use the value for that key value pair to create a sort function
// use an event listener 
// how do you then remove the effects of the sort when you leave the page?


loadFromLocalStorage();