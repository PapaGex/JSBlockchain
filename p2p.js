const crypto = require('crypto');
const Swarm = require('discovery-swarm');
const defaults = require('dat-swarm-defaults');
const getPort = require('get-port');

const peers = {};
let connSeq = 0;
let channel = 'bloodlines';

const myPeerId = crypto.randomBytes(32);
console.log(`myPeerId: ${myPeerId.toString('hex')}`);

const config = defaults({
    id: myPeerId,
});

const swarm = Swarm(config);

(async () => {
    const port = await getPort();