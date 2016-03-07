var rp = require('request-promise');
var cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

var year = '2001';
var resultArr = [3, 6, 9, 12, 15, 18];

var fileDirectory = path(__dirname, '/models/');

rp(`http://www.cbssports.com/collegebasketball/ncaa-tournament/history/yearbyyear/${year}`)
.then(function(htmlString){
	$ = cheerio.load(htmlString);
	var winnersLosersArr = resultArr.map(function(sliceNum, index){
		var data = $($('tr.row2').contents()[sliceNum]).text().replace(/\n/g, "!").replace(/!{2,}/g, '!').split('!');
		if(index === 0) return parseWinners(data, 3);
		return parseWinners(data);
	});

	console.log('these are the results', winnersLosersArr);
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

function promisifiedWriteFile(file, data){
	return new Promise(function(resolve, reject){
		fs.writeFile(file, data, function(err){
			if(err) reject(err);
			else resolve(file + " completed");
		});
	});
}