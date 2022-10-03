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

//Event Listeners