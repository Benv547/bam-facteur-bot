const stickyDB = require("../database/sticky");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const recordDB = require("../database/record");
const achievementDB = require("../database/achievement");
const stickerDB = require("../database/sticker");
const message_ileDB = require("../database/message_ile");
const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { guildId, anniversaireRole, treasure, adminRole, vipRole, boostRole } = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");
const user_ileDB = require("../database/user_ile");

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

        const checkTreasure = async () => {
            //console.log(new Date().toLocaleString() + " - Checking treasures messages...");

            // fetch guild
            const guild = await client.guilds.fetch(guildId);
            // fetch channel treasure
            let channel = await guild.channels.fetch(treasure);

            // if channel members length is > to 5% of the guild members length
            // not count bots and admins
            let channelSize = channel.members.filter((member) => !member.user.bot && !member.roles.cache.has(adminRole)).size;
            let guildSize = 40;
            while (channelSize > guildSize) {
                const members = await channel.members.filter((member) => !member.user.bot && !member.roles.cache.has(adminRole));
                const memberWithoutPresence = members.filter((member) => member.presence === null);
                try {
                    // choose a non bot member in the channel
                    let member = null;
                    if (memberWithoutPresence.size > 0) {
                        member = memberWithoutPresence.random();
                    } else {
                        member = members.random();
                    }

                    // if member is not null
                    if (member !== undefined && member !== null) {
                        // remove permission to see the channel
                        await channel.permissionOverwrites.delete(member);
                        await channel.send(`** **\n🚣 L'illustre **${member.user.username}** a été éjecté•e de l'île !`);
                    }

                    channel = await guild.channels.fetch(treasure);
                } catch (error) {
                    console.log(error);
                }
                channelSize--;
            }
            while (channelSize <= guildSize) {
                // choose a non bot member in the guild
                const member = (await guild.members.fetch()).filter((member) => !member.user.bot && member.presence != null).random();
                // if member is not null
                if (member !== null) {
                    // add permission to see the channel but not send messages
                    await channel.permissionOverwrites.edit(member, {ViewChannel: true, SendMessages: false});

                    // if member is online or idle
                    if (member.presence != null && member.presence.status === "online") {
                        await channel.send(`** **\n🏝️ Bienvenue, illustre ${member}, sur l'île !`);
                    } else {
                        await channel.send(`** **\n🏝️ L'illustre **${member.user.username}** a débarqué sur l'île !`);
                    }
                }
                channelSize++;
            }

            // choose random number between 1 and 100
            const random = Math.floor(Math.random() * 100) + 1;
            if (random < 10) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasureCoffre')
                            .setLabel('Ouvrir le coffre')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('', 'Un **coffre** a été trouvé sur la plage, **ouvrez-le vite** !', null, null, 0x2F3136, null);
                await channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (random < 40) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasureValise')
                            .setLabel('Défaire la valise')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('', 'Une **valise** a été trouvée sur la plage, **ouvrez-la vite** !', null, null, 0x2F3136, null);
                await channel.send({ content: '', embeds: [embed], components: [row] });
            } else {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasureBotte')
                            .setLabel('Vider la botte')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('', 'Une **botte** a été trouvée sur la plage, **ouvrez-la vite** !', null, null, 0x2F3136, null);
                await channel.send({ content: '', embeds: [embed], components: [row] });
            }

            setTimeout(checkTreasure, 1000 * 60 * 5);
        }
        checkTreasure();

        const checkSticky = async () => {
            console.log(new Date().toLocaleString() + " - Checking sticky messages...");

            const stickies = await stickyDB.getAllStickies();

            if (stickies !== null) {
                try {
                    for (let i = 0; i < stickies.length; i++) {
                        const guild = await client.guilds.fetch(stickies[i].id_guild);
                        const channel = await guild.channels.fetch(stickies[i].id_channel);
                        const message = await channel.messages.fetch(stickies[i].id_message);
                        const lastReply = await channel.messages.fetch(stickies[i].id_lastReply);

                        // Get last message of the channel
                        const lastMessageOfChannel = await channel.messages.fetch({limit: 1});
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
                } catch (error) {
                    console.error(error);
                }
            }
            setTimeout(checkSticky, 1000 * 60 * 5);
        }
        checkSticky();

        checkBottle = async () => {
            console.log(new Date().toLocaleString() + " - Checking bottles...");

            const bottles = await bottleDB.getAllBottleHasOnlyOneMessageFromSixHoursAndNotArchived();
            if (bottles !== null) {
                for (let i = 0; i < bottles.length; i++) {
                    try {
                        const guild = await client.guilds.fetch(bottles[i].id_guild);
                        const channel = await guild.channels.fetch(bottles[i].id_channel);

                        const nb = await bottleDB.get_sea(channel.id);
                        // TODO: get author
                        const sender_id = await bottleDB.getReceiver(channel.id);
                        // TODO: get original message
                        const original_message = await messageDB.getFirstMessage(channel.id);
                        if (nb < 10) {
                            // TODO: recreate a new bottle with the same content
                            await bottle.create(guild, sender_id, original_message, nb + 1);
                        }
                        else {
                            await bottle.flow(guild, sender_id, original_message);
                        }
                        await messageDB.deleteAllMessagesOfBottle(channel.id);
                        await bottleDB.deleteBottle(channel.id);
                        await channel.delete();
                    } catch (error) {
                        console.log(error);
                        await bottleDB.deleteBottle(bottles[i].id_channel);
                        continue;
                    }
                }
            }

            const birds = await birdDB.getAllBirdAfterOneHour();
            if (birds !== null) {
                for (let i = 0; i < birds.length; i++) {
                    try {
                        const guild = await client.guilds.fetch(birds[i].id_guild);
                        const channel = await guild.channels.fetch(birds[i].id_channel);

                        if (birds[i].sea < 10) {
                            await bottle.createBird(guild, birds[i].id_user, birds[i].content, birds[i].sea + 1, birds[i].id_bird);
                        } else {
                            await bottle.flowBird(guild, birds[i].id_channel);
                        }

                        await channel.delete();
                    } catch (error) {
                        console.log(error);
                        await birdDB.deleteBird(birds[i].id_channel);
                        continue;
                    }
                }
            }

            const guild = await client.guilds.fetch(guildId);
            const places = await bottle.getNumberOfSpacesInNewBottles(guild);

            if (places > 0) {
                const bottlesArchived = await bottleDB.getAllBottleHasOnlyOneMessageAndArchivedRandomized(places);
                if (bottlesArchived !== null) {
                    for (let i = 0; i < bottlesArchived.length; i++) {
                        try {
                            const channeId = bottlesArchived[i].id_channel;
                            const nb = await bottleDB.get_sea(channeId);
                            const sender_id = await bottleDB.getReceiver(channeId);
                            // TODO: get original message
                            const original_message = await messageDB.getFirstMessage(channeId);
                            if (nb < 10) {
                                // TODO: recreate a new bottle with the same content
                                await bottle.create(guild, sender_id, original_message, nb + 1);
                            } else {
                                await bottle.flow(guild, sender_id, original_message);
                            }
                            await bottleDB.deleteBottle(channeId);
                        } catch (error) {
                            console.log(error);
                            await bottleDB.deleteBottle(bottlesArchived[i].id_channel);
                            continue;
                        }
                    }
                }
            }

            setTimeout(checkBottle, 1000 * 60 * 60 * 1);
        };
        checkBottle();




        checkAchievement = async () => {
            console.log(new Date().toLocaleString() + " - Checking achievements...");

            const achievements = await achievementDB.getAllAchievements();

            if (achievements !== null) {
                for (let i = 0; i < achievements.length; i++) {
                    try {
                        let value;
                        let id_users;
                        switch (achievements[i].type) {
                            case 'bottleSend':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXBottlesSent(achievements[i].id_achievement, value);
                                break;
                            case 'bottleReceive':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXBottlesReceived(achievements[i].id_achievement, value);
                                break;
                            case 'messageSend':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXMessagesSent(achievements[i].id_achievement, value);
                                break;
                            case 'messageLength':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXMessageLength(achievements[i].id_achievement, value);
                                break;
                            case 'messageContains':
                                value = achievements[i].value;
                                id_users = await achievementDB.achievementXMessageContains(achievements[i].id_achievement, value);
                                break;
                            case 'userInvited':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXUsersInvited(achievements[i].id_achievement, value);
                                break;
                            case 'userMoneySpent':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXMoneySpent(achievements[i].id_achievement, value);
                                break;
                            case 'userMoneyEarned':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXMoney(achievements[i].id_achievement, value);
                                break;
                            case 'userNbTreasures':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXNbTreasures(achievements[i].id_achievement, value);
                                break;
                            case 'suggestionSent':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXSuggestionsSent(achievements[i].id_achievement, value);
                                break;
                            case 'opinionSent':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXOpinionsSent(achievements[i].id_achievement, value);
                                break;
                            case 'vipUserInvited':
                                value = parseInt(achievements[i].value);
                                id_users = await achievementDB.achievementXVIPUsersInvited(achievements[i].id_achievement, value);
                                break;
                        }
                        const sticker = await stickerDB.getSticker(achievements[i].id_sticker);
                        if (id_users !== null) {
                            for (let j = 0; j < id_users.length; j++) {
                                const user = await client.users.fetch(id_users[j].id_user);
                                let textSticker = '';
                                if (sticker !== null) {
                                    await stickerDB.giveStickerToUser(id_users[j].id_user, sticker.id_sticker, guildId);
                                    textSticker = 'En plus, vous avez reçu le sticker **' + sticker.name + '**.';
                                }
                                const embed = createEmbeds.createFullEmbed(`Vous avez reçu le trophée **${achievements[i].name}** !\n${textSticker}`, `${achievements[i].description}`, null, null, null, null);
                                try {
                                    await achievementDB.giveAchievementToUser(id_users[j].id_user, achievements[i].id_achievement);
                                    await user.send({content: '', embeds: [embed]});
                                } catch {
                                }
                            }
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            setTimeout(checkAchievement, 1000 * 60 * 30);
        };
        checkAchievement();



        checkAnniversaire = async () => {
            const now = new Date();
            if (now.getHours() == 0) {
                console.log(new Date().toLocaleString() + " - Checking anniversaires...");
                // Fetch guild
                const guild = await client.guilds.fetch(guildId);

                // Fetch members length
                let members = await guild.members.fetch();
                const membersLength = members.size;
                await recordDB.insertRecord(membersLength, 'user');

                // Fetch members with the VIP role
                let membersWithVipRole = await guild.roles.fetch(vipRole);
                const membersWithVipRoleLength = membersWithVipRole.members.size;
                await recordDB.insertRecord(membersWithVipRoleLength, 'vip');

                // Fetch members with the Booster role
                let membersWithBoosterRole = await guild.roles.fetch(boostRole);
                const membersWithBoosterRoleLength = membersWithBoosterRole.members.size;
                await recordDB.insertRecord(membersWithBoosterRoleLength, 'boost');

                // Remove all anniversaire roles
                members = members.filter((member) => member.roles.cache.has(anniversaireRole));
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
                        try {
                            await member.send({ content: '', embeds: [embedUser] }); // TO DO : Faire un bouton (réclamer sticker anniversaire) components: [rowUser]
                        } catch {}
                    }
                }

                await user_ileDB.deleteAllUser();
                await message_ileDB.deleteMessageFromPastDay();
            }


            setTimeout(checkAnniversaire, 1000 * 60 * 60 * 1);
        };
        checkAnniversaire();
    },
};