const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
  const resultDir = path.join(__dirname, 'project-dist');

  try {
    await makeDirectory(resultDir);
    await makeDirectory(path.join(resultDir, 'assets'));

    await replaceTemplateTags();
    // await fs.writeFile(path.join(resultDir, 'index.html'), updatedTemplate);

    await bundleStyles();
    await copyAssets();
  } catch (err) {
    console.error(err);
  }
}

async function makeDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

async function replaceTemplateTags() {
  const templatePath = path.join(__dirname, 'template.html');
  const template = await fs.readFile(templatePath);
  const componentsPath = path.join(__dirname, 'components');
  const components = await fs.readdir(componentsPath, { withFileTypes: true });

  let templateString = template.toString();

  for (let component of components) {
    if (component.isFile() && path.extname(component.name) === '.html') {
      const currComponent = await fs.readFile(
        __dirname + '/components/' + `${component.name}`,
      );
      templateString = templateString.replace(
        `{{${component.name.slice(0, -5)}}}`,
        currComponent.toString(),
      );
      // console.log(templateString);
    }
  }
  const resultFile = path.join(__dirname, 'project-dist', 'index.html');
  fs.writeFile(resultFile, templateString);
}

async function bundleStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const resultFile = path.join(__dirname, 'project-dist', 'style.css');
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
    await fs.writeFile(resultFile, stylesData);
  } catch (err) {
    console.error(err);
  }
}

async function copyAssets() {
  const assetsDir = path.join(__dirname, 'assets');
  const resultDir = path.join(__dirname, 'project-dist', 'assets');

  try {
    const files = await fs.readdir(assetsDir, { withFileTypes: true });

    for (let file of files) {
      const srcPath = path.join(assetsDir, file.name);
      const destPath = path.join(resultDir, file.name);

      if (file.isDirectory()) {
        await makeDirectory(destPath);
        const assetsFiles = await fs.readdir(srcPath, { withFileTypes: true });
        for (let file of assetsFiles) {
          const fromPath = path.join(srcPath, file.name);
          const toPath = path.join(destPath, file.name);
          await fs.copyFile(fromPath, toPath);
        }
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

buildPage();
