var rp = require('request-promise');
var cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

var resultArr = {
	2001: [3, 6, 9, 12, 15, 18],
	2002: [4, 5, 6, 7, 8, 9],
	2003: [4, 5, 6, 7, 8, 9],
	2004: [4, 5, 6, 7, 8, 9],
	2005: [4, 5, 6, 7, 8, 9],
	2006: [4, 5, 6, 7, 8, 9],
	2007: [4, 5, 6, 7, 8, 9],
	2008: [157, 158, 159, 160, 161, 162],
	2009: [243, 244, 245, 246, 247, 248],
	2010: [165, 166, 167, 168, 169, 170],
	2011: [170, 171, 172, 173, 174, 175],
	2012: [160, 161, 162, 163, 164, 165],
};

var years = Object.keys(resultArr);

var fileDirectory = path.join(__dirname, '../data/');

Promise.all(years.map(makeRequest))
.then(function(results){
	var promiseArr = results.map(function(result, index){
		return promisifiedWriteFile(path.join(fileDirectory, `${years[index]}Bracket.js`), `module.exports=${JSON.stringify(result)};`);
	});
	return Promise.all(promiseArr);
}, function(err){
	console.log('there was an error getting the data', err);
})
.then(function(writtenFiles){
	console.log(writtenFiles);
})
.catch(function(err){
	console.log('there was an error printing the data', err);
});

function makeRequest(year){
	return rp(`http://www.cbssports.com/collegebasketball/ncaa-tournament/history/yearbyyear/${year}`)
	.then(function(htmlString){
		return parseHtml(htmlString, year);
	});
}

function parseHtml(htmlString, year){
	$ = cheerio.load(htmlString);
	return resultArr[year].map(function(sliceNum, index){
		var data = $($('tr.row2').contents()[sliceNum]).text().replace(/\n/g, "!").replace(/!{2,}/g, '!').split('!');
		if(index === 0 && year === '2001') return parseWinners(data, 3);
		return parseWinners(data);
	});
}

function parseWinners(data, sliceNum){
	sliceNum = sliceNum || 0;

	return data.slice(sliceNum).reduce(function(acc, curr){
	    if(curr.length <= 17) return acc;
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