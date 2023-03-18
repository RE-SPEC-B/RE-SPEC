'use strict';

exports.checkDuplicateDates = (date1, date2, date3) => {
    if (date2 && date1 == date2) return true;
    if (date3 && (date1 == date3 || date2 == date3)) return true;

    return false;
};
