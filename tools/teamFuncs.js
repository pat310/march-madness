'use strict';

var convertData = require(__dirname + '/convertData.js');
var commonReplacements = require(__dirname + '/commonReplacements.js');

function missingTeams(year, hash){
	var teams = convertData.toList(year);
	return teams.filter(function(team){
		return !teamsMatch(team, hash);
	});
}

function teamsMatch(team, hash){
	return !!hash[team] || !!hash[team.replace(/State/, 'St')] || !!hash[commonReplacements[team]];
}

module.exports = missingTeams;