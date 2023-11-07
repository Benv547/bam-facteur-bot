const stickyDB = require("../database/sticky");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const recordDB = require("../database/record");
const achievementDB = require("../database/achievement");
const stickerDB = require("../database/sticker");
const message_ileDB = require("../database/message_ile");
const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const birdDB = require("../database/bird");
const wantedDB = require("../database/wanted");
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { guildId, anniversaireRole, treasure, adminRole, memberRole, vipRole, boostRole, wantedChannel, afkRole, ile, treasureRole } = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");
const user_ileDB = require("../database/user_ile");
const orAction = require("../utils/orAction");

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

            const usersToRemove = [];
            const users = await userDB.getUsersWhenDateTreasureIsOlderThan20Min();
            if (users !== null || users.length > 0) {
                users.forEach((user) => {
                    usersToRemove.push(user.id_user);
                });
            }

            let maxGuildSize = 20;
            let maxEnterSize = 5;
            let membersLeaved = [];
            while (usersToRemove.length > 0) {
                try {
                    const member_id = usersToRemove.pop();
                    await userDB.remove_date_treasure(member_id);
                    const member = await guild.members.fetch(member_id);
                    if (member !== null) {
                        // remove permission to see the channel
                        await channel.permissionOverwrites.delete(member_id);
                        membersLeaved.push(member.user.username);
                    }
                }
                catch { }
            }
            let text = `** **\n🚣️ Les illustres **${membersLeaved.join(", ")}** ont été éjecté•e de l'île !`;
            if (membersLeaved.length > 0) {
                await channel.send(text);
            }

            // if channel members length is > to 5% of the guild members length
            // not count bots and admins
            let channelSize = await userDB.getNumberOfUsersHasTreasureDateNotNull();

            let membersArrived = [];
            while (channelSize <= maxGuildSize && maxEnterSize > 0) {
                // choose a non bot member in the guild
                const member = (await guild.members.fetch()).filter((member) => !member.user.bot && member.presence != null && member.roles.cache.has(memberRole) && !member.roles.cache.has(afkRole) && member.roles.cache.size > 2).random();
                // if member is not null
                if (member !== null) {
                    // add permission to see the channel but not send messages
                    await channel.permissionOverwrites.edit(member, { ViewChannel: true, SendMessages: false });

                    // if member have the role treasure or no
                    if (member.roles.cache.has(treasureRole)) {
                        membersArrived.push(member);
                    } else {
                        membersArrived.push(member.user.username);
                    }
                    await userDB.set_date_treasure(member.id, new Date());
                }
                channelSize++;
                maxEnterSize--;
            }
            text = `** **\n🏝️Les illustres **${membersArrived.join(", ")}** ont rejoint l'île !`;
            if (membersArrived.length > 0) {
                await channel.send(text);
            }

            // choose random number between 1 and 100
            const random = Math.floor(Math.random() * 100) + 1;
            if (random < 3) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasure_carnet')
                            .setLabel('Ouvrir le carnet')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('', 'Un **carnet** a été trouvé sur la plage, **ouvrez-le vite** !', null, null, 0x2F3136, null);
                await channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (random < 6) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasure_sable')
                            .setLabel('Creuser dans le sable')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('', 'Un **tas de sable** a été trouvé sur la plage, **creusez vite** !', null, null, 0x2F3136, null);
                await channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (random < 10) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasure_coffre')
                            .setLabel('Ouvrir le coffre')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('', 'Un **coffre** a été trouvé sur la plage, **ouvrez-le vite** !', null, null, 0x2F3136, null);
                await channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (random < 40) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasure_valise')
                            .setLabel('Défaire la valise')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('', 'Une **valise** a été trouvée sur la plage, **ouvrez-la vite** !', null, null, 0x2F3136, null);
                await channel.send({ content: '', embeds: [embed], components: [row] });
            } else {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('treasure_botte')
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
                } catch (error) {
                    console.error(error);
                }
            }
            setTimeout(checkSticky, 1000 * 60 * 5);
        }
        checkSticky();

        checkBottle = async () => {
            //console.log(new Date().toLocaleString() + " - Checking bottles...");

            const bottles = await bottleDB.getAllBottleHasOnlyOneMessageFromThreeHoursAndNotArchivedAndNotTerminated();
            if (bottles !== null) {
                for (let i = 0; i < bottles.length; i++) {
                    try {
                        const guild = await client.guilds.fetch(bottles[i].id_guild);
                        const channel = await guild.channels.fetch(bottles[i].id_channel);

                        const nb = await bottleDB.get_sea(channel.id);
                        // TODO: get author
                        const b = await bottleDB.getBottle(channel.id);
                        const sender_id = b.id_user_author;
                        const receiver_id = b.id_user_recipient;
                        // TODO: get original message
                        const original_message = await messageDB.getFirstMessage(channel.id);
                        if (nb < 15) {
                            await bottle.create(guild, sender_id, original_message, nb + 1);
                        }
                        else {
                            try {
                                await bottle.flow(guild, sender_id, original_message);
                            } catch { }
                        }
                        await userDB.incr_afk_number(receiver_id);
                        if (await userDB.get_afk_number(receiver_id) >= 5) {
                            const user = await guild.members.fetch(receiver_id);
                            await user.roles.add(afkRole);
                            // Create Embed AFK
                            const embedAFK = createEmbeds.createFullEmbed("Tu nous manques..", 'Tu as été mis en mode AFK sur le serveur [Bouteille à la mer](https://discord.gg/bouteille) car tu as râté un tas de bouteilles !\nReviens nous voir, nous serons ravis de te retrouver.. *Tu peux enlever ton mode AFK en executant la commande `/afk`.*', null, null, null, null);
                            // Send Embed AFK
                            await user.send({ content: '', embeds: [embedAFK] });
                        }
                        await messageDB.deleteAllMessagesOfBottle(channel.id);
                        await bottleDB.deleteBottle(channel.id);
                        await channel.delete();
                    } catch (error) {
                        console.log(error);
                        await bottleDB.setBottleArchived(bottles[i].id_channel);
                        await bottleDB.setBottleTerminated(bottles[i].id_channel);
                        continue;
                    }
                }
            }

            const wanteds = await wantedDB.getWantedFromThreeHoursAndNotArchived();
            if (wanteds !== null) {
                for (let i = 0; i < wanteds.length; i++) {
                    try {
                        const guild = await client.guilds.fetch(wanteds[i].id_guild);
                        const channel = await guild.channels.fetch(wanteds[i].id_channel);
                        await channel.delete();

                        const wChannel = await guild.channels.fetch(wantedChannel);
                        const message = await wChannel.messages.fetch(wanteds[i].id_message);
                        await message.delete();

                        try {
                            const sender = await guild.members.fetch(wanteds[i].id_user);
                            //Crée l'embed
                            const embedFlow = createEmbeds.createFullEmbed("Votre recherche a été supprimée", 'Vous n\'avez pas répondu à l\'une de vos réponses de votre avis de recherche dans les **48h** après sa publication et votre avis de recherche a été supprimé.', null, null, null, null);
                            //Envoie l'embed crée à l'utilisateur
                            await sender.send({ content: '', embeds: [embedFlow] });
                        } catch { }

                        await wantedDB.setArchived(wanteds[i].id_channel);
                        await wantedDB.set_id_channel_null(wantedsArchived[i].id_channel);
                    } catch (error) {
                        console.log(error);
                        await wantedDB.setArchived(wanteds[i].id_channel);
                        await wantedDB.set_id_channel_null(wantedsArchived[i].id_channel);
                        continue;
                    }
                }
            }

            const wantedsArchived = await wantedDB.getWantedFromThreeHoursAndArchived();
            if (wantedsArchived !== null) {
                for (let i = 0; i < wantedsArchived.length; i++) {
                    try {
                        const guild = await client.guilds.fetch(wantedsArchived[i].id_guild);
                        const channel = await guild.channels.fetch(wantedsArchived[i].id_channel);
                        // get last message of the channel
                        const lastMessageOfChannel = await channel.messages.fetch({ limit: 1 });
                        // if the last message is older than 48h
                        const now = new Date();
                        if (lastMessageOfChannel.first().createdTimestamp + 48 * 60 * 60 * 1000 > now.getTime()) {
                            await channel.delete();
                            try {
                                const sender = await guild.members.fetch(wantedsArchived[i].id_user);
                                //Crée l'embed
                                const embedFlow = createEmbeds.createFullEmbed("L'avis de recherche a été supprimé", "Votre avis de recherche a été supprimé car il n'y a pas eu d'activité dessus depuis plus de **48h**.", null, null, null, null);
                                //Envoie l'embed crée à l'utilisateur
                                await sender.send({ content: '', embeds: [embedFlow] });
                            } catch { }
                            await wantedDB.set_id_channel_null(wantedsArchived[i].id_channel);
                        }

                    } catch (error) {
                        console.log(error);
                        await wantedDB.set_id_channel_null(wantedsArchived[i].id_channel);
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
                        await channel.delete();

                        if (birds[i].sea < 10) {
                            await bottle.createBird(guild, birds[i].id_user, birds[i].content, birds[i].sea + 1, birds[i].id_bird);
                        } else {
                            await bottle.flowBird(guild, birds[i].id_channel);
                        }
                    } catch (error) {
                        console.log(error);
                        await birdDB.setArchived(birds[i].id_bird);
                        continue;
                    }
                }
            }

            const guild = await client.guilds.fetch(guildId);
            const places = await bottle.getNumberOfSpacesInNewBottles(guild);

            if (places > 0) {
                console.log(new Date().toLocaleString() + " - Unarchive " + places + " new bottles...");
                const bottlesArchived = await bottleDB.getAllBottleHasOnlyOneMessageAndArchivedAndNotTerminatedRandomized(places);
                if (bottlesArchived !== null) {
                    for (let i = 0; i < bottlesArchived.length; i++) {
                        try {
                            const channeId = bottlesArchived[i].id_channel;
                            const nb = await bottleDB.get_sea(channeId);
                            const sender_id = await bottleDB.getReceiver(channeId);
                            // TODO: get original message
                            const original_message = await messageDB.getFirstMessage(channeId);
                            if (nb < 7) {
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

            global.semaphore = [];
            setTimeout(checkBottle, 1000 * 60 * 60 * 1);
        };
        checkBottle();




        checkAchievement = async () => {
            // console.log(new Date().toLocaleString() + " - Checking achievements...");

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
                                const embed = createEmbeds.createFullEmbed(`Vous avez reçu le trophée **${achievements[i].name}** !\n${textSticker}`, `${achievements[i].description}`, null, sticker.id_sticker.url, null, null);
                                try {
                                    await achievementDB.giveAchievementToUser(id_users[j].id_user, achievements[i].id_achievement);
                                    await user.send({ content: '', embeds: [embed] });
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
                //console.log(new Date().toLocaleString() + " - Checking anniversaires...");
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
                        try {
                            const OR_ANNIV = 150
                            const memberId = users[i].id_user;
                            const member = await guild.members.fetch(memberId);

                            await member.roles.add(anniversaireRole);
                            await orAction.increment(memberId, OR_ANNIV); // give or to the user

                            const embedAnniv = createEmbeds.createFullEmbed("🎂 Joyeux anniversaire !", `C'est aujourd'hui ton anniversaire ! Tient, voilà ${OR_ANNIV} pièces d'or pour fêter ça. \nProfite et passe du bon temps sur Bouteille à la mer ! 😉`, null, null, 0x6BB3F2, null);
                            // Send an MP message to the sender

                            await member.send({ content: '', embeds: [embedAnniv] });
                        } catch { }
                    }
                }

                const ileChannel = await client.channels.fetch(ile);
                if (ileChannel.name !== '🏝│île_facteur') {
                    await ileChannel.setName('🏝│île_facteur');
                }

                await user_ileDB.deleteAllUser();
                await message_ileDB.deleteMessageFromPastDay();
            }


            setTimeout(checkAnniversaire, 1000 * 60 * 60 * 1);
        };
        checkAnniversaire();
    },
};