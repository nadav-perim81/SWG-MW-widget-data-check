const moment = require('moment');
const data = require("./data.json");

const DENY_EVENTS = ['deny', 'warn'];

const now = moment();
const dayFrom = now.clone().add(-1 , 'days');
const weekFrom = now.clone().add(-1, 'weeks');
const monthFrom = now.clone().add(-1, 'months');

let dayEventCount = 0;
let weekEventCount = 0;
let monthEventCount = 0;

const dayCategoryCount = new Map();
const weekCategoryCount = new Map();
const monthCategoryCount = new Map();

for (const event of data) {
    const eventDate = moment(event.eventTime);
    if (withinDay(eventDate)) {
        countCategory(dayCategoryCount, event);
        dayEventCount = DENY_EVENTS.includes(event.action) ? dayEventCount+1 : dayEventCount;
    }
    if (withinWeek(eventDate)) {
        countCategory(weekCategoryCount, event);
        weekEventCount = DENY_EVENTS.includes(event.action) ? weekEventCount+1 : weekEventCount;
    }
    if (withinMonth(eventDate)) {
        countCategory(monthCategoryCount, event);
        monthEventCount = DENY_EVENTS.includes(event.action) ? monthEventCount+1 : monthEventCount;
    }
}

console.log("dayDenyCount", dayEventCount);
console.log(getTop5(dayCategoryCount));

console.log("weekDenyCount", weekEventCount);
console.log(getTop5(weekCategoryCount));

console.log("monthDenyCount", monthEventCount);
console.log(getTop5(monthCategoryCount));

function countCategory(categoryCounter, event) {
    for(const cat of event.urlCategory) {
        if (categoryCounter.get(cat)) {
            categoryCounter.set(cat, categoryCounter.get(cat) + 1);
        } else {
            categoryCounter.set(cat, 1);
        }
    }
}

function getTop5(countMap) {
    const mapArray = Array.from(countMap);
    const sortedArray = mapArray.sort((a, b) => b[1] - a[1]);
    return sortedArray.slice(0, 5);
}

function withinDay(checkDate){
    return dateWithinRange(checkDate, dayFrom, now);
}

function withinWeek(checkDate) {
    return dateWithinRange(checkDate, weekFrom, now);
}

function withinMonth(checkDate) {
    return dateWithinRange(checkDate, monthFrom, now);
}

function dateWithinRange(checkDate, from, to) {
    return checkDate.isBetween(from, to);
}