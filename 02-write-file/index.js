const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

stdout.write('Wake up, Neo...\n');

const output = fs.createWriteStream(path.join(__dirname, 'output.txt'), 'utf-8');

stdin.on('data', data => {
  const input = data.toString();
  if (input.trim() === 'exit') {
    stdout.write('Knock, knock, Neo.\n');
    process.exit();
  } else {
    output.write(input);
  }
});

process.on('SIGINT', () => {
  stdout.write('Knock, knock, Neo.\n');
  output.end(() => {
    process.exit();
  });
});
