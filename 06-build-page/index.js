const fsPromises = require('fs').promises;
const path = require('path');


const templatePath = path.resolve(__dirname, 'template.html');
const componentsPath = path.resolve(__dirname, 'components');
const stylePath = path.resolve(__dirname, 'styles');

async function checkDirExist() {
  try {
    await fsPromises.access(path.join(__dirname, 'project-dist'));
    return true;
  } catch (error) {
    return false;
  }
}
async function createDir() {
  const dirPath = path.join(__dirname, 'project-dist');

  if (await checkDirExist()) {
    await fsPromises.rm(dirPath, { recursive: true });
  }

  await fsPromises.mkdir(dirPath, { recursive: true });
}

async function createHtmlFile() {
  try {
    let templateData = await fsPromises.readFile(templatePath, 'utf-8');

    let componentsFiles = await fsPromises.readdir(componentsPath, { withFileTypes: true });

    for (const file of componentsFiles) {
      if (path.extname(file.name) === '.html') {
        let readingComponent = await fsPromises.readFile(path.resolve(__dirname, 'components', file.name), 'utf-8');
        templateData = templateData.split(`{{${file.name.split('.')[0]}}}`).join(readingComponent);
        await fsPromises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), templateData);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function createCssFile() {
  try { 
    let styleExists = await fsPromises.access(path.resolve(__dirname, 'project-dist', 'style.css'))
    .then(() => true)
    .catch(() => false);

    if (!styleExists) {
      await fsPromises.writeFile(path.resolve(__dirname, 'project-dist', 'style.css'), '');
    }

    let styleFiles = await fsPromises.readdir(stylePath, { withFileTypes: true });

    for (const file of styleFiles) {
      if (path.extname(file.name) === '.css') {
        let styleData = await fsPromises.readFile(path.join(stylePath, file.name), 'utf-8');
        await fsPromises.appendFile(path.resolve(__dirname, 'project-dist', 'style.css'), styleData);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
async function checkAssetsExistAndRemove() {
  try {
    await fsPromises.access(path.join(__dirname, 'project-dist', 'assets'));
    await fsPromises.rm(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });
    return true;
  } catch (error) {
    return false;
  }
}

function copyAssets(srcPath, destPath) {
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
              return copyAssets(srcFilePath, destFilePath);
            } else if (fileStat.isFile()) {
              return fsPromises.copyFile(srcFilePath, destFilePath);
            }
          });
      });
  
      return Promise.all(promises);
    });
}

const srcPath = path.join(__dirname, 'assets');
const destPath = path.join(__dirname, 'project-dist', 'assets');  

checkDirExist()
  .then (() => createDir())
  .then (() => createHtmlFile())
  .then (() => createCssFile())
  .then (() => checkAssetsExistAndRemove())
  .then (() => copyAssets(srcPath, destPath))