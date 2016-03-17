'use strict';
var generateResults = require(__dirname + '/tools/scrapeAlgos.js');
var mainFunc = require(__dirname + '/tools/teamFuncs.js');
var rank = ['Colley', 'Massey'];

var year = 2012;

var options = {
	ranking: rank[0],
	year: year,
	weight: 'Uniform',
	k: 300,
	homeWinWeight: 1,
	awayWinWeight: 1,
	neutralWinWeight: 1,
	slope: undefined,
	intervals: undefined,
	maxscore: undefined
};

generateResults(options)
.then(function(results){
	var score = mainFunc(year, results);
	console.log('score', score);
})
.catch(function(err){
	console.log('there was an err', err);
});


