const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');

module.exports = async function getPointSpreads(team, value, month, done) {
    try {
      const response = await got.post('https://www.oddsshark.com/stats/dbresults/basketball/ncaab', {
        form: true,
        body: {
          'selected-values': `H2H|${value}|0|30|${month}|REG/PST|ANY|ANY`,
          'honeypot-time-stamp': 1520801910,
          'team-search': team,
          'opponent-search': 'opponent-search',
          'number-games': 'on',
          location: 'on',
          numeric: 1,
          numeric: 99,
        }
      });

      const $ = cheerio.load(response.body);
      const results = [];

      $('tbody').children().each((i, row) => {
        const dataRow = [];

        $(row).children().each((index, col) => {
          dataRow.push($(col).text().trim());
        });
        results.push(dataRow);
      });

      const resultsCSV = results.reduce((acc, row) => {
        acc += row.join(',') + '\n';

        return acc;
      }, '');

      fs.writeFile(`./data2/spread_${team}_${month}.csv`, resultsCSV, (err) => {
        if (err) console.log(err);
        done();
      });
    } catch (error) {
      console.log(error);
    }
}
