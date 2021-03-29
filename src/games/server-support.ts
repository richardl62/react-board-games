
const makeGameDefinition = require('./control/definition/make-game-definition.ts').makeGameDefinition;
const bobail = require('./bobail').default;
const chess = require('./chess').default;
const draughts = require('./draughts').default;
const simple = require('./simple-game').default;

const games = [...bobail, ...chess, ...draughts].map(makeGameDefinition);
games.push(simple);

export { games }