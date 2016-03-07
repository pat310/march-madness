var data = {
	2001: require(__dirname + '/2001Bracket.js'),
	2002: require(__dirname + '/2002Bracket.js'),
	2003: require(__dirname + '/2003Bracket.js'),
	2004: require(__dirname + '/2004Bracket.js'),
	2005: require(__dirname + '/2005Bracket.js'),
	2006: require(__dirname + '/2006Bracket.js'),
	2007: require(__dirname + '/2007Bracket.js'),
	2008: require(__dirname + '/2008Bracket.js'),
	2009: require(__dirname + '/2009Bracket.js'),
	2010: require(__dirname + '/2010Bracket.js'),
	2011: require(__dirname + '/2011Bracket.js'),
	2012: require(__dirname + '/2012Bracket.js'),	
};

function returnData(year){
	return data[year];
}

module.exports = returnData;