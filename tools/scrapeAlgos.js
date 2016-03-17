'use strict';

var rp = require('request-promise');
var cheerio = require('cheerio');

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