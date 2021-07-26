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

    swarm.listen(port);
    console.log(`Listening port: ${port}`);

    swarm.join(channel);
    swarm.on('connection', (conn, info) => {
        const seq = connSeq;
        const peerId = info.id.toString('hex');
        console.log(`connected #${seq} to peer: ${peerId}`);
        if (info.initiator) {
            try {
                conn.setKeepAlive(true, 600);
            } catch (exception) {
                console.log('exception', exception);
            }
        }
        conn.on('data', data => {
            let message = JSON.parse(data);
            console.log('---------------------------Received Message Start---------------------');
            console.log(
                `from: ${peerId.toString('hex')}`,
                `to: ${peerID.toString(message.to)}`,
                `my: ${peerId.toString('hex')}`,
                `type: ${JSON.stringify(message.type)}`
            );
            console.log('---------------------------Received Message End------------------------');
        });
        conn.on('close', () => {
            console.log(`Connection ${seq} closed, peerId:
        ${peerId}`);
            if (peers[peerId].seq === seq) {
                delete peers[peerId]
            }
        });

        if (!peers[peerId]) {
            peers[peerId] = {}
        }
        peers[peerId].conn = conn;
        peers[peerId].seq = seq;
        connSeq++
    })
})();

setTimeout(function(){
    writeMessageToPeers('hello', null);
}, 10000);

writeMessageToPeers = (type, data) => {
    for (let id in peers) {
       console.log('---------------------------writeMessageToPeers start-------------------------');
       console.log(`type: ${type} , to: ${toId}`);
       console.log('---------------------------writeMessageToPeers end---------------------------');
       sendMessage(id, type, data);
    }
};

writeMessageToPeerId = (toId, type, data) => {
    for (let id in peers) {
        if (id === told) {
            console.log('------------------------------writeMessageToPeerToId start----------------------------');
            console.log(`type: ${type} , to: ${toId}`);
            console.log('------------------------------writeMessageToPeerToId end------------------------------');
            sendMessage(id, type, data);
        }
    }
};

sendMessage = (id, type, data) => {
    peers[id].conn.write(JSON.stringify(
        {
            to: id,
            from: myPeerId,
            type: type,
            data: data
        }
    ));
};

