'use strict';

var dataFrom = require(__dirname + '/../data/');

function convertData(year){
	return dataFrom(year).reduceRight(function(acc, curr, index, arr){
		if(index === arr.length - 1) acc = acc.concat([removeScores(curr.winners)]);
		acc = acc.concat([removeScores(curr.losers)]);
		return acc;
	}, []);
}

function removeScores(teams){
	return teams.map(function(team){
		return team.replace(/\d{1,3}/, '').replace(/\(OT\)/, '').trim();
	});
}

module.exports = convertData;