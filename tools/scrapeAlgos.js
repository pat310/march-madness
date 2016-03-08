'use strict';

var rp = require('request-promise');
var cheerio = require('cheerio');

var options = {
	method: 'POST',
	uri: 'http://marchmathness.davidson.edu/cgi/ranking_colley.cgi',
	form: {
		year: 2001,
		weighting: 0,
		k: 300,
		homeWinWeight: 1,
		awayWinWeight: 1,
		neutralWinWeight: 1
	}
};

makeRequest(options)
.then(function(results){
	console.log('these are the results', results);
})
.catch(function(err){
	console.log('there was an error', err);
});

function makeRequest(options){
	return rp(options)
	.then(function(htmlString){
		return parseHtml(htmlString);
	});
}

function parseHtml(htmlString){
	var $ = cheerio.load(htmlString);
	return Array.from($('tr').contents().prevObject).map(function(row){
		return $(row).text().replace(/([\n|\r])/g, "").match(/(([a-z]+_?)+){1}/i)[0];
	});
}