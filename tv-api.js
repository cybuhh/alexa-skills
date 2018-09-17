const { promisify } = require('util');
const SamsungRemote = require('samsung-remote');

module.exports = (ip) => {
    const remote = new SamsungRemote({ ip });
    const isAlive = promisify(remote.isAlive);
    const send = promisify(remote.send);
    
    return {
        isAlive: () => {
            try {
                isAlive();
                return true;
            } catch (e) {
                return false;
            }
        },
        poweroff: () => send('KEY_POWERON'),
    }
}