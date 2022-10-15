const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {newBottleCategory, conversations} = require("../config.json");
const createEmbeds = require("./createEmbeds");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");

module.exports = {
    name: 'bottleAction',
    create: async function (guild, id_user_sender, content) {
        // TODO: check if message is OK (moderation, sad text, injuries, ...)

        let sender = await userDB.getUser(id_user_sender);
        if (sender === null) {
            await userDB.createUser(id_user_sender, 0, 0);
            sender = await userDB.getUser(id_user_sender);
        }

        const color = await stateAndColorDB.getRandomColor();
        const state = await stateAndColorDB.getRandomState();
        const channel_name = "bouteille-" + color + "-" + state;

        // TODO: create channel
        const everyoneRole = guild.roles.everyone;
        var channel = await guild.channels.create({
            name: channel_name,
            type: ChannelType.GuildText
        })

        // TODO: move channel to "nouvelles bouteilles"
        const category = guild.channels.cache.find(c => c.id == newBottleCategory);
        await channel.setParent(category);

        // TODO: choose random member who are not a bot

        // Fetch all members
        const members = await (await guild.members.fetch()).filter(m => !m.user.bot);
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
        const embed = createEmbeds.createBottle(content, sender.diceBearSeed);

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
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warningBottle')
                    .setLabel('⚠️ Signaler')
                    .setStyle(ButtonStyle.Danger),
            );

        // Send to channel
        const message = await channel.send({ content: randMember.toString(), embeds: [embed], components: [row] });

        // TODO: save bottle to DB
        await bottleDB.insertBottle(channel.id, randMember.id, id_user_sender, channel.id, channel_name);

        // TODO: save message to DB
        await messageDB.insertMessage(message.id, channel.id, channel.id, id_user_sender, content);
    },
    reply: async function (guild, id_user_sender, channel, content) {

        // TODO: check if message is OK (moderation, sad text, injuries, ...)

        let sender = await userDB.getUser(id_user_sender);
        if (sender === null) {
            await userDB.createUser(id_user_sender, 0, 0);
            sender = await userDB.getUser(id_user_sender);
        }

        // If category is not "conversations", move channel to "conversations"
        if (channel.parentId === newBottleCategory) {
            let moved = false;
            // Foreach conversations
            for (const conversation of conversations) {
                console.log(conversation);
                // Fetch category conversation channel
                const category = guild.channels.cache.find(c => c.id == conversation);

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
                const oldestChannelFetched = await guild.channels.fetch(oldestChannel.id_channel);
                // Get category
                const category = guild.channels.cache.find(c => c.id == oldestChannelFetched.parentId);
                // Delete channel
                await oldestChannelFetched.delete();
                // Move channel to category
                await channel.setParent(category);

            }
        }

        // TODO: get receiver from DB
        const receiver_id = await bottleDB.getReceiver(channel.id);
        const receiver = await guild.members.fetch(receiver_id);

        // Create embedded bottle message ...
        const embed = createEmbeds.createBottle(content, sender.diceBearSeed);

        // Send message
        const messageTemp = await channel.send({ content: "", embeds: [embed] });

        // edits overwrites to allow a user to view the channel
        await channel.permissionOverwrites.create(id_user_sender, {ViewChannel: false, SendMessages: false});

        // Delete temp message
        await messageTemp.delete();

        // Remove actions from last message
        const lastMessageId = await messageDB.getLastMessageId(channel.id);
        const lastMessage = await channel.messages.fetch(lastMessageId);
        await lastMessage.edit({ content: "", embeds: lastMessage.embeds, components: [] });

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
            );

        // Send message
        const message = await channel.send({ content: receiver.toString(), embeds: [embed], components: [row] });

        // Save to DB
        await messageDB.insertMessage(message.id, channel.id, channel.id, id_user_sender, content);
    }
}
