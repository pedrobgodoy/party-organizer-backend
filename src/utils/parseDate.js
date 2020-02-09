module.exports = function parseDate(dateString){
    const dateArray = dateString.split('/');
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0] + 'T00:00');
}