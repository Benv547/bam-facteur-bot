const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention } = require("discord.js");
const { newBottleCategory, newWantedCategory, conversations, newBirdChannel, afkRole, sanction } = require("../config.json");
const createEmbeds = require("./createEmbeds");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const stickerDB = require("../database/sticker");
const footerDB = require("../database/footer");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const xpAction = require("./xpAction");
const birdDB = require("../database/bird");
const sanctionDB = require("../database/sanctions");
const orAction = require("./orAction");

module.exports = {
    name: 'bottleAction',
    create: async function (guild, id_user_sender, content, nb_sea) {
        // TODO: check if message is OK (moderation, sad text, injuries, ...)

        if (content.indexOf("discord.gg") > -1) {
            await sanctionDB.saveSanction(id_user_sender, null, "warn", "AutoMod : Pub");

            const channel = await guild.channels.fetch(sanction);
            await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('warn', 'L\'utilisateur ' + userMention(id_user_sender) + ' a été warn par l\'**AutoMod** pour cause de **Publicité**', null, null, 0x2f3136, null)] });

            const embed = createEmbeds.createFullEmbed('Vous avez été averti•e', 'Une de vos actions a été jugée comme inappropriée par l\'AutoMod pour la raison suivante : **Publicité**', null, null, 0x2f3136, null);

            const user = await guild.members.fetch(id_user_sender);
            user.send({ content: "", embeds: [embed] });
            return
        }

        const senderMember = await guild.members.fetch(id_user_sender);
        if (senderMember === null) {
            return;
        }

        if (nb_sea === 0) {
            await userDB.set_date_bottle(id_user_sender, new Date());
        }

        let sender = await userDB.getUser(id_user_sender);
        if (sender === null) {
            await userDB.createUser(id_user_sender, 0, 0);
            sender = await userDB.getUser(id_user_sender);
        }

        const color = await stateAndColorDB.getRandomColor();
        const state = await stateAndColorDB.getRandomState();
        const emoji = await stateAndColorDB.getRandomEmoji();
        const channel_name = emoji + "│bouteille-" + color + "-" + state;

        // TODO: create channel
        const everyoneRole = guild.roles.everyone;
        var channel = await guild.channels.create({
            name: channel_name,
            type: ChannelType.GuildText
        })
        await channel.permissionOverwrites.edit(everyoneRole.id, { ViewChannel: false, SendMessages: false });

        // TODO: move channel to "nouvelles bouteilles"
        const category = (await guild.channels.fetch()).find(c => c.id == newBottleCategory);

        // While number of channels in category is more than 45
        while (category.children.cache.size > 45) {
            try {
                const channelToDelete = category.children.cache.first();
                // Set archive to true
                await bottleDB.setBottleArchived(channelToDelete.id);
                // Delete channel
                await channelToDelete.delete();
            } catch (error) {
                console.error(error);
            }
        }

        await channel.setParent(category);

        // edits overwrites to disallow everyone to view the channel
        await channel.permissionOverwrites.edit(guild.id, { ViewChannel: false, SendMessages: false });

        // edits overwrites to allow a user to view the channel
        // Fetch all members
        const members = await (await guild.members.fetch()).filter(m => !m.user.bot && m.id !== id_user_sender && m.presence != null && m.id !== id_user_sender && !m.roles.cache.has(afkRole));
        const limit = Math.min(5, members.size);
        for (let i = 0; i < limit; i++) {
            const randMember = members.random();
            console.log(randMember.user.username);
            if (await userDB.getUser(randMember.id) === null) {
                await userDB.createUser(randMember.id, 0, 0);
            }
            await channel.permissionOverwrites.edit(randMember.id, { ViewChannel: true, SendMessages: false });
            const sticker = await stickerDB.getSticker(sender.id_sticker);
            if (sticker !== null) {
                if (sticker.sharable) {
                    // choose random float between 0 and 1
                    const randFloat = Math.random();
                    if (randFloat < sticker.sharable_percentage) {
                        // share sticker
                        try {
                            await stickerDB.giveStickerToUser(randMember.id, sticker.id_sticker, guild.id);
                            const embed = createEmbeds.createFullEmbed("Quelle belle trouvaille !", "L'auteur•e de la bouteille **" + channel_name + "** a partagé•e avec vous le **sticker " + sticker.name + "** !", null, null, 0x2f3136, null);
                            try {
                                await randMember.send({ content: "", embeds: [embed] });
                            } catch { }
                        } catch { }
                    }
                }
            }
            const footer = await footerDB.getFooter(sender.id_footer);
            if (footer !== null) {
                if (footer.sharable) {
                    // choose random float between 0 and 1
                    const randFloat = Math.random();
                    if (randFloat < footer.sharable_percentage) {
                        // share sticker
                        try {
                            await footerDB.giveFooterToUser(randMember.id, footer.id_footer, guild.id);
                            const embed = createEmbeds.createFullEmbed("Quelle belle trouvaille !", "L'auteur•e de la bouteille **" + channel_name + "** a partagé•e avec vous l'**arabesque " + footer.name + "** !", null, null, 0x2f3136, null);
                            try {
                                await randMember.send({ content: "", embeds: [embed] });
                            } catch { }
                        } catch { }
                    }
                }
            }
        }

        // TODO: create bottle message ...
        const embed = await createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(guild, content), sender.diceBearSeed, sender.id_sticker, sender.signature, sender.color, sender.id_footer);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBottle')
                    .setLabel('Répondre')
                    .setEmoji('📨')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warning_bottle')
                    .setLabel('Signaler')
                    .setEmoji('⚠️')
                    .setStyle(ButtonStyle.Danger),
            );

        // Send to channel
        const message = await channel.send({ content: 'Vous avez reçu une bouteille ||@here||', embeds: [embed], components: [row] });

        // TODO: save bottle to DB
        await bottleDB.insertBottle(channel.id, guild.id, null, id_user_sender, channel.id, channel_name, nb_sea);

        // TODO: save message to DB
        await messageDB.insertMessage(message.id, channel.id, id_user_sender, content);

        await xpAction.increment(guild, id_user_sender, 50);
    },
    reply: async function (guild, id_user_sender, channel, content) {

        // TODO: check if message is OK (moderation, sad text, injuries, ...)

        let sender = await userDB.getUser(id_user_sender);
        if (sender === null) {
            await userDB.createUser(id_user_sender, 0, 0);
            sender = await userDB.getUser(id_user_sender);
        }

        // TODO: get receiver from DB
        const receiver_id = await bottleDB.getReceiver(channel.id);
        let receiver;

        try {
            receiver = await guild.members.fetch(receiver_id);
        } catch (error) {
            // Send message into channel
            const embed = createEmbeds.createFullEmbed("Erreur", "Le destinataire de cette bouteille n'est plus sur le serveur. La bouteille va être supprimée.", null, null, 0x2f3136, null);
            await channel.send({ content: "", embeds: [embed] });
            // Delete channel in 5min
            setTimeout(async () => {
                await bottleDB.deleteBottle(channel.id);
                await channel.delete();
            }, 120000);
            return;
        }

        const embed = await createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(guild, content), sender.diceBearSeed, sender.id_sticker, sender.signature, sender.color, sender.id_footer);

        // Send message
        const messageTemp = await channel.send({ content: "", embeds: [embed] });

        // If category is not "conversations", move channel to "conversations"
        if (channel.parentId === newBottleCategory || channel.parentId === newWantedCategory || channel.parentId === null) {

            // for each member in channel, remove permission
            const members = await channel.members;
            for (const member of members) {
                await channel.permissionOverwrites.delete(member[0]);
            }

            // update bottle in DB with the responder as sender
            await bottleDB.updateBottleSender(channel.id, id_user_sender);

            let moved = false;
            // Foreach conversations
            for (const conversation of conversations) {
                // Fetch category conversation channel
                const category = (await guild.channels.fetch()).find(c => c.id == conversation);

                // If number of channels in category is less than 45
                if (category.children.cache.size < 45) {
                    // Move channel to category
                    await channel.setParent(category);
                    moved = true;
                    break;
                }
            }
            // If channel not moved
            while (!moved) {
                // Get oldest bottle channel
                const oldestChannel = await bottleDB.getOldestBottleNotArchived();
                // Fetch channel
                try {
                    const oldestChannelFetched = await guild.channels.fetch(oldestChannel);
                    // Get category
                    const category = (await guild.channels.fetch()).find(c => c.id == oldestChannelFetched.parentId);
                    // Set archive to true
                    await bottleDB.setBottleArchived(oldestChannel);
                    // Delete channel
                    await oldestChannelFetched.delete();
                    // Move channel to category
                    try {
                        await channel.setParent(category);
                    } catch (e) {
                        console.log(e);
                        return;
                    }
                    moved = true;
                } catch (e) {
                    await bottleDB.setBottleArchived(oldestChannel);
                    console.log(e);
                }
            }
        }

        // edits overwrites to allow a user to view the channel
        await channel.permissionOverwrites.create(id_user_sender, { ViewChannel: false, SendMessages: false });

        // Delete temp message
        await messageTemp.delete();

        // Remove actions from last message
        // const lastMessageId = await messageDB.getLastMessageId(channel.id);
        // const lastMessage = await channel.messages.fetch(lastMessageId);
        // await lastMessage.edit({ content: "", embeds: lastMessage.embeds, components: [] });

        // The receiver can see channel
        await channel.permissionOverwrites.create(receiver_id, { ViewChannel: true, SendMessages: false });

        // Switch receiver and sender in DB
        await bottleDB.switchSenderReceiver(channel.id);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBottle')
                    .setLabel('Répondre')
                    .setEmoji('📨')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warning_bottle')
                    .setLabel('Signaler')
                    .setEmoji('⚠️')
                    .setStyle(ButtonStyle.Danger),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteBottle')
                    .setLabel('Supprimer')
                    .setEmoji('🗑️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Send message
        const message = await channel.send({ content: 'Vous avez reçu une réponse ' + receiver.toString(), embeds: [embed], components: [row] });

        // Save to DB
        await messageDB.insertMessage(message.id, channel.id, id_user_sender, content);

        await xpAction.increment(guild, id_user_sender, 10);
    },
    unarchive: async function (guild, id_user_sender, id_bottle, content) {

        // Get bottle infos
        const bottle = await bottleDB.getBottle(id_bottle);

        // Get sender
        const sender = await userDB.getUser(bottle.id_user_sender);
        if (sender === null) {
            // delete bottle;
            return;
        }

        // Get receiver
        const receiver = await userDB.getUser(bottle.id_user_receiver);
        if (receiver === null) {
            // delete bottle;
            return;
        }

        // Create channel
        const everyoneRole = guild.roles.everyone;
        const newChannel = await guild.channels.create({
            name: bottle.name,
            type: ChannelType.GuildText
        })
        await newChannel.permissionOverwrites.edit(everyoneRole.id, { ViewChannel: false, SendMessages: false });

        // Get all old messages
        const messages = await messageDB.getMessagesOfBottle(id_bottle);

        // Send all old messages
        for (const message of messages) {
            if (message.id_user === bottle.id_user_sender) {
                // Create embedded bottle message ...
                const embed = await createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(guild, message.content), sender.diceBearSeed, sender.id_sticker, sender.signature, sender.color, sender.id_footer);
                const newMessage = await newChannel.send({ content: '', embeds: [embed] });
                await messageDB.update_id_message(newMessage.id, message.id_message);
            } else {
                // Create embedded bottle message ...
                const embed = await createEmbeds.createBottle(message.content, receiver.diceBearSeed, sender.id_sticker, receiver.signature, receiver.color, sender.id_footer);
                const newMessage = await newChannel.send({ content: '', embeds: [embed] });
                await messageDB.update_id_message(message.id_message, newMessage.id);
            }
        }

        // Update bottle in DB
        await bottleDB.setBottleUnarchived(id_bottle);
        await bottleDB.update_id_bottle_and_id_channel(id_bottle, newChannel.id);

        await this.reply(guild, id_user_sender, newChannel, content);
    },

    flow: async function (guild, sender_id, original_message) {
        //Cherche l'utilisateur qui a envoyé la bouteille à partir de son ID
        const sender = await guild.members.fetch(sender_id);
        //Crée l'embed
        const embedFlow = createEmbeds.createFullEmbed("Une de perdue, dix de retrouvées !", 'Une de vos bouteilles a coulé, elle contenait le message :\n"**' + original_message + '**"', null, null, null, null);
        //Envoie l'embed crée à l'utilisateur
        await sender.send({ content: '', embeds: [embedFlow] })
    },


    createBird: async function (guild, id_user_sender, content, nb_sea, id) {

        if (nb_sea === 0) {
            await userDB.set_date_bird(id_user_sender, new Date());
        }

        let sender = await userDB.getUser(id_user_sender);
        if (sender === null) {
            await userDB.createUser(id_user_sender, 0, 0);
            sender = await userDB.getUser(id_user_sender);
        }

        const color = await stateAndColorDB.getRandomColor();
        const state = await stateAndColorDB.getRandomState();
        const emoji = await stateAndColorDB.getRandomEmoji();
        const channel_name = emoji + "│colombe-" + color + "-" + state;

        // Find the new bird channel and send the message
        const channel = (await guild.channels.fetch()).find(c => c.id == newBirdChannel);

        const embed = await createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(guild, content), sender.diceBearSeed, sender.id_sticker, sender.signature, sender.color, sender.id_footer);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBird_love')
                    .setLabel("\u200b")
                    .setEmoji('😍')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBird_joy')
                    .setLabel("\u200b")
                    .setEmoji('😂')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBird_mouth')
                    .setLabel("\u200b")
                    .setEmoji('😮')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBird_cry')
                    .setLabel("\u200b")
                    .setEmoji('😢')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warning_bird')
                    .setLabel('Signaler')
                    .setEmoji('⚠️')
                    .setStyle(ButtonStyle.Danger),
            );

        // Send to channel
        // set 1/20 chance to send message with "En tant que VIP ou Booster, vous pouvez réagir à ce message avec un émoji personnalisé."
        const random = Math.floor(Math.random() * 20) + 1;
        let content_message = ''
        if (random === 1) {
            content_message = 'En tant que **VIP ou Booster**, vous pouvez réagir à ce message avec un **émoji personnalisé**.';
        }
        const message = await channel.send({ content: content_message, embeds: [embed], components: [row] });

        if (id === null || id === undefined) {
            await birdDB.insertBird(message.id, guild.id, id_user_sender, channel_name, content);
        } else {
            await birdDB.update_id_channel(id, message.id);
        }
    },
    flowBird: async function (guild, id_message) {
        const bird = await birdDB.getBird(id_message);

        let message = 'Votre oiseau a coulé, il contenait le message :\n"**' + bird.content + '**"';
        message += "\n\nIl a reçu :\n";

        const reactions = await birdDB.getReactions(bird.id_bird);
        if (reactions) {
            for (let i = 0; i < reactions.length; i++) {
                const reaction = reactions[i];
                message += reaction.id_emoji + " **" + reaction.c + "**\n";
            }
        }
        else {
            message += "Aucune réaction";
        }

        const sender = await guild.members.fetch(bird.id_user);
        //Crée l'embed
        const embedFlow = createEmbeds.createFullEmbed("Votre oiseau est revenu !", message, null, null, null, null);
        //Envoie l'embed crée à l'utilisateur
        await sender.send({ content: '', embeds: [embedFlow] });
        await birdDB.setArchived(bird.id_bird);

        const randomOr = Math.floor(Math.random() * 100) + 1;
        if (randomOr <= 20) {
            await orAction.increment(guild, bird.id_user, 15);
        }

        await xpAction.increment(guild, bird.id_user, 50);
    },

    getNumberOfSpacesInNewBottles: async function (guild) {
        const category = (await guild.channels.fetch()).find(c => c.id == newBottleCategory);
        return Math.max(0, 45 - category.children.cache.size)
    },

    transformEmojiToDiscordEmoji: function (guild, text) {
        const emojis = text.match(/:[a-zA-Z0-9_]+:/g);
        if (emojis !== null) {
            for (const e of emojis) {
                text = text.replace(e, this.emojiToDiscordEmoji(guild, e));
            }
        }
        return text;
    },
    emojiToDiscordEmoji: function (guild, emoji) {
        const emojiName = emoji.replace(/:/g, '');
        const emojiFetched = guild.emojis.cache.find(emoji => emoji.name === emojiName);
        if (emojiFetched !== undefined) {
            return emojiFetched.toString();
        }
        return emoji;
    }
}
