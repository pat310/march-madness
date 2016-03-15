'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var rankingSchema = new mongoose.Schema({
	ranking: {type: String, enum: ['Colley', 'Masssey']},
	weight: {type: String, enum: ['Uniform', 'Log', 'Linear', 'Intervals']},
	k: Number,
	year: Number,
	homeWinWeight: Number,
	awayWinWeight: Number,
	neutralWinWeight: Number,
	slope: Number,
	intervals: Number,
	maxscore: Number,
	totalValue: Number,
	data: {
		school: {type: String}, 
		points: {type: Number}
	}
});

var weighting = {
	Uniform: 0,
	Log: 2,
	Linear: 2,
	Intervals: 3
};

var url = {
	Colley: 'http://marchmathness.davidson.edu/cgi/ranking_colley.cgi',
	Massey: 'http://marchmathness.davidson.edu/cgi/ranking_massey.cgi'
};

rankingSchema.virtual('weighting').get(function(){
	return weighting[this.weight];
});

rankingSchema.virtual('url').get(function(){
	return url[this.ranking];
});

var Rank = mongoose.model('Rank', rankingSchema);

module.exports = {
	Rank: Rank
};