module.exports = {
    name: 'inviteDelete',
    async execute(invite) {
        // Delete the Invite from Cache
        global.invites.get(invite.guild.id).delete(invite.code);
    }
};