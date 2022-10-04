const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { newBottleCategory } = require('../config.json');
const createEmbeds = require('../utils/createEmbeds.js');
const messageDB = require('../database/message.js');
const bottleDB = require('../database/bottle.js');

module.exports = {
    name: 'replyBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBottle');

        const sender = interaction.member;

        // TODO: check if message is OK (moderation, sad text, injuries, ...)

        // TODO: get receiver from DB
        const receiver_id = await bottleDB.getReceiver(interaction.channel.id);

        const receiver = await interaction.guild.members.fetch(receiver_id);

        // edits overwrites to allow a user to view the channel
        await interaction.channel.permissionOverwrites.edit(receiver_id, {ViewChannel: true});
        await interaction.channel.permissionOverwrites.edit(interaction.member.id, {ViewChannel: false});

        await bottleDB.switchSenderReceiver(interaction.channel.id);

        // TODO: create bottle message ...
        const embed = createEmbeds.createBottle(content);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyBottle')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            );

        // Send to channel
        const message = await interaction.channel.send({ content: receiver.toString(), embeds: [embed], components: [row] });

        // TODO: save message to DB
        await messageDB.insertMessage(message.id, 0, interaction.channel.id, interaction.member.id, content);

        await interaction.reply({ content: 'Votre bouteille a été envoyée.', ephemeral: true });
    },
};