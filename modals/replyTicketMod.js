const bottle = require("../utils/bottleAction");
const createEmbeds = require("../utils/createEmbeds");
const {modRole} = require("../config.json");
const ticketDB = require("../database/ticket");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: 'replyTicketMod',
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

        const embedMod = createEmbeds.createFullEmbed(interaction.user.username, content, null, null, 0x00FF00, null);
        await interaction.channel.send({ content: '', embeds: [embedMod], components: [rowMod] });

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


        // Fetch user from database
        const user = await ticketDB.get_id_user(interaction.channel.id);

        if (user == null) {
            return await interaction.reply({ content: 'Le ticket est introuvable ou a déjà été fermé..', ephemeral: true });
        }

        // Fetch user from guild
        const userGuild = await interaction.guild.members.fetch(user);
        const embedUser = createEmbeds.createFullEmbed("Modérateur", content, null, null, 0x00FF00, null);
        // Send an MP message to the sender
        await userGuild.send({ content: 'Réponse du ticket', embeds: [embedUser], components: [rowUser] });
        await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });
    },
};