const fs = require('fs');
const readline = require('readline');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function requestInput() {
  rl.question('Please enter your text (or "exit" for exit): ', (input) => {
    if (input === 'exit') {
      console.log('Goodbye!');
      rl.close();
      writeStream.end();
      return;
    }

    writeStream.write(input + '\n');

    requestInput();
  });
}

process.on('exit', () => {
  console.log('Goodbye!');
  rl.close();
  writeStream.end();
  process.exit();
});

requestInput();
