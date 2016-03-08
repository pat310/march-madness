function exists(teams1, teams2){
	return teams1.filter(function(team1){
		return teams2.some(function(team2){
			return team1.toLowerCase() === team2.toLowerCase();
		});
	});
}

function normalizeString(str){
	str = str.replace(' ', '_').replace('.', '').toLowerCase();
	return [str, str.replace('state', 'st')];
}

var schoolMap = {

};