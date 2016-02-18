var moment = require('moment');
var now = moment();


// date to timestamp
console.log(now.format('X'));

// timestamp to date
var timestamp = 1131312;
var timeStampMoment = moment.utc(timeStamp);
console.log(timeStampMoment.locale().format('h'));

//console.log(now.format());
//console.log(now.format('MMM Do h:mma'));

