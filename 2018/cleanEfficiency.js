const fs = require('fs');
const years = Array(17).fill(0).map((_, i) => i + 2002);

function cleanFile(year) {
  const results = fs.readFileSync(`./data/efficiency${year}.csv`, 'utf8');
  const columnTitles = ['team', 'adjO', 'adjD'];

  const arrayResults = results.split('\n').map((row) => {
    return row.split(',');
  });

  const formattedArrResults = arrayResults.map((row) => {
    const firstCol = row[0].replace(/\d/, '').trim();

    return [firstCol].concat(row.slice(1));
  });

  const newData = [columnTitles].concat(formattedArrResults);
  const newCSV = newData.reduce((acc, row) => {
    acc += row.join(',') + '\n';
    return acc;
  }, '');

  fs.writeFileSync(`./data/efficiencyClean${year}.csv`, newCSV);
}

(function recurse(index) {
  if (index < years.length) {
    cleanFile(years[index]);
    recurse(index + 1);
  }
})(0)
