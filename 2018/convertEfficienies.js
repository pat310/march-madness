const fs = require('fs');
const cheerio = require('cheerio');

module.exports = function createCSV(year) {
  const efficiencyHTML = fs.readFileSync(`./rawHTML/efficiencies${year}.txt`);

  const $ = cheerio.load(efficiencyHTML);
  const results = []

  $('tbody').each((i, elem) => {
    $(elem).children().each((i2, row) => {
      const tuple = [];

      $(row).children().each((index, column) => {
        if (index === 1 || index === 5 || index === 7) tuple.push($(column).text().trim());
      });

      results.push(tuple);
    });
  });


  function convertToCSV(results) {
    return results.reduce((acc, row) => {
      acc += row.join(',') + '\n';

      return acc;
    }, '');
  }

  fs.writeFileSync(`./data/results${year}.csv`, convertToCSV(results));
}
