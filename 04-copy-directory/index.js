const fsPromises = require('fs').promises;
const path = require('path');

function copyDir() {
  const srcPath = path.join(__dirname, 'files');
  const destPath = path.join(__dirname, 'files-copy');

  fsPromises.mkdir(destPath, { recursive: true })
    .then(() => {
      return fsPromises.readdir(srcPath);
    })
    .then((files) => {
      const promises = files.map((file) => {
        const srcFilePath = path.join(srcPath, file);
        const destFilePath = path.join(destPath, file);

        return fsPromises.stat(srcFilePath)
          .then((fileStat) => {
            if (fileStat.isFile()) {
              return fsPromises.copyFile(srcFilePath, destFilePath);
            } else if (fileStat.isDirectory()) {
              return copyDir(srcFilePath, destFilePath);
            }
          });
      });

      return Promise.all(promises);
    })
    .then(() => {
      console.log('Copy completed');
    })
    .catch((err) => {
      console.error('Error during copy:', err);
    });
}

copyDir();
