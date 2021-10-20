const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const stopWord = require('stopword');

const word = 'I despise this.';
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

function getSentiment(word = '') {
  const lexed = aposToLexForm(word);
  const lower = lexed.toLowerCase();
  const filtered = lower.replace('/[^a-zA-Zs]+/g', '');

  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();

  const tokenized = tokenizer.tokenize(filtered);

  tokenized.forEach((word, index) => {
    tokenized[index] = spellCorrector.correct(word);
  });

  const finalFiltered = stopWord.removeStopwords(tokenized);

  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

  const analysis = analyzer.getSentiment(finalFiltered);

  return analysis;
}

const sentiment = getSentiment(word);

console.log(sentiment);
