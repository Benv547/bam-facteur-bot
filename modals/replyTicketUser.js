const bottle = require("../utils/bottleAction");
const createEmbeds = require("../utils/createEmbeds");
const {modRole} = require("../config.json");
const ticketDB = require("../database/ticket");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: 'replyTicketUser',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textTicket');

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
        if (channelId == null) {
            return await interaction.reply({ content: 'Votre ticket est introuvable ou a déjà été fermé. Merci d\'en créer un nouveau.', ephemeral: true });
            return;
        }

        // Fetch guild from database
        const guildId = await ticketDB.get_id_guild(interaction.user.id);
        if (guildId == null) {
            return await interaction.reply({ content: 'Votre ticket est introuvabl ou a déjà été fermé. Merci d\'en créer un nouveau.', ephemeral: true });
            return;
        }
        // Fetch guild from client
        const guild = await interaction.client.guilds.fetch(guildId);

        // Fetch channel from guild
        const channelGuild = await guild.channels.fetch(channelId);

        const embedMod = createEmbeds.createFullEmbed("Un•e illuste inconnu•e", content, null, null, 0x0000FF, null);
        await channelGuild.send({ content: '', embeds: [embedMod], components: [rowMod] });

        // Create a button to reply to the ticket
        const rowUser = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketUser')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteTicket')
                    .setLabel('Fermer le ticket')
                    .setStyle(ButtonStyle.Danger),
            );

        // Create embed for the user
        const embedUser = createEmbeds.createFullEmbed("Vous", content, null, null, 0x0000FF, null);
        // Send an MP message to the sender
        try {
            await interaction.user.send({ content: 'Votre réponse', embeds: [embedUser], components: [rowUser] });
        } catch {}
        await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });
    },
};