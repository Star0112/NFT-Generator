const fs = require('fs');
const path = require('path');
const { readdirSync } = require('fs')
const extension = 'png';

const DIR_PATH_TO_READ = './traits'

const getDirectories = () =>
  readdirSync(DIR_PATH_TO_READ, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const getFiles = (path) =>
  readdirSync(path, { withFileTypes: true })
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name)

const orders = [
  "Type",
  "Background",
  "Body",
  "Mouth",
  "Clothes",
  "Eye",
  "Eyewear",
  "Cap",
  "Accessories"
];

async function main() {

  let result = {};
  const directories = await getDirectories();

  for (let i = 0; i < directories.length; ++i) {
    const files = await getFiles(path.join(DIR_PATH_TO_READ, directories[i]));
    const traits = [];
    for (let j = 0; j < files.length; ++j) {
      const fileName = String(files[j]).slice(0, files[j].length - 4);
      traits.push({
        name: fileName.split("#")[0],
        count: parseInt(fileName.split("#")[1])
      });
    }
    result[directories[i]] = traits;
  }

  let finalResult = {};

  for (let i = 0; i < orders.length; ++i) {
    finalResult[orders[i]] = result[orders[i]];
  }


  await fs.writeFileSync(`./traits_draft.json`, JSON.stringify(finalResult));

}

main();