'use strict';

var dataFrom = require(__dirname + '/../data/');

function convertDataToPlacement(year){
	return dataFrom(year).reduceRight(function(acc, curr, index, arr){
		if(index === arr.length - 1) acc = acc.concat([removeScores(curr.winners)]);
		acc = acc.concat([removeScores(curr.losers)]);
		return acc;
	}, []);
}

function convertDataToList(year){
	return dataFrom(year).reduceRight(function(acc, curr, index, arr){
		if(index === arr.length - 1) acc = acc.concat(removeScores(curr.winners));
		acc = acc.concat(removeScores(curr.losers));
		return acc;
	}, []);
}

function convertDataToTopTeamsList(year){
	var teamList = dataFrom(year).reduce(function(acc, curr, index, arr){

		var list = curr.winners.map(function(team, index){
			var winnerScore = team.match(/\d{2,3}/)[0];
			var loserScore = curr.losers[index].match(/\d{2,3}/)[0];
			return removeScore(curr.losers[index]) + " " + (parseInt(winnerScore) - parseInt(loserScore));
		});


		list = list.sort(function(b, a){
			return parseInt(a.match(/\s\d{1,2}/)[0]) - parseInt(b.match(/\s\d{1,2}/)[0]);
		});

		list.forEach(function(team){
			if(!acc[removeScore(team)]) acc[removeScore(team)] = team.split(' ').pop();
		});

		if(index === arr.length - 1) acc[removeScore(curr.winners[0])] = 0;
		return acc;
	}, {});

	var listConvert = [];
	for(var key in teamList){
		listConvert.push(key);
	}
	return listConvert.reverse();
}

function removeScores(teams){
	return teams.map(function(team){
		return removeScore(team);
	});
}

function removeScore(team){
	return team.replace(/\d{1,3}/, '').replace(/(\(OT\)|\(2OT\))/, '').trim().replace(/\s/g,'_').replace(/\./g,'');
}

// console.log(convertDataToTopTeamsList(2001));

module.exports = {
	toPlacement: convertDataToPlacement,
	toList: convertDataToList,
	toPlacementByScore: convertDataToTopTeamsList,
};