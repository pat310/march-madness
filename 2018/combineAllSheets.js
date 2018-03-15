const fs = require('fs');
const files = fs.readdirSync('./combinedData');

const masterList = files.reduce((acc, file, index) => {
  const fileData = fs.readFileSync(`./combinedData/${file}`, 'utf8');
  const rows = fileData.split('\n');
  if (index === 0) acc.push(rows);
  else acc.push(rows.slice(1));

  return acc;
}, []);

fs.writeFileSync('./combinedSheet.csv', masterList.join('\n'));
