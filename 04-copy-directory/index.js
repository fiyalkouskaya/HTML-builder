const fsPromises = require('fs').promises;
const path = require('path');

async function checkFolderExist() {
  try {
    await fsPromises.access(path.join(__dirname, 'files-copy'));
    return true;
  } catch (error) {
    return false;
  }
}

async function copyDir() {
  const srcPath = path.join(__dirname, 'files');
  const destPath = path.join(__dirname, 'files-copy');

  if (await checkFolderExist()) {
    await fsPromises.rm(destPath, { recursive: true });
  }

  await fsPromises.mkdir(destPath, { recursive: true });

  const files = await fsPromises.readdir(srcPath);

  const promises = files.map(async (file) => {
    const srcFilePath = path.join(srcPath, file);
    const destFilePath = path.join(destPath, file);

    const fileStat = await fsPromises.stat(srcFilePath);

    if (fileStat.isFile()) {
      await fsPromises.copyFile(srcFilePath, destFilePath);
    } else if (fileStat.isDirectory()) {
      await copyDir(srcFilePath, destFilePath);
    }
  });

  await Promise.all(promises);

  console.log('Copy completed');
}

copyDir().catch((err) => {
  console.error('Error during copy:', err);
});