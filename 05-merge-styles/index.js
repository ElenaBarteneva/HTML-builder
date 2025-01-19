const fs = require('fs').promises;
const path = require('path');

async function bundleStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const resultDir = path.join(__dirname, 'project-dist');
  const resultFile = path.join(resultDir, 'bundle.css');

  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });
    let stylesData = '';
    for (let file of files) {
      const filePath = path.join(stylesDir, file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const stylesChunk = await fs.readFile(filePath);
        stylesData += stylesChunk + '\n';
      }
    }
    await fs.mkdir(resultDir, { recursive: true });
    await fs.writeFile(resultFile, stylesData);
  } catch (err) {
    console.error(err);
  }
}

bundleStyles();
