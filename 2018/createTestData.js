const fs = require('fs');
const teamsPlaying = fs.readFileSync('./NCAATourneySeeds.csv', 'utf8');
const teamSpellingCSV = fs.readFileSync('./TeamSpellings.csv', 'utf8');

const efficiencies = fs.readFileSync('./cleanedEfficiency/efficiencyClean2018.csv', 'utf8');

const teamSpellingMap = teamSpellingCSV.split('\r\n').reduce((acc, curr) => {
  const row = curr.split(',');

  acc[row[0]] = row[1];
  return acc;
}, {});

const efficiencyData = efficiencies.split('\n').reduce((acc, row, index) => {
  const cols = row.split(',');
  const teamNumber = teamSpellingMap[cols[0].toLowerCase()];

  if (index === 0 || !teamNumber) return acc;

  acc[teamNumber] = cols.slice(1);

  return acc;
}, {});

const teamNumberMap = teamSpellingCSV.split('\r\n').reduce((acc, curr) => {
  const row = curr.split(',');

  if (!acc[row[1]]) acc[row[1]] = [];
  acc[row[1]].push(row[0]);
  return acc;
}, {});

const currentSpreads = require('./manualSpreads.js');
const spreadsMapped = {};
Object.keys(currentSpreads).forEach((team1) => {
  const team2 = Object.keys(currentSpreads[team1])[0];
  const value = currentSpreads[team1][team2];

  spreadsMapped[teamSpellingMap[team1.toLowerCase()]] = {[teamSpellingMap[team2.toLowerCase()]]: value};
  spreadsMapped[teamSpellingMap[team2.toLowerCase()]] = {[teamSpellingMap[team1.toLowerCase()]]: -value};
});
const teamsPlayingFiltered = teamsPlaying.split('\r\n').map(row => row.split(',')).filter((row) => {
  return parseInt(row[0]) === 2018;
}).map((row) => row[2]);

const teamCombinations = [['Spread', 'Team', 'Opponent', 'TeamOeff', 'TeamDeff', 'OppOeff2', 'OppDeff2']];
const spreadRange = Array(65 * 2).fill(0).map((_, i) => -65 + i);

for (i = 0; i < teamsPlayingFiltered.length; i++) {
  for (j = i + 1; j < teamsPlayingFiltered.length; j++) {
    const spread = spreadsMapped[teamsPlayingFiltered[i]] ? spreadsMapped[teamsPlayingFiltered[i]][teamsPlayingFiltered[j]] : NaN;

    //if (spread) {
      teamCombinations.push([mapToIndex(spread, spreadRange), teamsPlayingFiltered[i], teamsPlayingFiltered[j]].concat(efficiencyData[teamsPlayingFiltered[i]], efficiencyData[teamsPlayingFiltered[j]]));
      //}
  }
}

function mapToIndex(num, spreadRange) {
  return spreadRange.findIndex((val) => {
    return num <= val;
  });
}

const teamCombinationsCSV = teamCombinations.reduce((acc, row, index, arr) => {
  acc += row.join(',');
  if (index < arr.length - 1) acc += '\n';
  return acc;
}, '');

fs.writeFileSync('./newMarchMaddness2.csv', teamCombinationsCSV);

const results = fs.readFileSync('./results.csv', 'utf8');
const resultsArr = results.split('\n').map((num) => parseInt(num));
const probResults = fs.readFileSync('./resultsProbs.csv', 'utf8');
const probResultsArr = probResults.split('\n').map((row) => {
  const cols = row.split(',');
  return [parseFloat(cols[0]), parseFloat(cols[1])];
});
//console.log(resultsArr);
const teamResults = [];
const teamProbResults = [['ID', 'Pred']];

let counter = 0;
for (i = 0; i < teamsPlayingFiltered.length; i++) {
  for (j = i + 1; j < teamsPlayingFiltered.length; j++) {
    //const spread = spreadsMapped[teamsPlayingFiltered[i]] ? spreadsMapped[teamsPlayingFiltered[i]][teamsPlayingFiltered[j]] : NaN;

    //if (spread) {
    teamResults.push([teamNumberMap[teamsPlayingFiltered[i]][0], teamNumberMap[teamsPlayingFiltered[j]][0], resultsArr[counter]]);
    if (parseInt(teamsPlayingFiltered[i]) < teamsPlayingFiltered[j]) teamProbResults.push(`2018_${teamsPlayingFiltered[i]}_${teamsPlayingFiltered[j]},${probResultsArr[counter][0]}`);
    else teamProbResults.push(`2018_${teamsPlayingFiltered[j]}_${teamsPlayingFiltered[i]},${probResultsArr[counter][1]}`);
      //}
    counter += 1;
  }
}

const teamResultsCSV = teamResults.reduce((acc, row) => {
  acc += row.join(',') + '\n';
  return acc;
}, '');

const teamProbResultsCSV = teamProbResults.join('\n');

fs.writeFileSync('./resultsTabulated.csv', teamResultsCSV);
fs.writeFileSync('./probResultsTabulated.csv', teamProbResultsCSV);
