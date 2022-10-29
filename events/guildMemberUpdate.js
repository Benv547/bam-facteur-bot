const {memberRole} = require('../config.json');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        try{
            if (oldMember.pending && !newMember.pending) {
                // add the role!
                newMember.roles.add(memberRole);
            }
        } catch (e) {
            console.log(e);
        }
    }
};