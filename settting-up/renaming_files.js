const fs = require('fs');
const path = require('path');

// Example: Full path to your target folder
const targetDir = 'f-clips';

fs.readdir(targetDir, (err, files) => {
  if (err) return console.error('Error reading directory:', err);

  // Optional: Filter files only
  const onlyFiles = files.filter(file => fs.lstatSync(path.join(targetDir, file)).isFile());

  onlyFiles.forEach((file, index) => {
    const ext = path.extname(file);  // Keep original file extension
    const newName = `${index + 1}${ext}`;
    const oldPath = path.join(targetDir, file);
    const newPath = path.join(targetDir, newName);

    fs.rename(oldPath, newPath, (err) => {
      if (err) console.error(`Failed to rename ${file}:`, err);
      else console.log(`Renamed ${file} -> ${newName}`);
    });
  });
});
