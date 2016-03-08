var makeRequest = require(__dirname + '/tools/scrapeAlgos.js');

var rank = ['Colley', 'Massey'];

var options = {
	ranking: rank[0],
	year: 2001,
	weight: 'Uniform',
	k: 300,
	homeWinWeight: 1,
	awayWinWeight: 1,
	neutralWinWeight: 1,
	slope: undefined,
	intervals: undefined,
	maxscore: undefined
};

makeRequest(options)
.then(function(results){
	console.log('results', results);
})
.catch(function(err){
	console.log('error!', err);
});