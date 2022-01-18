require('dotenv').config();

const fs = require('fs');
var Jimp = require('jimp');
const traits = require('./traits.json');
const extension = 'png';
const imgCount = process.env.IMAGE_COUNT;

function getFilePath(trait, index) {
    const fileName = traits[trait][index].name;
    const count = traits[trait][index].count;
    if (fileName === 'NONE') {
        return undefined;
    }

    return `traits/${trait}/${fileName}#${count}.${extension}`;
}

async function checkAllTraitInfo() {
    for (const trait of Object.keys(traits)) {
        let imageCount = 0;
        for (let i = 0; i < traits[trait].length; i++) {
            imageCount = imageCount + traits[trait][i].count;
            const fileName = getFilePath(trait, i);
            if (fileName === undefined || fs.existsSync(fileName)) {
            } else {
                console.log("DOES NOT exist:", fileName, trait, i);
                exist(1);
            }
        }
        if (imageCount.toString() !== imgCount) {
            console.log("Total count is not correct:", trait, imageCount);
            exist(1);
        }
    }
    console.log("All are correct!!!");
}

async function generateImage(assignedTraits, index) {
    let baseImg = await Jimp.read(
        getFilePath(Object.keys(assignedTraits)[0], assignedTraits[Object.keys(assignedTraits)[0]][index])
    );

    for (const trait of Object.keys(assignedTraits).slice(1)) {
        const path = getFilePath(trait, assignedTraits[trait][index]);
        if (path) {
            const img = await Jimp.read(path);
            baseImg.composite(img, 0, 0);
        }
    }

    await baseImg.resize(495, 550).write(`images/${index + 1333}.png`);
}

function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}

function makeInfo(assignedTraits) {
    const info = [];
    for (let i = 0; i < imgCount; i++) {
        const temp = {};
        for (const trait of Object.keys(traits)) {
            const name = traits[trait][assignedTraits[trait][i]].name;
            if (name !== 'NONE') {
                temp[trait] = name;
            }
        }
        temp.name = `${process.env.NAME} #${i + 1333}`;
        info.push(temp);
    }

    fs.writeFile(`info.json`, JSON.stringify(info), function (err) {
        if (err) throw err;
    });
}

async function main() {
    const assignedTraits = {};
    for (const trait of Object.keys(traits)) {
        assignedTraits[trait] = [];
        for (let i = 0; i < traits[trait].length; i++) {
            assignedTraits[trait] = [...assignedTraits[trait], ...Array(traits[trait][i].count).fill(i)];
        }
        if (assignedTraits[trait].length != imgCount) {
            console.log(`Trait [${trait}] info is not correct.`);
            return;
        }
        assignedTraits[trait] = shuffle(assignedTraits[trait]);
    }

    for (let i = 0; i < imgCount; i++) {
        await generateImage(assignedTraits, i);
        console.log(`Generated image #${i}`);
    }

    makeInfo(assignedTraits);
    console.log('Finished');
}

// checkAllTraitInfo();
main();

