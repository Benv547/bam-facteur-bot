const userDB = require("../database/user");
const {join, vipRole} = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        // To compare, we need to load the current invite list.
        const newInvites = await member.guild.invites.fetch()
        // This is the *existing* invites for the guild.
        const oldInvites = global.invites.get(member.guild.id);
        // Look through the invites, find the one for which the uses went up.
        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
        // This is just to simplify the message being sent below (inviter doesn't have a tag property)

        if (await userDB.getUser(member.id) === null) {
            // Increment the number of invitations of the inviter.
            await userDB.incr_nb_invite(invite.inviter.id);

            // Create a new user in the database.
            await userDB.createUser(member.id, 0, 0);
        }

        // Fetch sanctions channel by id
        const channel = await member.guild.channels.fetch(join);

        if (invite.inviter !== null) {
            try {
                // Send message
                await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('Nouveau membre', 'L\'utilisateur ' + member.toString() + ' a rejoint le serveur grâce à l\'invitation de ' + invite.inviter.toString() + '\nNous sommes désormais **' + member.guild.memberCount + ' membres** sur le serveur !', null, null, 0x2f3136, null)] });

                // If number of invite of a user is equal to 5, give the role VIP
                if (await userDB.get_nb_invite(invite.inviter.id) === 5) {
                    // Add role to the inviter
                    const inviter = await member.guild.members.fetch(invite.inviter.id);
                    await inviter.roles.add(vipRole);
                    // Send message to the inviter
                    await invite.inviter.send({ content: '', embeds: [createEmbeds.createFullEmbed('Une very importante personne !', 'Vous avez atteint le nombre d\'invitation nécessaire pour obtenir **le rôle VIP** !', null, null, 0x2f3136, null)] });
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                // Send message
                await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('Nouveau membre', 'L\'utilisateur ' + member.toString() + ' a rejoint le serveur !\nNous sommes désormais **' + member.guild.memberCount + ' membres** sur le serveur !\nSon compte a été créé il y a **' + member.user.createdAt.toDateString() + '**', null, null, 0x2f3136, null)] });
            }
            catch (e) {
                console.log(e);
            }
        }
    }
};