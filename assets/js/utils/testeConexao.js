const dgram = require('dgram');
const os = require('os');

function multicast(req,res) {
    const message = Buffer.from('Request Sphynx API Address');
    const netInterfaces = os.networkInterfaces();
    const port = 57128
    let responses = [];
    let pending = 0;

    // will send a packet to each network interface available in the machine
    Object.keys(netInterfaces).forEach((iface) => {
        netInterfaces[iface].forEach((address) => {
            if (address.family === 'IPv4' && !address.internal) {
                pending++;
                const client = dgram.createSocket('udp4');
                client.bind({ address: address.address }, () => {
                    client.send(message, 0, message.length, port, '239.255.255.250', (err) => {
                        if (err) {
                            console.error('Error sending datagram:', err);
                            if (--pending === 0){
                                res.status(500).send('Error sending UDP multicast');
                            }
                        } else {
                            console.log('multicast sent successfully');
                            const timeout = setTimeout(() => {
                                console.log('Request Timeout from');
                                client.close();
                                if (--pending === 0){
                                    res.send(responses);
                                }
                            }, 1000);
                    
                            client.on('message', (response) => {
                                clearTimeout(timeout)
                                console.log('Received response:', response.toString());
                                responses.push(response.toString());
                                client.close();
                                if (--pending === 0){
                                    res.send(responses);
                                }
                            });
                        }
                    });
                });
            }
        });
    });
}

module.exports = multicast;
