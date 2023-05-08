const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const destDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(destDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error('Failed to read styles directory');
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  const styles = [];

  cssFiles.forEach((cssFile, index) => {
    const cssPath = path.join(stylesDir, cssFile);

    fs.readFile(cssPath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Failed to read CSS file ${cssFile}`);
        return;
      }

      styles[index] = data;

      if (styles.length === cssFiles.length) {
        const bundleContents = styles.join('\n');

        fs.writeFile(bundlePath, bundleContents, (err) => {
          if (err) {
            console.error('Failed to write bundle.css');
            return;
          }

          console.log('Successfully created bundle.css');
        });
      }
    });
  });
});
