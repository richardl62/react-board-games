// Relative (not root-absolute) so it resolves correctly under whatever base
// path the app is served from (e.g. plain '/' on Heroku vs '/react-board-games/'
// on GitHub Pages).
const wordListURL = 'legal-words.txt';

export async function getScrabbleWords(): Promise<string[]> {
  const response = await fetch(wordListURL);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return (await response.text()).split('\n');
}
