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


//Event Listeners

taskAdd.addEventListener('click', () => {
    let timeLabel = rowByDay('.hour-label--task');

    let newTimeRow = createTimeBlock();

    createTimeRow(timeLabel, newTimeRow);
});