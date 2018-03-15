const fs = require('fs');

function createNameMap() {
  const files = fs.readdirSync('./cleanedSpread');
  const abbreviationMap = files.reduce((acc, file) => {
    const newAbbrv = getAbbrev(file);

    return {...acc, ...newAbbrv};
  }, {});

  const efficiencyFiles = fs.readdirSync('./cleanedEfficiency');
  const efficiencyData = efficiencyFiles.reduce((acc, file) => {
    const year = file.match(/\d+/)[0];

    const yearData = fs.readFileSync(`./cleanedEfficiency/${file}`, 'utf8');
    const yearDataSplit = yearData.split('\n').map((row) => {
      return row.split(',');
    }).filter((row, index) => {
      return index !== 0 && row !== '';
    });

    acc[year] = yearDataSplit;

    return acc;
  }, {});

  const teamSpellingCSV = fs.readFileSync('./TeamSpellings.csv', 'utf8');
  const teamSpellingMap = teamSpellingCSV.split('\r\n').reduce((acc, curr) => {
    const row = curr.split(',');

    acc[row[0]] = row[1];
    return acc;
  }, {});

  files.forEach((file) => {
    const finalFile = replaceNamesAndJoin(file, abbreviationMap, teamSpellingMap, efficiencyData);

    fs.writeFileSync(`./combinedData/${file}`, finalFile);
  });

  //console.log(replaceNamesAndJoin('Virginia Tech_current.csv', abbreviationMap, teamSpellingMap, efficiencyData));
}

function replaceNamesAndJoin(file, nameMap, spellingMap, efficiencyData) {
  const fileContents = fs.readFileSync(`./cleanedSpread/${file}`, 'utf8');
  const rows = fileContents.split('\n');
  const headers = rows[0];
  const additionalHeaders = headers.concat(['Oeff1', 'Deff1', 'Oeff2', 'Deff2']);

  const combinedRows = rows.slice(1).reduce((acc, row) => {
    const splitRow = row.split(',');
    if (splitRow.length === 1) return acc;
    if (splitRow[6] === '0.0') return acc;

    const name1 = nameMap[splitRow[1]] ? spellingMap[nameMap[splitRow[1]].toLowerCase()] : 'NaN';
    const name2 = nameMap[splitRow[3]] ? spellingMap[nameMap[splitRow[3]].toLowerCase()] : 'NaN';
    const name1EffIndex = efficiencyData[splitRow[0]] ? efficiencyData[splitRow[0]].findIndex((efficiencyRow) => {
      return spellingMap[efficiencyRow[0].toLowerCase()] === name1;
    }) : -1;
    const name2EffIndex = efficiencyData[splitRow[0]] ? efficiencyData[splitRow[0]].findIndex((efficiencyRow) => {
      return spellingMap[efficiencyRow[0].toLowerCase()] === name2;
    }) : -1;

    const newRow = [...splitRow];

    newRow[1] = name1;
    newRow[3] = name2;
    if (name1EffIndex === -1) {
      newRow.push('NaN');
      newRow.push('NaN');
    } else {
      newRow.push(efficiencyData[splitRow[0]][name1EffIndex][1]);
      newRow.push(efficiencyData[splitRow[0]][name1EffIndex][2]);
    }

    if (name2EffIndex === -1) {
      newRow.push('NaN');
      newRow.push('NaN');
    } else {
      newRow.push(efficiencyData[splitRow[0]][name2EffIndex][1]);
      newRow.push(efficiencyData[splitRow[0]][name2EffIndex][2]);
    }

    return acc.concat([newRow]);
  }, [additionalHeaders]);

  const newHeaders = ['Team', 'Opponent', 'Spread', 'TeamOeff', 'TeamDeff', 'OppOeff2', 'OppDeff2', 'Result'];
  const teamName = spellingMap[file.replace(/_.+/, '').toLowerCase()];

  return combinedRows.map((row, index) => {
    if (index === 0) return newHeaders.join(',');
    let col0, col1, col2, col3, col4, col5, spread = row[6];

    if (row[1] === teamName) {
      col0 = row[3];
      col1 = row[10];
      col2 = row[11];
      col3 = row[12];
      col4 = row[13];
      origSpread = spread;
      spread = origSpread.replace('-', '+');
      spread = origSpread.replace('+', '-');
    } else {
      col0 = row[1];
      col1 = row[12];
      col2 = row[13];
      col3 = row[10];
      col4 = row[11];
    }
    return [teamName, col0, spread, col1, col2, col3, col4, row[5] === 'W' ? 1 : 0].join(',');
  }).join('\n');
}

function getAbbrev(fileName) {
  const fileContents = fs.readFileSync(`./cleanedSpread/${fileName}`, 'utf8');
  let abbrv1 = '';
  let abbrv2 = '';
  let selectedAbbrv = '';
  const rows = fileContents.split('\n');

  let numChanges = 0;
  let count = 1;
  while (selectedAbbrv === '' || numChanges === 2) {
    const cols = rows[count].split(',');

    if (count === 1) {
      abbrv1 = cols[1];
      abbrv2 = cols[3];
    } else {
      if (cols[1] === abbrv1 || cols[3] === abbrv1) {
        selectedAbbrv = abbrv1;
        numChanges += 1;
      }
      if (cols[3] === abbrv2 || cols[1] === abbrv2) {
        selectedAbbrv = abbrv2;
        numChanges += 1;
      }
    }

    numChanges = 0;
    count += 1;
  }

  const teamFullName = fileName.replace(/_.+/, '');

  return { [selectedAbbrv]: teamFullName};
}

createNameMap();
