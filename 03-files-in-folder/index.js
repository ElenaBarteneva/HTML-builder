const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, function (err, files) {
  if (err) {
    console.log(err);
  }
  //   console.log(files);
  files.forEach((file) => {
    if (file.isFile()) {
      fs.stat(
        `03-files-in-folder/secret-folder/${file.name}`,
        function (err, stats) {
          //   console.log(stats);
          const filename = file.name.split('.').slice(0, -1).join('.');
          const extname = path.extname(file.name).slice(1);
          const size = `${Math.round(stats.size / 1024)} Kb`;
          console.log(`${filename} - ${extname} - ${size}`);
        },
      );
    }
  });
});
