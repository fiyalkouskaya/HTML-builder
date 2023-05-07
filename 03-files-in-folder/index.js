const { stdout } = process;
const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  
  files.forEach(file => {
    if (file.isFile()) {
      const fileName = path.parse(file.name).name;
      const fileExtension = path.parse(file.name).ext.slice(1);
      
      fs.stat(path.join(folderPath, file.name), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        
        stdout.write(`${fileName}-${fileExtension}-${fileSizeInKB.toFixed(3)}kb\n`);
      });
    }
  });
});
