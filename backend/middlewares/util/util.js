const moment = require('moment')

function daysBetweenDates(start, end, maxDays = 30) {
    let datesBetween = []
    datesBetween[0] = start
    while (datesBetween[datesBetween.length - 1] != end) {
        datesBetween.push(moment(datesBetween[datesBetween.length - 1]).add(1, 'day').format('YYYY-MM-DD'))
        if (datesBetween.length > maxDays) {
            datesBetween = false
            break
        }
    }

    if (typeof datesBetween !== 'object') {
        return false
    } else {
        return datesBetween
    }
}

module.exports = { daysBetweenDates }