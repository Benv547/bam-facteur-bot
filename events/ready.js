const stickyDB = require("../database/sticky");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const { Collection } = require("discord.js");
const { guildId, anniversaireRole } = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        client.guilds.cache.forEach(async (guild) => {
            // Fetch all Guild Invites
            const firstInvites = await guild.invites.fetch();
            // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
            global.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
        });

        const checkSticky = async () => {
            console.log(new Date().toLocaleString() + " - Checking sticky messages...");

            const stickies = await stickyDB.getAllStickies();

            if (stickies !== null) {
                for (let i = 0; i < stickies.length; i++) {
                    const guild = await client.guilds.fetch(stickies[i].id_guild);
                    const channel = await guild.channels.fetch(stickies[i].id_channel);
                    const message = await channel.messages.fetch(stickies[i].id_message);
                    const lastReply = await channel.messages.fetch(stickies[i].id_lastReply);

                    // Get last message of the channel
                    const lastMessageOfChannel = await channel.messages.fetch({ limit: 1 });
                    // if the last message of the channel is the last message of the sticky
                    if (lastReply === null || lastMessageOfChannel.first().id !== lastReply.id) {
                        // if the last message as be posted more than 5 minutes ago from now
                        const now = new Date();
                        if (lastMessageOfChannel.first().createdTimestamp + 5 * 60 * 1000 < now.getTime()) {
                            // delete old reply
                            if (lastReply !== null) {
                                try {
                                    await lastReply.delete();
                                } catch (error) {
                                    console.error(error);
                                }
                            }

                            // send new reply
                            const newLastReply = await channel.send({
                                content: message.content,
                                embeds: message.embeds,
                                components: message.components
                            });

                            // save reply to database
                            await stickyDB.update_id_lastReply(channel.id, newLastReply.id);
                        }
                    }
                }
            }
            setTimeout(checkSticky, 1000 * 60 * 5);
        }
        checkSticky();

        checkBottle = async () => {
            console.log(new Date().toLocaleString() + " - Checking bottles...");

            const bottles = await bottleDB.getAllBottleHasOnlyOneMessage();

            if (bottles !== null) {
                for (let i = 0; i < bottles.length; i++) {
                    const guild = await client.guilds.fetch(bottles[i].id_guild);
                    try {
                        const channel = await guild.channels.fetch(bottles[i].id_channel);
                        // Get last message of the channel
                        const lastMessageOfChannel = await channel.messages.fetch({ limit: 1 });
                        // if the last message created timestamp is more than 6 hours ago from now
                        const now = new Date();
                        if (lastMessageOfChannel.first().createdTimestamp + 6 * 60 * 60 * 1000 < now.getTime()) {
                            const nb = await bottleDB.get_sea(channel.id);
                            // TODO: get author
                            const sender_id = await bottleDB.getReceiver(channel.id);
                            // TODO: get original message
                            const original_message = await messageDB.getFirstMessage(channel.id);
                            if (nb < 10) {
                                await bottleDB.incr_sea(channel.id);
                                // TODO: recreate a new bottle with the same content
                                const result = await bottle.create(guild, sender_id, original_message, nb + 1);
                            }
                            else {
                                await bottle.flow(guild, sender_id, original_message);
                            }
                            await messageDB.deleteAllMessagesOfBottle(channel.id);
                            await bottleDB.deleteBottle(channel.id);
                            await channel.delete();
                        }
                    } catch (error) {
                        console.log(error);
                        await bottleDB.deleteBottle(bottles[i].id_channel);
                        continue;
                    }
                }
            }
            setTimeout(checkBottle, 1000 * 60 * 60 * 1);
        };
        checkBottle();




        checkAnniversaire = async () => {
            const now = new Date();
            if (now.getHours() == 0) {
                console.log(new Date().toLocaleString() + " - Checking anniversaires...");
                // Fetch guild
                const guild = await client.guilds.fetch(guildId);

                // Remove all anniversaire roles
                const members = (await guild.members.fetch()).filter((member) => member.roles.cache.has(anniversaireRole));
                for (const member of members.values()) {
                    await member.roles.remove(anniversaireRole);
                }

                const monthDate = now.getMonth() + 1;
                const dayDate = now.getDate();
                const users = await userDB.getAnniversaire(monthDate, dayDate);

                if (users !== null) {
                    for (let i = 0; i < users.length; i++) {
                        const memberId = users[i].id_user;
                        const member = await guild.members.fetch(memberId);

                        await member.roles.add(anniversaireRole);

                        const embedUser = createEmbeds.createFullEmbed("JOYEUX ANNIVERSAIRE", '', null, null, 0x00FF00, null); // TO DO : Faire le message + ajuster couleur
                        // Send an MP message to the sender
                        await member.send({ content: '', embeds: [embedUser] }); // TO DO : Faire un bouton (réclamer sticker anniversaire) components: [rowUser] 
                    }
                }
            }


            setTimeout(checkAnniversaire, 1000 * 60 * 60 * 1);
        };
        checkAnniversaire();
    },
};