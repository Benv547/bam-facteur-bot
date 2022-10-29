module.exports = {
    name: 'inviteCreate',
    async execute(invite) {
        try {
            // Update cache on new invites
            global.invites.get(invite.guild.id).set(invite.code, invite.uses);
        } catch (e) {
            console.log(e);
        }
    }
};