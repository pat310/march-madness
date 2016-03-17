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

//non-weighted algorithm
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

//weighted algorithm
function scoreWeightedAlgo(realList, algoList, hash){
	var score = 0;
	var roundPoints = [32, 16, 8, 4, 2, 1];

	algoList.forEach(function(team, index){
		realList.forEach(function(bracket, round){
			if(bracket.some(function(roundTeam){
				return convertTeamName(roundTeam, hash) === team;
			})){
				if(index === 0) score += roundPoints[round];
				else if(index <= 1 && round >= 1) score += roundPoints[round];
				else if(index <= 4 && round >= 2) score += roundPoints[round];
				else if(index <= 16 && round >= 3) score += roundPoints[round];
				else if(index <= 32 && round >= 4) score += roundPoints[round];
				else if(index <= 63 && round >= 5) score += roundPoints[round];
			}
		});
	});

	return score;
}

function mainFunc(year, hash){
	var teams = convertData.toList(year).filter(function(team){return !!team;});
	var algoList = removeTeamsAndSort(teams, hash);
	var teamsByPlacement = convertData.toPlacementDuplicates(year);
	return scoreWeightedAlgo(teamsByPlacement, algoList, hash);
}

module.exports = mainFunc;