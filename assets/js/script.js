// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));


// Todo: create a function to generate a unique task id
function generateTaskId() {
    let newTaskID;
    if (taskList){
         newTaskID =  (taskList.length + 1 + 0xFFFFF).toString(16);
    }else{
        newTaskID = (1 + 0xFFFFF).toString(16);
    }
    return newTaskID;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const todayDay = dayjs().format('MM/DD/YY');
    const dueDate = dayjs(task.date).format('MM/DD/YY');
    let taskColor = null;
    let textColor = null;

    if(dueDate < todayDay){
        taskColor = 'bg-danger';
        textColor = 'text-light';
    }else if(dueDate === todayDay){
        taskColor = 'bg-warning';
        textColor = 'text-light';
    }else {
        taskColor = 'bg-body-color';
        textColor = 'text-black';
    }
    

    const taskCard = $(`<div class="card text-center ${taskColor}  ${textColor} task-card" data-taskid="#${task.taskID}">
                            <div class="card-header">
                                ${task.title}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${task.description}</h5>
                                <p class="card-text card-contrast">${task.date}</p>
                                <button class="btn btn-danger delete-task-btn">Delete</a>
                            </div>
                            </div>`);

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    const toDoSection = $('#todo-cards');
    const inProgressSection = $('#in-progress-cards');
    const doneSection = $('#done-cards');

    for (task_i of taskList){
        if(task_i.taskStatus === 'Todo'){
            toDoSection.append(createTaskCard(task_i));
        }else if(task_i.taskStatus === 'InProgress'){
            inProgressSection.append(createTaskCard(task_i));
        }else{
            doneSection.append(createTaskCard(task_i));
        }
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    const taskTitleInput = $('#recipient-title');
    const taskDateInput = $('#date-task');
    const taskDescriptionInput = $('#message-text');

    const toDoSection = $('#todo-cards');

    task = {taskID: generateTaskId(),
            title: taskTitleInput.val(),
            date: taskDateInput.val(),
            description: taskDescriptionInput.val(),
            taskStatus:'Todo'}
    if(taskList){
        taskList.push(task);
    }else{
        taskList = [task];
    }
    
    localStorage.setItem('tasks', JSON.stringify(taskList));
    
    $('#formModal').modal('toggle');
    
    toDoSection.append(createTaskCard(task));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskToRemove = $(event.target).parent().parent();
    taskToRemove.remove()
    let taskDataId = taskToRemove.data('taskid');

    const indexTask = taskList.findIndex(taskIndex => taskIndex.taskID === taskDataId.slice(1));

    taskList.splice(indexTask, 1);
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    console.log(event);
    
    const droppedCard = ui.draggable[0];
    console.log(droppedCard);
    // console.log(droppedCard.attr('class'));

    $( this )
        .children().eq(1).children().append(droppedCard);
    //       .addClass( "ui-state-highlight" )


}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    const addTaskButton = $('#addTask');

    const toDoSection = $('#todo-cards');
    
    if (taskList){
        renderTaskList();
        toDoSection.on('click', '.delete-task-btn', handleDeleteTask);
    }

    $(function () {
        $('#date-task').datepicker({
          changeMonth: true,
          changeYear: true,
        });
      });

      $(function () {
        $('.task-card').draggable({ revert: "valid" });

     
        $('.lane').droppable({
            accept: ".task-card",
            classes: {
            //   "ui-droppable-active": "ui-state-active",
            //   "ui-droppable-hover": "ui-state-hover"
            },
            drop:handleDrop});
      });
    addTaskButton.on('click', handleAddTask);

});

