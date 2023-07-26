const moment = require('moment');
const data = require("./mpData.json");

const now = moment();
const dayFrom = now.clone().add(-1 , 'days');
const weekFrom = now.clone().add(-1, 'weeks');
const monthFrom = now.clone().add(-1, 'months');

let dayEventCount = 0;
let weekEventCount = 0;
let monthEventCount = 0;

const dayUserCount = new Map();
const weekUserCount = new Map();
const monthUserCount = new Map();

for (const event of data) {
    const eventDate = moment(event.eventTime);
    if (withinDay(eventDate) && isInfectedEvent(event)) {
        countUser(dayUserCount, event);
        dayEventCount++;
    }
    if (withinWeek(eventDate) && isInfectedEvent(event)) {
        countUser(weekUserCount, event);
        weekEventCount++;
    }
    if (withinMonth(eventDate) && isInfectedEvent(event)) {
        countUser(monthUserCount, event);
        monthEventCount++;
    }
}

function isInfectedEvent(event) {
    return event.eventName === 'traffic|swg|malware_protection|infected_payload';
}

console.log("dayDenyCount", dayEventCount);
console.log(getTop5(dayUserCount));

console.log("weekDenyCount", weekEventCount);
console.log(getTop5(weekUserCount));

console.log("monthDenyCount", monthEventCount);
console.log(getTop5(monthUserCount));

function countUser(userCounter, event) {
    const userName = event.userName;
    const currentUserCount = userCounter.get(userName)
    if(currentUserCount) {
        userCounter.set(userName, currentUserCount+1);
    } else {
        userCounter.set(userName, 1);
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