const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const emitter = new EventEmitter();

stdout.write('Wake up, Neo...\n');

emitter.on('SIGINT', () => {
  stdout.write('Knock, knock, Neo.\n');
  process.exit();
});

stdin.on('data', data => {
  const input = data.toString();
  const output = fs.createWriteStream(path.join(__dirname, 'output.txt'), 'utf-8');
  if (input.trim() === 'exit') {
    stdout.write('Knock, knock, Neo.\n');
    process.exit();
  } else {
    output.write(input);
  }
});
