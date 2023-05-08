const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'project-dist');
const htmlPath = path.join(dirPath, 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const headerPath = path.join(__dirname, 'components', 'header.html');
const articlesPath = path.join(__dirname, 'components', 'articles.html');
const footerPath = path.join(__dirname, 'components', 'footer.html');
const stylePath = path.join(dirPath, 'style.css');
const stylesDir = path.join(__dirname, 'styles');

// Make directory project-dist

fs.mkdir(dirPath, (err) => {
  if (err) throw err;
  console.log('Directory was created');
});

// Make index.html in project-dist

function readHtmlFile(path) { 
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, file) => {
      if (error) {
        reject(`Error reading file ${path}: ${error}`);
      } else {
        resolve(file);
      }
    });
  });
}

function fillTemplate(template) {
  return Promise.all([
    readHtmlFile(headerPath),
    readHtmlFile(articlesPath),
    readHtmlFile(footerPath)
  ]).then(([header, articles, footer]) => {
    return template.replace('{{header}}', header).replace('{{articles}}', articles).replace('{{footer}}', footer);
  }).catch((error) => {
    console.error('Error filling template:', error);
  });
}

readHtmlFile(templatePath)
  .then((template) => {
    return fillTemplate(template);
  })
  .then((filledTemplate) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(htmlPath, filledTemplate, (error) => {
        if (error) {
          reject(`Error writing file: ${error}`);
        } else {
          resolve();
        }
      });
    });
  })
  .then(() => {
    console.log(`Template successfully filled and saved to ${htmlPath}`);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// Make style.css in project-dist

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
  
        fs.writeFile(stylePath, bundleContents, (err) => {
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

// Copy assets folder 

function copyDir(srcPath, destPath) {
  return fsPromises.mkdir(destPath, { recursive: true })
    .then(() => {
      return fsPromises.readdir(srcPath);
    })
    .then((files) => {
      const promises = files.map((file) => {
        const srcFilePath = path.join(srcPath, file);
        const destFilePath = path.join(destPath, file);
  
        return fsPromises.stat(srcFilePath)
          .then((fileStat) => {
            if (fileStat.isDirectory()) {
              return copyDir(srcFilePath, destFilePath);
            } else if (fileStat.isFile()) {
              return fsPromises.copyFile(srcFilePath, destFilePath);
            }
          });
      });
  
      return Promise.all(promises);
    });
}
  
const srcPath = path.join(__dirname, 'assets');
const destPath = path.join(dirPath, 'assets');
  
copyDir(srcPath, destPath)
  .then(() => {
    console.log('Copy completed');
  })
  .catch((err) => {
    console.error('Error during copy:', err);
  });