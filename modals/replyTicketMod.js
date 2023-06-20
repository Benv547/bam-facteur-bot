const bottle = require("../utils/bottleAction");
const createEmbeds = require("../utils/createEmbeds");
const {modRole} = require("../config.json");
const ticketDB = require("../database/ticket");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: 'replyTicketMod',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textTicket');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        // Create a button to reply to the ticket
        const rowMod = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyTicketMod')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
            );

        const embedMod = createEmbeds.createFullEmbed(interaction.user.username.charAt(0).toUpperCase() + interaction.user.username.substring(1), content, null, null, 0x00FF00, null);
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
        try {
            const userGuild = await interaction.guild.members.fetch(user);
            const embedUser = createEmbeds.createFullEmbed("Modérateur", content, null, null, 0x00FF00, null);
            await userGuild.send({ content: 'Réponse du ticket', embeds: [embedUser], components: [rowUser] });
        } catch (e) {
            return await interaction.reply({ content: 'La personne a quitté le serveur ou il est impossible de lui répondre pour le moment.', ephemeral: true });
        }
        // Send an MP message to the sender
        await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });
    },
};