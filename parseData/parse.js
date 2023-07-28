// load fs
import fs from 'fs';

// load each line of the text files
const dataHamlet = fs.readFileSync('./parseData/data/hamlet.txt', 'utf-8').split('\n');
const dataTolstoy = fs.readFileSync('./parseData/data/tolstoy.txt', 'utf-8').split('\n');

// remove special characters from text and make it into lower case
const cleanDataHamlet = dataHamlet.map((line) => {
  return line.replace(/[^a-zA-Z ]/g, '').toLowerCase();
});
const cleanDataTolstoy = dataTolstoy.map((line) => {
  return line.replace(/[^a-zA-Z ]/g, '').toLowerCase();
});

let hamletWordCount = 0;
let tolstoyWordCount = 0;

// Get the count of each word in each text
const countHamlet = {};
const countTolstoy = {};

// find all the unique words in the text
const uniqueWordsHamlet = new Set();
cleanDataHamlet.forEach((line) => {
  const words = line.split(' ');
  hamletWordCount += words.length;
  words.forEach((word) => {
    uniqueWordsHamlet.add(word);
    countTolstoy[word] = 1;
    countHamlet[word] = 1;
  });
});

const uniqueWordsTolstoy = new Set();
cleanDataTolstoy.forEach((line) => {
  const words = line.split(' ');
  tolstoyWordCount += words.length;
  words.forEach((word) => {
    uniqueWordsTolstoy.add(word);
    countTolstoy[word] = 1;
    countHamlet[word] = 1;
  });
});

// find the common words in both texts
const commonWords = new Set();
uniqueWordsHamlet.forEach((word) => {
  if (uniqueWordsTolstoy.has(word)) {
    commonWords.add(word);
  }
});







cleanDataHamlet.forEach((line) => {
  line.split(' ').forEach((word) => {
    countHamlet[word] += 1;
  });
});

cleanDataTolstoy.forEach((line) => {
  line.split(' ').forEach((word) => {
    countTolstoy[word] += 1;
  });
});

// // count + 1 / total words in current text + total unique words
// const hamletProb = {};
// const tolstoyProb = {};

// commonWords.forEach((word) => {
//   hamletProb[word] = countHamlet[word] / (hamletWordCount + commonWords.size);
//   tolstoyProb[word] = countTolstoy[word] / (tolstoyWordCount + commonWords.size);
// });

const priorHamlet = hamletWordCount / (hamletWordCount + tolstoyWordCount);
const priorTolstoy = tolstoyWordCount / (hamletWordCount + tolstoyWordCount);

// instead of using the prop for each word we can use other math

const totalHamlet = hamletWordCount + commonWords.size;
const totalTolstoy = tolstoyWordCount + commonWords.size;

const findPropOfHamlet = (words) => {
  const wordsArr = words.split(' ');
  let prop = priorHamlet;
  let wordCount = 0;
  wordsArr.forEach((word) => {
    if(countHamlet[word]) {
      prop *= countHamlet[word];
      wordCount += 1;
    }
  });
  return prop/(totalHamlet ** wordCount)
};

const findPropOfTolstoy = (words) => {
  const wordsArr = words.split(' ');
  let prop = priorTolstoy;
  let wordCount = 0;
  wordsArr.forEach((word) => {
    if(countTolstoy[word]) {
      prop *= countTolstoy[word];
      wordCount += 1;
    }
  });
  return prop/(totalTolstoy ** wordCount)
};

// save count of each word in each text
fs.writeFileSync('./public/hamlet.json', JSON.stringify({count:countHamlet, prior: priorHamlet, total: totalHamlet}));
fs.writeFileSync('./public/tolstoy.json', JSON.stringify({count:countTolstoy, prior: priorTolstoy, total: totalTolstoy}));


console.log('hamlet',findPropOfHamlet('thou shall'))
console.log('tolstoy',findPropOfTolstoy('thou shall'))
// console.log(hamletProb);

