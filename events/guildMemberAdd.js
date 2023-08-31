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
                                    embeds: [createEmbeds.createFullEmbed('A very important person!', 'You have reached the number of invitations needed to get **the VIP role**!', null, null, 0x2f3136, null)]
                                });
                            } catch {}
                        }

                        await xpAction.increment(member.guild, invite.inviter.id, 100);
                        await orAction.increment(invite.inviter.id, 250);

                        try {
                            // Send message to the inviter
                            await invite.inviter.send({
                                content: '',
                                embeds: [createEmbeds.createFullEmbed('One more!', 'You have invited a new person on the server.\nYou have won **250** <:gold:1058066245154525265> and <:xp:1058066266797113455>.', null, null, 0x2f3136, null)]
                            });
                        } catch {}
                    }

                    // Send message
                    await channel.send({
                        content: '',
                        embeds: [createEmbeds.createFullEmbed('New member', 'The user ' + member.toString() + ' has joined the server thanks to the invitation of ' + invite.inviter.toString() + '\nWe are now **' + member.guild.memberCount + ' members** in the server!', null, null, 0x2f3136, null)]
                    });
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    // Send message
                    await channel.send({
                        content: '',
                        embeds: [createEmbeds.createFullEmbed('New member', 'The user ' + member.toString() + ' has joined the server!\nWe are now **' + member.guild.memberCount + ' members** in the server!', null, null, 0x2f3136, null)]
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