const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const dirOriginal = path.join(__dirname, 'files');
  const dirCopy = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(dirCopy, { recursive: true });
    const files = await fs.readdir(dirOriginal, { withFileTypes: true });

    for (let file of files) {
      const originalFilePath = path.join(dirOriginal, file.name);
      const copyFilePath = path.join(dirCopy, file.name);

      await fs.copyFile(originalFilePath, copyFilePath);
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir();
