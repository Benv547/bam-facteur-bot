const bottle = require("../utils/bottleAction");
const createEmbeds = require("../utils/createEmbeds");
const {modRole} = require("../config.json");
const ticketDB = require("../database/ticket");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: 'replyTicketUser',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textTicket');

        const sender = interaction.member;

        await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });

        // Create a button to reply to the ticket
        const rowMod = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketMod')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            );

        // Fetch channel from database
        const channelId = await ticketDB.get_id_channel(interaction.user.id);

        // Fetch guild from database
        const guildId = await ticketDB.get_id_guild(interaction.user.id);

        // Fetch guild from client
        const guild = interaction.client.guilds.cache.get(guildId);

        // Fetch channel from guild
        const channelGuild = guild.channels.cache.get(channelId);

        const embedMod = createEmbeds.createFullEmbed("Un•e illuste inconnu•e", content, null, null, 0x0000FF, null);
        await channelGuild.send({ content: '', embeds: [embedMod], components: [rowMod] });

        // Create a button to reply to the ticket
        const rowUser = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketUser')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            );

        // Create embed for the user
        const embedUser = createEmbeds.createFullEmbed(sender.username, content, null, null, 0x0000FF, null);
        // Send an MP message to the sender
        await sender.send({ content: 'Votre réponse', embeds: [embedUser], components: [rowUser] });
    },
};