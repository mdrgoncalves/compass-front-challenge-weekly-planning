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


//Event Listeners