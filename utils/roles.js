const { modRole, adminRole, vipRole, boostRole, apprentiRole } = require('../config.json');

module.exports = {
     userIsAdmin: async function (member) {
         if (member.roles.cache.find(r => r.id === adminRole))
            return true;
         return false;
     },

    userIsMod: async function (member) {
        if (member.roles.cache.find(r => r.id === modRole))
            return true;
        return false;
    },

    userIsVip: async function (member) {
         if (member.roles.cache.find(r => r.id === vipRole))
            return true;
        return false;
    },

    userIsBooster: async function (member) {
        if (member.roles.cache.find(r => r.id === boostRole))
            return true;
        return false;
    },

    userIsApprenti: async function (member) {
        if (member.roles.cache.find(r => r.id === apprentiRole))
            return true;
        return false;
    }
};