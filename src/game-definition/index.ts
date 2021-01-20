
// Using 'require' helps with loading this in the server.
const bobail = require('./bobail').default;
const chess = require('./chess').default;
const draughts = require('./draughts').default;

const games = [...bobail, ...chess, ...draughts];

export default games;