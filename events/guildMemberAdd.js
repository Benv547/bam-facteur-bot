const userDB = require("../database/user");
const inviteDB = require("../database/invite");
const {join, vipRole} = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");
const xpAction = require("../utils/xpAction");
const orAction = require("../utils/orAction");

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // To compare, we need to load the current invite list.
            const newInvites = await member.guild.invites.fetch()
            // This is the *existing* invites for the guild.
            const oldInvites = global.invites.get(member.guild.id);
            // Look through the invites, find the one for which the uses went up.
            const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
            // This is just to simplify the message being sent below (inviter doesn't have a tag property)

            // Fetch sanctions channel by id
            const channel = await member.guild.channels.fetch(join);

            if ((invite !== null || invite !== undefined) && invite.inviter !== null) {
                try {
                    if (await userDB.getUser(member.id) === null) {
                        // Create a new user in the database.
                        await userDB.createUser(member.id, 0, 0);

                        if (await userDB.getUser(invite.inviter.id) == null) {
                            // Add the user to the database
                            await userDB.createUser(invite.inviter.id, 0, 0);
                        }

                        // Increment the number of invitations of the inviter.
                        await inviteDB.insertInvite(invite.inviter.id, member.id);

                        // If number of invite of a user is equal to 5, give the role VIP
                        const nbInvites = await inviteDB.getNumberOfInvite(invite.inviter.id);
                        if (parseInt(nbInvites) === 5) {
                            // Add role to the inviter
                            const inviter = await member.guild.members.fetch(invite.inviter.id);
                            await inviter.roles.add(vipRole);
                            await userDB.set_vip(inviter.id, true);

                            try {
                            // Send message to the inviter
                                await invite.inviter.send({
                                    content: '',
                                    embeds: [createEmbeds.createFullEmbed('Une very importante personne !', 'Vous avez atteint le nombre d\'invitation nécessaire pour obtenir **le rôle VIP** !', null, null, 0x2f3136, null)]
                                });
                            } catch {}
                        }

                        if (!invite.inviter.bot) {
                            await xpAction.increment(member.guild, invite.inviter.id, 100);
                            await orAction.increment(invite.inviter.id, 250);
                        }

                        try {
                            // Send message to the inviter
                            await invite.inviter.send({
                                content: '',
                                embeds: [createEmbeds.createFullEmbed('Plus un !', 'Vous avez invité une nouvelle personne sur le serveur.\nVous avez gagné **250** <:piece:1045638309235404860> et de l\'<:xp:851123277497237544>.', null, null, 0x2f3136, null)]
                            });
                        } catch {}
                    }

                    // Send message
                    await channel.send({
                        content: '',
                        embeds: [createEmbeds.createFullEmbed('Nouveau membre', 'L\'utilisateur ' + member.toString() + ' a rejoint le serveur grâce à l\'invitation de ' + invite.inviter.toString() + '\nNous sommes désormais **' + member.guild.memberCount + ' membres** sur le serveur !', null, null, 0x2f3136, null)]
                    });
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    // Send message
                    await channel.send({
                        content: '',
                        embeds: [createEmbeds.createFullEmbed('Nouveau membre', 'L\'utilisateur ' + member.toString() + ' a rejoint le serveur !\nNous sommes désormais **' + member.guild.memberCount + ' membres** sur le serveur !', null, null, 0x2f3136, null)]
                    });
                } catch (e) {
                    console.log(e);
                }
            }
            newInvites.each(inv => oldInvites.set(inv.code, inv.uses));
            global.invites.set(member.guild.id, oldInvites);
        } catch (e) {
            console.log(e);
        }
    }
};