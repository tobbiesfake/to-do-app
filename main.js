//-------------DECLARATIONS-------------//
let allLoadPanel;
let firstLoadPanel;
let currentPanel;
let caller;
const allPanels = document.querySelectorAll('.panel-item ul li');
const taskContainer = document.querySelector('.task');
let myTaskData = {};

//NEW OBJ CONSTRUCTOR
function Panel() {
    this.completed = [];
    this.uncompleted = [];
}

const allTags = taskContainer.querySelectorAll('.task-container ul[tag-data]');
const completedTag = taskContainer.querySelector('.task-container ul#completed');
let allTasks = document.querySelectorAll('.task-item');
let checkIcons = taskContainer.querySelectorAll('.task-item span i');
let unmarkIcons = taskContainer.querySelectorAll('.task-item span i.uil-circle');

const adderContainer = document.querySelector('.task-adder');
const adder = document.querySelector('.task-adder input');
const adderIcon = document.querySelector('.task-adder i');

const infoPanel = document.querySelector('div .info');
const taskInfo = document.querySelector('.info-field');
const deleteBtn = document.querySelector('.info-bot .delete');

//-------------FUNCTIONS---------------//
const getPanel = function (key) {
    return document.querySelector(`.panel-item ul li[keyaccess=${key}`);
}
const queryCurrentItem = function () {
    checkIcons = taskContainer.querySelectorAll('.task-item span i');
    allTasks = taskContainer.querySelectorAll('.task-item');
    unmarkIcons = taskContainer.querySelectorAll('.task-item span i.uil-circle');
}
const inputActive = function (e) {
    if (e.target.value !== '') {
        adderIcon.style.color = '#fff';
        adderIcon.className = 'uil uil-arrow-circle-up';
    } else {
        adderIcon.style.color = 'var(--overlay-bg)';
        adderIcon.className = 'uil uil-plus-circle';
    }
}
const addTask = function (task, panel, state, order) {
    let location;
    const add = function (status) {
        switch (status) {
            case 'completed':
                location.innerHTML =
                    `<li order="${order}" class="task-item complete-task"><span><i class="uil uil-check-circle"></i></span> ${task}</li>` +
                    location.innerHTML;
                break;
            case 'uncompleted':
                location.innerHTML =
                    `<li order="${order}" class="task-item"><span><i class="uil uil-circle"></i></span> ${task}</li>` +
                    location.innerHTML;
                break;
        }
    }
    switch (currentPanel) {
        case 'completed':
        case 'uncompleted':
            location = document.querySelector(`#${panel}`);
            add(currentPanel);
            break;
        default:
            if (state === 'uncompleted') {
                location = document.querySelector(`#${panel}`);
            } else {
                location = document.querySelector(`#${state}`);
            }
            add(state);
            break;
    }

}
const hintSelectedTask = (e) => {
    allTasks.forEach((els) => {
        if (e.target !== els) {
            els.classList.remove('task-selected');
        }
    })
    e.target.classList.toggle('task-selected');
    if (e.target.classList.contains('task-selected')) {
        return true;
    }
}
const showTasks = function (panel) {
    const loopState = function (arr, cate, status) {
        if (arr[0] !== undefined) {
            for (let i = arr.length - 1; i >= 0; i--) {
                addTask(arr[i], cate, status, i);
            }
        }
    }
    allTasks.forEach((els) => {
        els.remove();
    });
    switch (panel) {
        case 'completed':
        case 'uncompleted':
            for (let cate in myTaskData) {
                let container = myTaskData[cate][panel];
                loopState(container, cate, panel);
            }
            break;
        default:
            let container = myTaskData[panel];
            for (let state in container) {
                loopState(container[state], panel, state);
            }
            break;
    }
    interactToTask();
}
const showTags = function (tag) {
    allTags.forEach(function (els) {
        els.style.display = 'none';
        switch (tag) {
            case 'completed':
                if (myTaskData[els.id]['completed'][0] !== undefined) {
                    els.style.display = 'block';
                }
                break;
            case 'uncompleted':
                if (myTaskData[els.id]['uncompleted'][0] !== undefined) {
                    els.style.display = 'block';
                }
                break;
            default:
                if (els.id === tag && myTaskData[tag]['uncompleted'][0] !== undefined) {
                    els.style.display = 'block';
                }
                break;
        }
    })
}
const showCompleteTag = function () {
    completedTag.classList.add('hide');
    if (currentPanel !== 'completed' && currentPanel !== 'uncompleted') {
        if (myTaskData[currentPanel].completed[0] !== undefined) {
            completedTag.classList.remove('hide');
        }
    }
}

const toggleCompletion = function (e) {
    e.stopPropagation();
    updateData(currentPanel, e, 'mark');
    showTasks(currentPanel);
    showTags(currentPanel);
    showCompleteTag();
    taskInfo.value = null;
    infoEventLis('remove');
}
const infoEventLis = function (action) {
    switch (action) {
        case 'add':
            taskInfo.addEventListener('focusout', changeTaskContent);
            deleteBtn.addEventListener('click', deleteTask);
            break;

        case 'remove':
            taskInfo.removeEventListener('focusout', changeTaskContent);
            deleteBtn.removeEventListener('click', deleteTask);
            break;
    }
}
const changeTaskContent = function () {
    updateData(caller, null, 'update');
}
const deleteTask = function () {
    taskInfo.value = null;
    infoEventLis('remove');
    updateData(caller.path[1].id, caller.target.attributes.order.value, 'delete');
    showTasks(currentPanel);
    showCompleteTag();
    showTags(currentPanel);
}
const onlyChangeThisTask = function (e) {
    e.stopPropagation();
    taskInfo.value = null;
    taskInfo.blur();
    if (caller !== undefined) {
        infoEventLis('remove');
    }

    if (hintSelectedTask(e)) {
        taskInfo.value = e.target.innerText;
        taskInfo.focus();
        caller = e;
        infoEventLis('add');
    }
}
const interactToTask = function () {
    queryCurrentItem();
    checkIcons.forEach((element) => {
        element.addEventListener('click', toggleCompletion);
    });
    unmarkIcons.forEach((ele) => ele.addEventListener('click', () => {
        new Audio('assets/sound/ting.mp3').play();
    }))
    allTasks.forEach((element) => {
        element.addEventListener('click', onlyChangeThisTask);
    });
}

const updateData = function (cate, value, action) {
    switch (action) {
        case 'add':
            myTaskData[cate].uncompleted.unshift(value);
            break;
        case 'delete':
            if (currentPanel === 'completed' || currentPanel === 'uncompleted') {
                myTaskData[cate][currentPanel].splice(value, 1);
            } else {
                if (cate === 'completed') {
                    myTaskData[currentPanel].completed.splice(value, 1);
                } else {
                    myTaskData[currentPanel].uncompleted.splice(value, 1);
                }
            }
            break;
        case 'mark':
            let task;
            switch (cate) {
                case 'completed':
                    [task] = myTaskData[value.path[3].id][cate].splice(value.path[2].attributes.order.value, 1);
                    myTaskData[value.path[3].id].uncompleted.unshift(task);
                    break;
                case 'uncompleted':
                    [task] = myTaskData[value.path[3].id][cate].splice(value.path[2].attributes.order.value, 1);
                    myTaskData[value.path[3].id].completed.unshift(task);
                    break;
                default:
                    let tag = value.path[3].id;
                    if (tag === 'completed') {
                        [task] = myTaskData[cate].completed.splice(value.path[2].attributes.order.value, 1);
                        myTaskData[cate].uncompleted.unshift(task);
                    } else {
                        [task] = myTaskData[cate].uncompleted.splice(value.path[2].attributes.order.value, 1);
                        myTaskData[cate].completed.unshift(task);
                    }
                    break;
            }
            console.log(task);
            break;
        case 'update':
            let order = cate.target.attributes.order.value;
            if (taskInfo.value !== '' && taskInfo.value !== cate.target.innerText) {
                cate.srcElement.lastChild.data = taskInfo.value;
                if (currentPanel === 'completed' || currentPanel === 'uncompleted') {
                    myTaskData[cate.path[1].id][currentPanel][order] = taskInfo.value;
                } else {
                    if (cate.path[1].id === 'completed') {
                        myTaskData[currentPanel].completed[order] = taskInfo.value;
                    } else {
                        myTaskData[currentPanel].uncompleted[order] = taskInfo.value;
                    }
                }
            } else {
                taskInfo.value = cate.target.innerText;
            }
            break;
    }
    storeToLocal();
}
const storeToLocal = function () {
    let storeValue = JSON.stringify(myTaskData);
    window.localStorage.setItem('myLocalTasks', storeValue);
}

// ----------------EXECUTING-----------------------//

//~~~~Initialize Data~~~~//
if (window.localStorage.getItem('myLocalTasks') !== null) {
    myTaskData = JSON.parse(window.localStorage.getItem('myLocalTasks'));
} else {
    allPanels.forEach((els) => {
        //create data tree
        let cate = els.attributes.keyaccess.value;
        if (cate !== 'uncompleted' && cate !== 'completed') {
            myTaskData[cate] = new Panel(cate);
        }
    })
}
allLoadPanel = {
    allTasks : 'uncompleted',
    myDay: 'myDay',
    important: 'important',
    assignToMe: 'assignToMe',
    planned: 'planned',
    groceries: 'groceries',
    completed: 'completed',
    work: 'work',
    school: 'school',
    family: 'family',
}
firstLoadPanel = allLoadPanel.allTasks;
currentPanel = firstLoadPanel;
getPanel(currentPanel).classList.add('active-panel');
showTags(currentPanel);
showTasks(currentPanel);
showCompleteTag();

//~~~~Todo List's Soul~~~~//
adder.addEventListener('input', inputActive);
adder.addEventListener('keydown', (e) => {
    if (e.which === 13 && e.target.value !== '') {
        updateData(currentPanel, adder.value, 'add');
        showTags(currentPanel);
        showTasks(currentPanel);
        adder.value = null;
        inputActive(e);
    }
});
taskInfo.addEventListener('keydown', function (event) {
    if (event.which === 13 && taskInfo.value !== '') {
        taskInfo.blur();
    } else if (event.which === 13 && taskInfo.value === '') {
        //prevent new line character
        event.preventDefault();
    }
});
allPanels.forEach((elt) => {
    elt.addEventListener('click', function () {
        allPanels.forEach((elt) => {
            elt.classList.remove('active-panel');
        })
        this.classList.add('active-panel');
        currentPanel = this.attributes.keyaccess.value;
        if (currentPanel === 'completed' || currentPanel === 'uncompleted') {
            adderContainer.classList.add('hide');
            taskContainer.querySelector('.task-container').classList.add('expand-task-container');
        } else {
            adderContainer.classList.remove('hide');
            taskContainer.querySelector('.task-container').classList.remove('expand-task-container');
        }
        infoEventLis('remove');
        taskInfo.value = null;
        showTags(currentPanel);
        showTasks(currentPanel);
        showCompleteTag();
    })
})