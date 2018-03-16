const fs = require('fs');

const spreadRange = Array(65 * 2).fill(0).map((_, i) => -65 + i);
function formattingData(data) {
  return data.split('\n').reduce((acc, curr, index) => {
    if (index === 0) return [curr];
    if (curr.match(/NaN/i)) return acc;

    const cols = curr.split(',');
    if (cols.slice(2).indexOf('') !== -1) return acc;

    //const newSpread = mapToIndex(parseFloat(cols[2]), spreadRange);
    const newSpread = parseFloat(cols[2]);
    const newData = [cols.slice(0, 2)].concat([newSpread], cols.slice(3).map(num => parseFloat(num)));

    return acc.concat([newData.join(',')]);
  }, []);
}

function mapToIndex(num, spreadRange) {
  return spreadRange.findIndex((val) => {
    return num <= val;
  });
}

const data = fs.readFileSync('./combinedSheet.csv', 'utf8');

fs.writeFileSync('./combinedCleanedData.csv', formattingData(data).join('\n'));
