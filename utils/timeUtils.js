'use strict';

function getMonthString(month) {
    const monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
}

module.exports.formatDate = function formatDate(date) {
    return date.getDate() + " " + getMonthString(date.getMonth()) + " " + date.getFullYear() + " at " + date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}