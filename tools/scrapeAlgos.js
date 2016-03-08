'use strict';

var rp = require('request-promise');
var cheerio = require('cheerio');

// var options = {
// 	method: 'POST',
// 	uri: 'http://marchmathness.davidson.edu/cgi/ranking_colley.cgi',
// 	form: {
// 		year: 2001,
// 		weighting: 0,
// 		k: 300,
// 		homeWinWeight: 1,
// 		awayWinWeight: 1,
// 		neutralWinWeight: 1
// 	}
// };

// makeRequest(options)
// .then(function(results){
// 	console.log('these are the results', results);
// })
// .catch(function(err){
// 	console.log('there was an error', err);
// });

function makeRequest(options){
	return rp(optionsCreator(options))
	.then(function(htmlString){
		return parseHtml(htmlString);
	});
}

function parseHtml(htmlString){
	var $ = cheerio.load(htmlString);
	return Array.from($('tr').contents().prevObject).reduce(function(acc, row){
		row = $(row).text().trim().replace(/(\n|\r)/g, "").split('  ').slice(1);
		acc[row[0]] = Number(row[1]);
		return acc;
	},{});
}

function optionsCreator(options){
	var uri = {
		Colley: 'http://marchmathness.davidson.edu/cgi/ranking_colley.cgi',
		Massey: 'http://marchmathness.davidson.edu/cgi/ranking_massey.cgi'
	};

	var weighting = {
		Uniform: 0,
		Log: 2,
		Linear: 2,
		Intervals: 3
	};

	var opts = {
		method: 'POST',
		uri: uri[options.ranking],
		form: {
			year: options.year,
			k: options.k,
			weighting: weighting[options.weight],
			homeWinWeight: options.homeWinWeight,
			awayWinWeight: options.awayWinWeight,
			neutralWinWeight: options.neutralWinWeight
		}
	};

	if(options.slope) opts.form.slope = options.slope;
	if(options.intervals) opts.form.intervals = options.intervals;
	if(options.maxscore) opts.form.maxscore = options.maxscore;

	return opts;
}

module.exports = makeRequest;