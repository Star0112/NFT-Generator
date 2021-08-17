
const totalImages = require('./all.json');
const multiplier = require('./multiplier.json');
const totalArr = require('./total.json');

function shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

function getEggInfo(index) {
  let current = 0;

  for (let i = 0; i < totalImages.images.length; i++) {
    let typeGroup = totalImages.images[i];
    for (let j = 0; j < typeGroup.values.length; j++) {
      let colorGroup = typeGroup.values[j];
      if (current <= index && index <= current + colorGroup.values.length - 1) {
        return {
          material: typeGroup.type,
          color: colorGroup.color,
          image: colorGroup.values[index - current],
          type: colorGroup.values.length == 1 ? "ULTRA" :
            colorGroup.values.length <= 20 ? "LEGENDARY" : "RARE"
        }
      } else {
        current += colorGroup.values.length;
      }
    }
  }

  return null;
}

function main() {
  let fs = require('fs');

  // Generate random array
  for (var a=[],i=0;i<6400;++i) a[i]=i;
  a = shuffle(a);
  let str = "";
  for (let i=0;i<6400;++i) str += `${i}: ${a[i]}\n`;
  fs.writeFile(`Eggs1/order.txt`, str, function (err) {
    if (err) throw err;
  });

  for (let i = 0; i < 6400; i++) {
    let info = getEggInfo(a[i]);
    if (info) {
      const content = {
        "attributes": [
          {
            "trait_type": "Material",
            "value": info.material
          },
          {
            "trait_type": "Color",
            "value": info.color
          },
          {
            "trait_type": "Multiplier",
            "value": multiplier.multiplier[i]
          },
          {
            "trait_type": "Type",
            "value": info.type
          },
        ],
        "description": "Apymon is a collection of 6400 creatures created by AI which are contained in procedurally designed eggs. What makes these Genesis Eggs special is that they can hold other NFTs, ERC20 and ERC1155 tokens, making them function as your personal vault. No two Apymon creatures or Genesis Eggs are the same, each one is unique and crafted with love.",
        "external_url": "https://apymon.com",
        "image": info.image,
        "name": `Genesis Egg #${i}`
      };

      fs.writeFile(`Eggs1/${i}`, JSON.stringify(content), function (err) {
        if (err) throw err;
      });
    }
  }

  console.log("Finished");
}

function checkMultiplier() {
  let c1 = 0;
  let c125 = 0;
  let c15 = 0;
  let c175 = 0;
  let c2 = 0;
  let c25 = 0;
  let c3 = 0;
  let c5 = 0;

  multiplier.multiplier.forEach((el) => {
    if (el == 1) {
      c1++;
    } else if (el == 1.25) {
      c125++;
    } else if (el == 1.5) {
      c15++;
    } else if (el == 1.75) {
      c175++;
    } else if (el == 2) {
      c2++;
    } else if (el == 2.5) {
      c25++;
    } else if (el == 3) {
      c3++;
    } else if (el == 5) {
      c5++;
    }
  })

  console.log(c1);
  console.log(c125);
  console.log(c15);
  console.log(c175);
  console.log(c2);
  console.log(c25);
  console.log(c3);
  console.log(c5);
}

function makeTotal() {
  const fs = require('fs')

  let total = [];
  for (let i = 0; i < 6400; i++) {
    try {
      const data = fs.readFileSync(`Eggs1/${i}`, 'utf8')
      const content = JSON.parse(data);
      const newObject = {
        material: content.attributes[0].value,
        color: content.attributes[1].value,
        multiplier: content.attributes[2].value,
        type: content.attributes[3].value,
        image: content.image,
        id: i
      };
      // console.log(newObject)
      total.push(newObject);
    } catch (err) {
      console.error(err)
    }
  }
  console.log("-------------------------total-------------------------")
  console.log(total);

  fs.writeFile(`Eggs1/total.json`, JSON.stringify(total), function (err) {
    if (err) throw err;
  });
  console.log("Finished");
}

function makeNewAll() {
  const fs = require('fs')

  for (let i = 0; i < totalImages.images.length; i++) {
    let typeGroup = totalImages.images[i];
    for (let j = 0; j < typeGroup.values.length; j++) {
      let colorGroup = typeGroup.values[j];
      const newValues = totalArr.filter((item) => {
        return item.material == typeGroup.type && item.color == colorGroup.color
      });

      totalImages.images[i].values[j].values = newValues.map(el => {return {
        id: el.id,
        multiplier: el.multiplier,
        image: el.image
      }});
      totalImages.images[i].values[j].rarity = newValues.length == 1 ? "ULTRA" :
        newValues.length <= 20 ? "LEGENDARY" : "RARE"
    }
  }

  fs.writeFile(`newAll.json`, JSON.stringify(totalImages), function (err) {
    if (err) throw err;
  });
  console.log("Finished");
}

// main();
// checkMultiplier();
// makeTotal();
makeNewAll();
