import './style.css'

type SentimentData = {
  count: { [key: string]: number }
  prior: number,
  total: number
}

const getSentiment = async (text: string) => {
  const response = await fetch(`${text}.json`)
  const {count,prior,total} = await response.json() as SentimentData

  return (words:string) => {
    const wordsArr = words.split(' ');
    let prop = prior;
    let wordCount = 0;
    wordsArr.forEach((word) => {
      if(count[word]) {
        prop *= count[word];
        wordCount += 1;
      }
    });
    return prop/(total ** wordCount)
  };
}



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <textarea id='textarea' rows='10' placeholder='Write some text'></textarea>
    <div>Tolstoy: <span id='tolstoy'>0</span>%</div>
    <div>Hamlet: <span id='hamlet'>0</span>%</div>
  </div>
`


// run this code on load
const loaded = async () => {
  const tolstoyFunction = await getSentiment('tolstoy');
  const hamletFunction = await getSentiment('hamlet');

  document.getElementById('textarea')!.addEventListener('input', (e) => {
    let text = (e.target as HTMLTextAreaElement).value;

    // remove all non-alphanumeric characters
    text = text.replace(/[^a-zA-Z0-9 ]/g, '');
    // make all characters lowercase
    text = text.toLowerCase();

    // if text ends with a space remove it
    if (text[text.length - 1] === ' ') {
      text = text.slice(0, text.length - 1);
    }

    const tolstoySentiment = tolstoyFunction(text);
    const hamletSentiment = hamletFunction(text);

    document.getElementById('tolstoy')!.innerHTML = Math.floor(tolstoySentiment/(tolstoySentiment+hamletSentiment)*100).toString();
    document.getElementById('hamlet')!.innerHTML = Math.floor(hamletSentiment/(tolstoySentiment+hamletSentiment)*100).toString();
  }
)};
loaded();

