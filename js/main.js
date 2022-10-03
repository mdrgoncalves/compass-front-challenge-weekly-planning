//DOM Elements

const saveLocalStorage = document.querySelector('.button__saveLocal');
const deleteLocalStorage = document.querySelector('.button__deleteLocal');
const taskDesc = document.querySelector('.scheduler-add__task');
const taskDay = document.querySelector('.scheduler-add__day');
const taskTime = document.querySelector('.scheduler-add__time');
const taskAdd = document.querySelector('.scheduler-add__submit');
const taskDeleteAll = document.querySelector('.scheduler-add__delete');
const taskDelete = document.querySelectorAll('.task-card__button');

const timeColumns = document.querySelectorAll('.time-column');
const taskColumn = document.querySelectorAll('.task-column');


//Functions

/* Initial Load Functions */ 

document.addEventListener("DOMContentLoaded", function() {
    loadLocalStorage();
});

function loadLocalStorage() {
    let timeColumnArr = getTimeColumnArr();
    let taskColumnArr = getTaskColumnArr();

    let timeColumnDay = JSON.parse(localStorage.getItem('timeColumnDay'));
    let taskColumnDay = JSON.parse(localStorage.getItem('taskColumnDay'));

    if (timeColumnDay !== null && taskColumnDay !== null) {
        timeColumnArr.forEach((day, index) => {
            day.innerHTML = timeColumnDay[index];
        });
    
        taskColumnArr.forEach((day, index) => {
            day.innerHTML = taskColumnDay[index];
        });
    }
}

/* Time Functions */

function setTime() {
    let dateTime = new Date();
    let formattedDate = dateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const timeDisplay = document.querySelector('.header__time');
    timeDisplay.textContent = formattedDate;
}
setInterval(setTime, 1000);

function setDate() {
    let dateDay = new Date().getDate();
    let dateMonth = new Date().toLocaleString('default', { month: 'long' });
    let dateYear = new Date().getFullYear();

    const timeDisplay = document.querySelector('.header__date');
    timeDisplay.textContent = `${dateDay} de ${dateMonth} de ${dateYear}`;
}
setInterval(setDate, 1000);

/* Top Scroll Functions */

function doubleScroll(element) {
    const scrollbar = document.createElement('div');
    scrollbar.appendChild(document.createElement('div'));
    scrollbar.classList.add('top-scroll');
    scrollbar.firstChild.style.width= element.scrollWidth+'px';
    scrollbar.firstChild.style.height= '1px';
    scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
    scrollbar.onscroll = function() {
        element.scrollLeft = scrollbar.scrollLeft;
    };
    element.onscroll = function() {
        scrollbar.scrollLeft = element.scrollLeft;
    };
    element.parentNode.insertBefore(scrollbar, element);
}

function applyTopScroll() {
    const taskColumns = document.querySelectorAll('.task-column');

    taskColumns.forEach((column) => {
        doubleScroll(column);
    });
    
    const taskLists = document.querySelectorAll('.task-container');
    taskLists.forEach((list) => {
        list.classList.add('collapse');
    });
    
}
applyTopScroll();

/* Task Functions */

function rowByDay(DOMClass) {
    let daySelected = getDayIdSelected();
    let timeLabel = document.querySelectorAll(`${daySelected} ${DOMClass}`);
    return timeLabel;
}

function getDayIdSelected() {
    let dayIndex = returnDayIndex();
    const days = ['#monday', '#tuesday', '#wednesday', '#thursday', '#friday', '#saturday', '#sunday'];
    let daySelected = days[dayIndex];
    return daySelected;
}

function returnDayIndex() {
    const daysOfWeek = {
        0: 'segunda-feira',
        1: 'terça-feira',
        2: 'quarta-feira',
        3: 'quinta-feira',
        4: 'sexta-feira',
        5: 'sabado',
        6: 'domingo'
    }

    let dayIndex = 0;

    Object.keys(daysOfWeek).forEach((index) => {
        let taskDayValue = taskDay.value.toLowerCase();

        if (taskDayValue == daysOfWeek[index]) {
            dayIndex = index;
        }
    });

    return dayIndex;
}

function createTimeBlock() {
    let newTaskTime = taskTime.value;
    let newTaskTimeString = newTaskTime.replace(':','h') + 'm';

    let newTimeParagraph = `
        <p class="m-0">${newTaskTimeString}</p>
    `;

    let daySelected = getDayClassSelected();

    let newTimeRow = createRow(newTimeParagraph, 'row', 'mb-3', 'hour-label', 'hour-label--task', 'd-flex', 'align-items-center', 'justify-content-center', `time-block__${daySelected}`);

    return newTimeRow;
}

function createRow(innerContent, ...classes) {
    let newTimeRow = document.createElement('div');
    newTimeRow.classList.add(...classes);
    newTimeRow.innerHTML = innerContent;
    return newTimeRow;
}

function getDayClassSelected() {
    const daysOfWeek = {
        0: 'monday',
        1: 'tuesday',
        2: 'wednesday',
        3: 'thursday',
        4: 'friday',
        5: 'saturday',
        6: 'sunday'
    }

    let daySelectedIndex = returnDayIndex();
    let daySelected = daysOfWeek[daySelectedIndex]; 
    return daySelected;
}

function createTimeRow(timeArrDOM, rowAdd) {
    let timeArr = transformTimeInArray(timeArrDOM);
    let newTaskTimeFormatted = formatTime(taskTime.value);

    let timeColumnDay = getDaySection();

    let biggerTime = timeArr.find((time) => {
        return formatTime(time.outerText) > newTaskTimeFormatted;
    });

    let smallerTimer = timeArr.findLast((time) => {
        return formatTime(time.outerText) < newTaskTimeFormatted;
    });

    let equalTimer = timeArr.find((time) => {
        return formatTime(time.outerText) == newTaskTimeFormatted;
    });

    let biggerTimeIndex = timeArr.indexOf(biggerTime);
    let smallerTimeIndex = timeArr.indexOf(smallerTimer);
    let equalTimeIndex = timeArr.indexOf(equalTimer);

    if (timeColumnDay.innerHTML == '') {
        timeColumnDay.append(rowAdd);
        insertTask(0);  
    } else if (equalTimer) {
        setConflict(equalTimeIndex);
    } else if (biggerTime) {
        timeColumnDay.insertBefore(rowAdd, biggerTime);
        insertTask(biggerTimeIndex);
    } else if (smallerTimer) {
        timeColumnDay.insertBefore(rowAdd, smallerTimer.nextSibling);
        insertTask(smallerTimeIndex + 1);
    }
}

function formatTime(time) {
    return Number(time.replace('h', '').replace('m', '').replace(':', ''));
}

function getDaySection() {
    let dayIndex = returnDayIndex();
    let timeColumnDay = timeColumns[dayIndex];
    return timeColumnDay;
}

function transformTimeInArray(timeArrDOM) {
    let timeArr = [];

    timeArrDOM.forEach((time) => {
        timeArr.push(time);
    });

    return timeArr;
};

function insertTask(timeIndex) {
    let taskRows = rowByDay('.task-row');
    let dayIndex = returnDayIndex();
    let newTaskContent = createCard();
    let newTaskRow = createRow(newTaskContent, 'task-row', 'row', 'd-flex', 'flex-nowrap');

    taskColumn[dayIndex].insertBefore(newTaskRow, taskRows[timeIndex]);
}

function createCard(isConflict = false) {
    let daySelected = isConflict ? 'conflict' : getDayClassSelected();
    let newTaskDesc = taskDesc.value

    let newTaskContent = isConflict ? `
        <div class="task-card col-5 mb-3 ml-3 p-0 task-card d-flex justify-content-center">
            <div class="task-card__color task-card__${daySelected}"></div>
            <p class="task-card__text m-0 pl-3 pt-3">${newTaskDesc}</p>
            <div class="pr-2 pt-2 align-self-start">
                <button class="task-card__button btn">Apagar</button>
            </div>
        </div>
        ` : `
        <div class="task-card col-5 mb-3 p-0 task-card d-flex justify-content-center">
            <div class="task-card__color task-card__${daySelected}"></div>
            <p class="task-card__text m-0 pl-3 pt-3">${newTaskDesc}</p>
            <div class="pr-2 pt-2 align-self-start">
                <button class="task-card__button btn">Apagar</button>
            </div>
        </div>
    `;

    return newTaskContent;
}

/* Remove and Conflict Functions */

function removeIsEmpty(cardRow) {
    let hourLabel = document.querySelectorAll('.hour-label--task');

    let taskRowIndex = findIndexInTaskRow(cardRow);

    if (cardRow.textContent.trim() === '') {
        hourLabel[taskRowIndex].remove();  
    }
}

function findIndexInTaskRow(cardRow) {
    let taskRow = document.querySelectorAll('.task-row');
    let taskRowIndex = Array.prototype.indexOf.call(taskRow, cardRow);
    return taskRowIndex;
}

function conflictResolve(cardRow) {
    let containsCards = [];

    for (let i = 0; i < cardRow.childNodes.length; i++) {
        if (cardRow.childNodes[i].nodeName == 'DIV') {
            containsCards.push(cardRow.childNodes[i]);
        }
    }

    backToNormal(containsCards, cardRow);
}

function backToNormal(cardsArray, cardRow) {
    let taskRowIndex = findIndexInTaskRow(cardRow);
    let conflictLines = document.querySelectorAll('.conflict-line');

    let taskRow = cardRow.parentNode;
    let taskCards = taskRow.querySelectorAll('.task-row');
    let taskCardIndex = Array.prototype.indexOf.call(taskCards, cardRow);
    let timeColumn = taskRow.parentNode.querySelectorAll('.time-column .hour-label--task');

    if (cardsArray.length === 1) {
        if (conflictLines.length > 1) {
            conflictLines[taskRowIndex].remove();
        } else {
            conflictLines[0].remove();
        }

        let remainingCard = cardRow.querySelector('.task-card .task-card__color');
        remainingCard.classList.remove('task-card__conflict');
        timeColumn[taskCardIndex].classList.remove('time-block__conflict');
    }
}

function setConflict(timeIndex) {
    insertTaskSameCol(timeIndex);
    let taskCardColor = rowByDay('.task-row');
    let timerLabel = rowByDay('.time-column .hour-label--task');
    let cardsColor = taskCardColor[timeIndex].querySelectorAll('.task-card__color');
    
    cardsColor.forEach((card) => {
        card.classList.add('task-card__conflict');
    });
    
    timerLabel[timeIndex].classList.add('time-block__conflict');

    createConflictLine(timerLabel[timeIndex], timerLabel[0]);	
}

function insertTaskSameCol(timeIndex) {
    let taskRows = rowByDay('.task-row');
    let newTaskContent = createCard(true);
    taskRows[timeIndex].insertAdjacentHTML('beforeend', newTaskContent);
}

function createConflictLine(element, elementInitial) {
    let elementReference = element.getBoundingClientRect();
    let elementHeight = element.offsetHeight * 0.5;
    let linePosition = elementReference.top;
    let timeBlockInitial = elementInitial.getBoundingClientRect();
    let timeBlockInitialPosition = timeBlockInitial.top - elementHeight;

    let idDaySelected = getDayIdSelected();
    let daySelectedReference = document.querySelector(`${idDaySelected} .task-list`);

    let conflictLine = document.createElement('div');
    conflictLine.classList.add('conflict-line');
    conflictLine.style.top = `${linePosition - timeBlockInitialPosition}px`;
    daySelectedReference.appendChild(conflictLine);
}

/* Save/Delete LocalStorage Functions */

function getTimeColumnArr() {
    let timeColumn = document.querySelectorAll('.time-column');
    let timeColumnArr = Array.from(timeColumn);
    return timeColumnArr;
}

function getTaskColumnArr() {
    let taskColumn = document.querySelectorAll('.task-column');
    let taskColumnArr = Array.from(taskColumn);
    return taskColumnArr;
}


//Event Listeners

taskAdd.addEventListener('click', () => {
    let timeLabel = rowByDay('.hour-label--task');

    let newTimeRow = createTimeBlock();

    createTimeRow(timeLabel, newTimeRow);
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('task-card__button')) {
        let taskCard = e.target.parentNode.parentNode;

        let cardRow = taskCard.parentNode;
        let isConflict = taskCard.children[0].classList.contains('task-card__conflict');

        taskCard.remove();
        
        removeIsEmpty(cardRow);

        if (isConflict) {
            conflictResolve(cardRow);
        }
    }
}, false);

taskDeleteAll.addEventListener('click', () => {
    let timeDayCol = document.querySelector('.collapse.show .time-column');
    let taskDayCol = document.querySelector('.collapse.show .task-column');
    timeDayCol.innerHTML = '';
    taskDayCol.innerHTML = '';
});

saveLocalStorage.addEventListener('click', () => {
    let timeColumnArr = getTimeColumnArr();
    let taskColumnArr = getTaskColumnArr();

    let timeColumnDay = timeColumnArr.map((day) => {
        return day.innerHTML;
    });

    let taskColumnDay = taskColumnArr.map((day) => {
        return day.innerHTML;
    });

    localStorage.setItem('timeColumnDay', JSON.stringify(timeColumnDay));
    localStorage.setItem('taskColumnDay', JSON.stringify(taskColumnDay));
});

deleteLocalStorage.addEventListener('click', () => {
    let timeColumnArr = getTimeColumnArr();
    let taskColumnArr = getTaskColumnArr();

    timeColumnArr.forEach((day) => {
        day.innerHTML = '';
    });

    taskColumnArr.forEach((day) => {
        day.innerHTML = '';
    });

    localStorage.removeItem('timeColumnDay');
    localStorage.removeItem('taskColumnDay');
});