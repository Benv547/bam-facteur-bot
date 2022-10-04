const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { newBottleCategory } = require('../config.json');
const createEmbeds = require('../utils/createEmbeds.js');
const messageDB = require("../database/message");
const bottleDB = require("../database/bottle");

module.exports = {
    name: 'createBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBottle');

        const sender = interaction.member;

        // TODO: check if message is OK (moderation, sad text, injuries, ...)

        // TODO: choose a channel_name
        const channel_name = "bouteille-rose-cassée";

        // TODO: create channel
        const everyoneRole = interaction.guild.roles.everyone;
        var channel = await interaction.guild.channels.create({
            name: channel_name,
            type: ChannelType.GuildText
        })

        // TODO: move channel to "nouvelles bouteilles"
        const category = interaction.guild.channels.cache.find(c => c.id == newBottleCategory);
        await channel.setParent(category);
        //await channel.setPosition(0);

        // TODO: choose random member
        const members = await interaction.guild.members.fetch();
        const randMember = members.random();

        // TODO: add member to channel
        // edits overwrites to disallow everyone to view the channel
        await channel.permissionOverwrites.edit(interaction.guild.id, {ViewChannel: false});

        // edits overwrites to allow a user to view the channel
        await channel.permissionOverwrites.edit(randMember.id, {ViewChannel: true});

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
        const message = await channel.send({ content: randMember.toString(), embeds: [embed], components: [row] });

        // TODO: save bottle to DB
        await bottleDB.insertBottle(channel.id, randMember.id, sender.id, channel.id, channel_name);

        // TODO: save message to DB
        await messageDB.insertMessage(message.id, 0, channel.id, interaction.member.id, content);

        await interaction.reply({ content: 'Votre bouteille a été envoyée.', ephemeral: true });
    },
};