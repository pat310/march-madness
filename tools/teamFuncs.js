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

function convertTeamName(team, hash){
	if(!!hash[team]) return team;
	if(!!hash[team.replace(/State/, 'St')]) return team.replace(/State/, 'St');
	if(!!hash[commonReplacements[team]]) return commonReplacements[team];
}

function removeTeamsAndSort(teams, hash){
	var list = teams.map(function(team){
		return team + ' ' + hash[convertTeamName(team, hash)];
	});
	var newList = list.sort(function(b, a){
		return a.match(/\s\d+\.\d+/)[0] - b.match(/\s\d+\.\d+/)[0];
	});

	return newList.map(function(team){
		return team.split(' ')[0];
	});
}

function scoreAlgo(realList, algoList, hash){
	var score = 0;
	realList.forEach(function(team, index){
		var algoIndex = algoList.findIndex(function(algoTeam){
			return algoTeam === convertTeamName(team, hash);
		});
		score += Math.abs(index - algoIndex);
	});
	return score;
}

function mainFunc(year, hash){
	var teams = convertData.toPlacementByScore(year).filter(function(team){return !!team;});
	console.log('teams', teams);
	var algoList = removeTeamsAndSort(teams, hash);
	return scoreAlgo(teams, algoList, hash);
}

module.exports = mainFunc;