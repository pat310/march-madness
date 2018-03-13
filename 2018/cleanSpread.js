const fs = require('fs');

function cleanFile(fileName) {
  const results = fs.readFileSync(`./data/${fileName}`, 'utf8');
  const rows = results.split('\n');
  if (rows.length <= 2) {
    console.log('fileName ', fileName, ' empty? ', rows);
    return {past: [], current: []};
  }

  const arrayResults = rows.reduce((acc, row) => {
    if (row.length === 0) return acc;
    const newArr = row.split(',');
    const year = newArr[1].trim();

    const newRow = [newArr[0] + ' ' + year].concat(newArr.slice(2));

    if (year === '2018') acc.current = acc.current.concat([newRow]);
    else acc.past = acc.past.concat([newRow]);

    return acc;
  }, {past: [], current: []});

  return arrayResults;
}

function csvIFY(arr) {
  return arr.reduce((acc, row) => {
    acc += row.join(',') + '\n';
    return acc;
  }, '');
}

function runCleaning() {
  const files = fs.readdirSync('./data');
  // const files = ['spread_Alabama_1.csv', 'spread_Akron_4.csv'];
  let currentTeam = ''
  const columnTitles = ['Date', 'Away', 'Score', 'Home', 'Score', 'Result', 'Home Spread', 'ATS', 'Total', 'OU'];
  let pastData = [columnTitles];
  let currentData = [columnTitles];

  files.forEach((file, index, arr) => {
    if (/spread_.+/.test(file)) {
      let team = file.match(/_.+_/)[0].slice(1);

      if (currentTeam === '') currentTeam = team;
      if (currentTeam !== team || index === arr.length - 1) {
        if (pastData.length > 1) fs.writeFileSync(`./cleanedSpread/${currentTeam}past.csv`, csvIFY(pastData));
        if (currentData.length > 1) fs.writeFileSync(`./cleanedSpread/${currentTeam}current.csv`, csvIFY(currentData));
        pastData = [columnTitles];
        currentData = [columnTitles];
        currentTeam = team;
      }
      const { past, current } = cleanFile(file);

      pastData = pastData.concat(past);
      currentData = currentData.concat(current);
    }
  });
}

runCleaning();
