require('dotenv').config();

var Jimp = require('jimp');
const fs = require('fs');

const newImageSize = 640;

async function resize(folder) {
  console.log(`\nChecking folder ${folder}\n`);

  const categories = fs.readdirSync(folder);

  for (const category of categories) {
    try {
      if (fs.lstatSync(`${folder}/${category}`).isDirectory()) {
        await resize(`${folder}/${category}`);
      } else {
        console.log(`Resizing image ${category}`);
        let img = await Jimp.read(`${folder}/${category}`);
        await img.resize(newImageSize, newImageSize) // resize
          .write(`traits/${folder}/${category}`); // save
      }
    } catch (err) {
      console.log(err);
    }
  }
}

async function main() {
  const folder = './traits/'

  await resize(folder);

  await new Promise((res) => {
    setTimeout(() => {
      console.log('Finished');
      res();
    }, 3000)
  });
  process.exit(1);
}

main();