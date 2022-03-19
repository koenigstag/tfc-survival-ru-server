const cron = require('node-cron');
const archiver = require('archiver');
const fspromise = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const fastFolderSizeAsync = promisify(require('fast-folder-size'));

function log(channel, ...data) {
  console.log('\x1b[33m%s\x1b[0m', new Date().toLocaleString(), channel, ...data);
}

module.exports.log = (channel, ...data) => {
  log(channel, ...data);

  writeToLogfile(channel, ...data);
};

module.exports.logln = (channel, ...data) => {
  console.log('\n');
  log(channel, ...data);

  writeToLogfile(channel, ...data);
};

async function writeToLogfile(channel, ...data) {
  await fspromise.appendFile(path.resolve(__dirname, '../../logs/latest.log'), `
${new Date().toLocaleString()}
${channel} ${data.map(v => v instanceof Object ? JSON.stringify(v, null, 2) : v).join('\n')}
`, 'utf-8');
}

// 1 hour = 60 mins
// 24 hours = 1440 mins
// etc calculate
const moveFileTask = cron.schedule('*/720 * * * *', handleMoveLogFile);
moveFileTask.start();
async function handleMoveLogFile() {
  try {
    const stats = await fspromise.stat(path.resolve(__dirname, '../../logs/latest.log'));
    
    // 1000ms * 60s * 60m * 24h
    if (stats.birthtime.getTime() < Date.now() - 1000 * 60 * 60 * 24) {
      const dateDirname = new Date().toLocaleDateString().replace(/\./g, '-');

      try {
        await fspromise.stat(path.resolve(__dirname, '../../logs/', dateDirname));
      } catch (error) {
        await fspromise.mkdir(path.resolve(__dirname, '../../logs/', dateDirname));
      }

      let revision = 1;
      const files = await fspromise.readdir(path.resolve(__dirname, '../../logs/', dateDirname));
      for (const file of files) {
        revision++;
      }
      await fspromise.copyFile(
        path.resolve(__dirname, '../../logs/latest.log'),
        path.resolve(__dirname, `../../logs/${dateDirname}/${dateDirname}-${revision}.log`),
      );
      await fspromise.writeFile(path.resolve(__dirname, '../../logs/latest.log'), '');
    }
  } catch(error) {
      console.log(error);
      await fspromise.writeFile(path.resolve(__dirname, '../../logs/latest.log'), '');
  }
}
// handleMoveLogFile(); // debug

const archiveDirTask = cron.schedule('*/4320 * * * *', handleArchiveLogDir);
archiveDirTask.start();
async function handleArchiveLogDir() {
  try {
    const logFiles = await fspromise.readdir(path.resolve(__dirname, '../../logs/'));
    for (const file of logFiles) {
      const dirStats = await fspromise.stat(path.resolve(__dirname, '../../logs/', file));
      const bytes = dirStats.isDirectory() ? await fastFolderSizeAsync(path.resolve(__dirname, '../../logs/', file)) : 0;

      if (dirStats.isDirectory() && bytes >= 5e6) {

        const output = fs.createWriteStream(path.resolve(__dirname, '../../logs/', `${file}.zip`));
        const archive = archiver('zip', {
          zlib: { level: 9 } // Sets the compression level.
        });
        archive.on('error', function(err) {
          console.log(err);
        });
        // pipe archive data to the file
        archive.pipe(output);
        // append files from a sub-directory, putting its contents at the root of archive
        archive.directory(path.resolve(__dirname, '../../logs/', file), false);
        // finalize the archive (ie we are done appending files but streams have to finish yet)
        await archive.finalize();
        fspromise.rm(path.resolve(__dirname, '../../logs/', file), { recursive: true, force: true });
      }
    }
  } catch(error) {
    console.log(error);
  }
}
// handleArchiveLogDir(); // debug

module.exports.writeToLogfile = writeToLogfile;
