const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');

module.exports = async function getPointSpreads(team, month) {
    try {
      const response = await got.post('https://www.oddsshark.com/stats/dbresults/basketball/ncaab', {
        form: true,
        body: {
          'selected-values': `H2H|15283|0|30|${month}|REG/PST|ANY|ANY`,
          'honeypot-time-stamp': 1520776697,
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

      fs.writeFileSync(`./data/spread${team}_${month}`, resultsCSV);
    } catch (error) {
      console.log(error);
    }
}
