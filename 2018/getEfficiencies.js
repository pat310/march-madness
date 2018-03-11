const fs = require('fs');
const got = require('got');

module.exports = async function fetchData(year) {
  (async () => {
    try {
      const response = await got(`https://kenpom.com/index.php?y=${year}`);

      fs.writeFileSync(`./rawHTML/efficiencies${year}.txt`, response.body);
    } catch (error) {
      console.log(error);
    }
  })()
}
