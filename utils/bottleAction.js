const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {newBottleCategory} = require("../config.json");
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
        //await channel.setPosition(0);

        // TODO: choose random member
        const members = await guild.members.fetch();
        const randMember = members.random();

        if (await userDB.getUser(randMember.id) === null) {
            await userDB.createUser(randMember.id, 0, 0);
        }

        // TODO: add member to channel
        // edits overwrites to disallow everyone to view the channel
        await channel.permissionOverwrites.edit(guild.id, {ViewChannel: false});

        // edits overwrites to allow a user to view the channel
        await channel.permissionOverwrites.edit(randMember.id, {ViewChannel: true});

        // TODO: create bottle message ...
        const embed = createEmbeds.createBottle(content, sender.diceBearSeed);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBottle')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('seaBottle')
                    .setLabel('Remettre à la mer')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warningBottle')
                    .setLabel('Signaler')
                    .setStyle(ButtonStyle.Primary),
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

        // TODO: get receiver from DB
        const receiver_id = await bottleDB.getReceiver(channel.id);
        const receiver = await guild.members.fetch(receiver_id);

        // edits overwrites to allow a user to view the channel
        await channel.permissionOverwrites.edit(receiver_id, {ViewChannel: true});
        await channel.permissionOverwrites.edit(id_user_sender, {ViewChannel: false});

        await bottleDB.switchSenderReceiver(channel.id);

        // TODO: create bottle message ...
        const embed = createEmbeds.createBottle(content, sender.diceBearSeed);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBottle')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warningBottle')
                    .setLabel('Signaler')
                    .setStyle(ButtonStyle.Primary),
            );

        // Fetch last message
        const lastMessageId = await messageDB.getLastMessageId(channel.id);
        const lastMessage = await channel.messages.fetch(lastMessageId);
        // Remove actions from last message
        await lastMessage.edit({ content: "", embeds: lastMessage.embeds, components: [] });

        // Send message
        const message = await channel.send({ content: receiver.toString(), embeds: [embed], components: [row] });

        // Save to DB
        await messageDB.insertMessage(message.id, channel.id, channel.id, id_user_sender, content);
    }
}
