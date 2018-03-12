const fs = require('fs');

function checkForEmpties() {
  const files = fs.readdirSync('./data');
  const results = [];

  function readRecursive(index) {
    function done(fileName) {
      if (fileName) results.push(fileName);
      readRecursive(index + 1);
    }

    if (index < files.length) readFile(files[index], done);
    else console.log(results);
  }

  readRecursive(0);
}

function readFile(fileName, done) {
  fs.readFile(`./data/${fileName}`, 'utf8', (err, data) => {
    if (err) console.log('error!!!!!!!', fileName);
    else if (data.length === 0) done(fileName);
    else done();
  })
}

checkForEmpties();
