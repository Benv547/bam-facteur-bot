const {memberRole} = require('../config.json');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        if (oldMember.pending && !newMember.pending) {
            // add the role!
            newMember.roles.add(memberRole);
        }
    }
};