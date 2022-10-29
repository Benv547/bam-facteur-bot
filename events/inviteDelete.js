module.exports = {
    name: 'inviteDelete',
    async execute(invite) {
        try {
            // Delete the Invite from Cache
            global.invites.get(invite.guild.id).delete(invite.code);
        } catch (e) {
            console.log(e);
        }
    }
};