const bottle = require("../utils/bottleAction");
const createEmbeds = require("../utils/createEmbeds");
const {modRole} = require("../config.json");
const ticketDB = require("../database/ticket");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: 'replyTicketUser',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textTicket');
        if (content.trim() === '') {
            return await interaction.reply({content: "The message cannot be empty.", ephemeral: true});
        }

        // Create a button to reply to the ticket
        const rowMod = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketMod')
                    .setLabel('Reply')
                    .setStyle(ButtonStyle.Primary),
            );

        // Fetch channel from database
        const channelId = await ticketDB.get_id_channel(interaction.user.id);
        if (channelId == null) {
            return await interaction.reply({ content: 'Your ticket cannot be found or has already been closed. Please create a new one.', ephemeral: true });
            return;
        }

        // Fetch guild from database
        const guildId = await ticketDB.get_id_guild(interaction.user.id);
        if (guildId == null) {
            return await interaction.reply({ content: 'Your ticket cannot be found or has already been closed. Please create a new one.', ephemeral: true });
            return;
        }
        // Fetch guild from client
        const guild = await interaction.client.guilds.fetch(guildId);

        // Fetch channel from guild
        const channelGuild = await guild.channels.fetch(channelId);

        const embedMod = createEmbeds.createFullEmbed("An illustrious stranger", content, null, null, 0x0000FF, null);
        await channelGuild.send({ content: '', embeds: [embedMod], components: [rowMod] });

        // Create a button to reply to the ticket
        const rowUser = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketUser')
                    .setLabel('Reply')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteTicket')
                    .setLabel('Close the ticket')
                    .setStyle(ButtonStyle.Danger),
            );

        // Create embed for the user
        const embedUser = createEmbeds.createFullEmbed("You", content, null, null, 0x0000FF, null);
        // Send an MP message to the sender
        try {
            await interaction.user.send({ content: 'Your reply', embeds: [embedUser], components: [rowUser] });
        } catch {}
        await interaction.reply({ content: 'Your reply has been sent.', ephemeral: true });
    },
};