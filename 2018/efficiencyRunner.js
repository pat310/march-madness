const fetchData = require('./getEfficiencies.js');
const createCSV = require('./convertEfficienies.js');

// const years = Array(17).fill(0).map((_, i) => i + 2002);

const years = [2018];
(async function createDataFiles(i) {
  if (i < years.length) {
    //await fetchData(years[i]);
    createCSV(years[i]);
    createDataFiles(i + 1);
  }
})(0)
