module.exports = {
    name: 'inviteCreate',
    async execute(invite) {
        // Update cache on new invites
        global.invites.get(invite.guild.id).set(invite.code, invite.uses);
    }
};