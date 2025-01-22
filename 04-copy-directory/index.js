const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const dirOriginal = path.join(__dirname, 'files');
  const dirCopy = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(dirCopy, { recursive: true });
    const filesOriginal = await fs.readdir(dirOriginal, {
      withFileTypes: true,
    });
    const filesCopy = await fs.readdir(dirCopy, { withFileTypes: true });

    const filesOriginalNames = filesOriginal.map((file) => file.name);
    const filesCopyNames = filesCopy.map((file) => file.name);

    for (let file of filesCopyNames) {
      if (!filesOriginalNames.includes(file)) {
        const fileToDelete = path.join(dirCopy, file);
        await fs.unlink(fileToDelete);
      }
    }
    for (let file of filesOriginal) {
      const originalFilePath = path.join(dirOriginal, file.name);
      const copyFilePath = path.join(dirCopy, file.name);

      await fs.copyFile(originalFilePath, copyFilePath);
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir();
