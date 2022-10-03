const { Client } = require('discord.js');
const { modRole, adminRole } = require('../config.json');

module.exports = {
     userIsAdmin: async function (member) {
         //if (user.)
             if (member.roles.cache.find(r => r.id === adminRole))
            return true;
         return false;
     },

    userIsMod: async function (member) {
        //if (user.)
        if (member.roles.cache.find(r => r.id === modRole))
            return true;
        return false;
    }
};