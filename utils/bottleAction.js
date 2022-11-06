const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {newBottleCategory, conversations} = require("../config.json");
const createEmbeds = require("./createEmbeds");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const stickerDB = require("../database/sticker");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const xpAction = require("./xpAction");

module.exports = {
    name: 'bottleAction',
    create: async function (guild, id_user_sender, content, nb_sea) {
        // TODO: check if message is OK (moderation, sad text, injuries, ...)

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

        // TODO: move channel to "nouvelles bouteilles"
        const category = (await guild.channels.fetch()).find(c => c.id == newBottleCategory);

        // While number of channels in category is more than 45
        while (category.children.cache.size > 45) {
            const channelToDelete = category.children.cache.first();
            // Set archive to true
            await bottleDB.setBottleArchived(channelToDelete.id_channel);
            // Delete channel
            await channelToDelete.delete();
        }

        await channel.setParent(category);

        // TODO: choose random member who are not a bot

        // Fetch all members
        const members = await (await guild.members.fetch()).filter(m => !m.user.bot && m.id !== id_user_sender);
        const randMember = members.random();

        if (await userDB.getUser(randMember.id) === null) {
            await userDB.createUser(randMember.id, 0, 0);
        }

        // TODO: add member to channel
        // edits overwrites to disallow everyone to view the channel
        await channel.permissionOverwrites.edit(guild.id, {ViewChannel: false, SendMessages: false});

        // edits overwrites to allow a user to view the channel
        await channel.permissionOverwrites.edit(randMember.id, {ViewChannel: true, SendMessages: false});

        // TODO: create bottle message ...
        const sticker = await stickerDB.getSticker(sender.id_sticker);
        let stickerUrl = null;
        if (sticker !== null) {
            stickerUrl = sticker.url;

            if (sticker.sharable) {
                // choose random float between 0 and 1
                const randFloat = Math.random();
                if (randFloat < sticker.sharable_percentage) {
                    // share sticker
                    try {
                        await stickerDB.giveStickerToUser(randMember.id, sticker.id_sticker, guild.id);
                        const embed = createEmbeds.createFullEmbed("Quelle belle trouvaille !", "L'auteur•e de la bouteille " + channel_name + " a partagé•e avec vous le **sticker " + sticker.name + "** !", null, null, 0x2f3136, null);
                        try {
                            await randMember.send({content: "", embeds: [embed]});
                        } catch {}
                    } catch {}
                }
            }
        }
        const embed = createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(guild, content), sender.diceBearSeed, stickerUrl, sender.signature, sender.color);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBottle')
                    .setLabel('📨 Répondre')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('seaBottle')
                    .setLabel('🌊 Remettre à la mer')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warningBottle')
                    .setLabel('⚠️ Signaler')
                    .setStyle(ButtonStyle.Danger),
            );

        // Send to channel
        const message = await channel.send({ content: 'Vous avez reçu une bouteille ' + randMember.toString(), embeds: [embed], components: [row] });

        // TODO: save bottle to DB
        await bottleDB.insertBottle(channel.id, guild.id, randMember.id, id_user_sender, channel.id, channel_name, nb_sea);

        // TODO: save message to DB
        await messageDB.insertMessage(message.id, channel.id, id_user_sender, content);


        await xpAction.increment(guild, id_user_sender, 20);
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
        const receiver = await guild.members.fetch(receiver_id);

        if (receiver === null) {
            // TODO : delete bottle
            return;
        }

        // Create embedded bottle message ...
        const sticker = await stickerDB.getSticker(sender.id_sticker);
        let stickerUrl = null;
        if (sticker !== null) {
            stickerUrl = sticker.url;
        }
        const embed = createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(guild, content), sender.diceBearSeed, stickerUrl, sender.signature, sender.color);

        // Send message
        const messageTemp = await channel.send({ content: "", embeds: [embed] });

        // If category is not "conversations", move channel to "conversations"
        if (channel.parentId === newBottleCategory || channel.parentId === null) {
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
            if (!moved) {
                // Get oldest bottle channel
                const oldestChannel = await bottleDB.getOldestBottleNotArchived();
                // Fetch channel
                const oldestChannelFetched = await guild.channels.fetch(oldestChannel);
                // Get category
                const category = (await guild.channels.fetch()).find(c => c.id == oldestChannelFetched.parentId);
                // Set archive to true
                await bottleDB.setBottleArchived(oldestChannel.id_channel);
                // Delete channel
                await oldestChannelFetched.delete();
                // Move channel to category
                await channel.setParent(category);
            }
        }

        // edits overwrites to allow a user to view the channel
        await channel.permissionOverwrites.create(id_user_sender, {ViewChannel: false, SendMessages: false});

        // Delete temp message
        await messageTemp.delete();

        // Remove actions from last message
        // const lastMessageId = await messageDB.getLastMessageId(channel.id);
        // const lastMessage = await channel.messages.fetch(lastMessageId);
        // await lastMessage.edit({ content: "", embeds: lastMessage.embeds, components: [] });

        // The receiver can see channel
        await channel.permissionOverwrites.create(receiver_id, {ViewChannel: true, SendMessages: false});

        // Switch receiver and sender in DB
        await bottleDB.switchSenderReceiver(channel.id);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBottle')
                    .setLabel('📨 Répondre')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warningBottle')
                    .setLabel('⚠️ Signaler')
                    .setStyle(ButtonStyle.Danger),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteBottle')
                    .setLabel('🗑️ Supprimer')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Send message
        const message = await channel.send({ content: 'Vous avez reçu une réponse ' + receiver.toString(), embeds: [embed], components: [row] });

        // Save to DB
        await messageDB.insertMessage(message.id, channel.id, id_user_sender, content);

        await xpAction.increment(guild, id_user_sender, 5);
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
        const newChannel = await guild.channels.create({
            name: bottle.name,
            type: ChannelType.GuildText
        })

        const everyoneRole = guild.roles.everyone;
        await newChannel.permissionOverwrites.edit(everyoneRole.id, {ViewChannel: false, SendMessages: false});

        // Get all old messages
        const messages = await messageDB.getMessagesOfBottle(id_bottle);

        // Send all old messages
        for (const message of messages) {
            if (message.id_user === bottle.id_user_sender) {
                // Create embedded bottle message ...
                const sticker = await stickerDB.getSticker(sender.id_sticker);
                let stickerUrl = null;
                if (sticker !== null) {
                    stickerUrl = sticker.url;
                }
                const embed = createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(guild, message.content), sender.diceBearSeed, stickerUrl, sender.signature, sender.color);
                const newMessage = await newChannel.send({ content: '', embeds: [embed] });
                await messageDB.update_id_message(newMessage.id, message.id_message);
            } else {
                // Create embedded bottle message ...
                const sticker = await stickerDB.getSticker(receiver.id_sticker);
                let stickerUrl = null;
                if (sticker !== null) {
                    stickerUrl = sticker.url;
                }
                const embed = createEmbeds.createBottle(message.content, receiver.diceBearSeed, stickerUrl, receiver.signature, receiver.color);
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
