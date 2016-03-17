'use strict';
var generateResults = require(__dirname + '/tools/scrapeAlgos.js');
var mainFunc = require(__dirname + '/tools/teamFuncs.js');
var ranks = ['Colley', 'Massey'];
var weighting = ['Uniform', 'Log', 'Linear', 'Intervals'];

var rank = ranks[0];
var weight = weighting[3];


var fs = require('fs');

var year = 2012;

var options = {
	ranking: rank,
	year: year,
	weight: weight,
	k: 300,
	homeWinWeight: 1,
	awayWinWeight: 1,
	neutralWinWeight: 1,
	slope: undefined,
	intervals: undefined,
	maxscore: undefined
};

var scorePrev;

// generateResults(options)
// .then(function(results){
// 	var score = mainFunc(year, results);
// 	console.log('score', score);
// })
// .catch(function(err){
// 	console.log('there was an err', err);
// });

function scoreCalculation(){
	return generateResults(options)
	.then(function(results){
		var score = mainFunc(year, results);
		console.log('score:', score);
		adjustOptions(score, scorePrev);
	})
	.catch(function(err){
		console.log('there was an err', err);
	});
}

var variableIndex = 0;
var listVariables = ['homeWinWeight', 'awayWinWeight', 'neutralWinWeight'];

if(weight === 'Linear') listVariables.push('slope');
if(weight === 'Intervals') listVariables.push('intervals');
if(rank === 'Massey') listVariables.push('maxscore');

function adjustOptions(resultsCurr, resultsPrev){
	if(!resultsPrev || resultsCurr <= resultsPrev){
		scorePrev = resultsCurr;
		if(listVariables[variableIndex] !== 'intervals') options[listVariables[variableIndex]]++;
		else options[listVariables[variableIndex]]+= 1;
		return scoreCalculation();
	}
	if(variableIndex < listVariables.length - 1){
		options[listVariables[variableIndex]]--;
		variableIndex++;
		if(!options[listVariables[variableIndex]]) options[listVariables[variableIndex]] = 0;
		
		if(listVariables[variableIndex] !== 'intervals') options[listVariables[variableIndex]]++;
		else options[listVariables[variableIndex]]+= 1;
		return scoreCalculation();
	}

	options[listVariables[variableIndex]]--;
	console.log("final score:", resultsPrev, "options", options);
	var promise1 = promisifiedAppendFile(`./quickResults/${rank}${weight}.csv`, `${resultsPrev}\n`);
	var promise2 = promisifiedAppendFile(`./quickResults/${rank}${weight}.txt`, `score: ${resultsPrev}, options: ${JSON.stringify(options)}\n`);

	Promise.all([promise1, promise2])
	.then(function(){
		console.log('all done!');
	})
	.catch(function(err){
		console.log('WRITE FAILURE!!!!', err);
	})
	// fs.appendFileSync(`./quickResults/${rank}${weight}.csv`,`, ${resultsPrev}`);
	// fs.appendFileSync(`./quickResults/${rank}${weight}.csv`,`, ${resultsPrev}`);
}

scoreCalculation();


function promisifiedAppendFile(file, data){
	return new Promise(function(resolve, reject){
		fs.appendFile(file, data, 'utf8', function(err, data){
			if(err) reject(err);
			resolve(data);
		});
	});
}