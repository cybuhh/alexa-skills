const { promisify } = require('util');
const SamsungRemote = require('samsung-remote');

module.exports = (ip) => {
    const remote = new SamsungRemote({ ip });
    const isAlive = promisify(remote.isAlive).bind(remote);
    const send = promisify(remote.send).bind(remote);
    
    return {
        isAlive: () => {
            try {
                isAlive();
                return true;
            } catch (e) {
                return false;
            }
        },
        powerOff: () => send('KEY_POWEROFF'),
    }
};
