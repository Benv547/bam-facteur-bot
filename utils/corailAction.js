const userDB = require("../database/user");

module.exports = {
    name: 'orAction',
    async increment(userId, qte) {
        const user = await userDB.getUser(userId);
        if (user) {
            await userDB.incr_corail(userId, qte);
            return true;
        }
        return false;
    },
    async get(userId) {
        const user = await userDB.getUser(userId);
        if (user) {
            return user.corail;
        }
        return null;
    },
    async reduce(userId, qte) {
        const user = await userDB.getUser(userId);
        if (user) {
            if (user.corail >= qte) {
                await userDB.reduce_corail(userId, qte);
                await userDB.incr_corail_spent(userId, qte);
                return true;
            }
        }
        return false;
    }
};