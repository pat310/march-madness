var rp = require('request-promise');
var cheerio = require('cheerio');

var year = '2001';
var resultArr = [3, 6, 9, 12, 15, 18];

rp(`http://www.cbssports.com/collegebasketball/ncaa-tournament/history/yearbyyear/${year}`)
.then(function(htmlString){
	$ = cheerio.load(htmlString);
	var data = $($('tr.row2').contents()[3]).text().replace(/\n/g, "!").replace(/!{2,}/g, '!').split('!');

	console.log('these are the results', parseWinners(data, 3));
})
.catch(function(err){
	console.log('there was an err', err);
});

function parseWinners(data, sliceNum){
	sliceNum = sliceNum || 0;

	return data.slice(sliceNum).reduce(function(acc, curr){
	    if(curr.length <= 7) return acc;
	    curr = curr.split(', ');
	    acc.winners.push(curr[0].replace(/No. \d{1,2} /, ""));
	    acc.losers.push(curr[1].replace(/No. \d{1,2} /, ""));
	    return acc;
	}, {winners: [], losers: []});
}