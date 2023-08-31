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

        const embedMod = createEmbeds.createFullEmbed(interaction.user.username, content, null, null, 0x00FF00, null);
        await interaction.channel.send({ content: '', embeds: [embedMod], components: [rowMod] });

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


        // Fetch user from database
        const user = await ticketDB.get_id_user(interaction.channel.id);

        if (user == null) {
            return await interaction.reply({ content: 'The ticket cannot be found or has already been closed..', ephemeral: true });
        }

        // Fetch user from guild
        try {
            const userGuild = await interaction.guild.members.fetch(user);
            const embedUser = createEmbeds.createFullEmbed("Moderator", content, null, null, 0x00FF00, null);
            await userGuild.send({ content: 'Ticket answer', embeds: [embedUser], components: [rowUser] });
        } catch (e) {
            return await interaction.reply({ content: 'The person has left the server or cannot be answered at this time.', ephemeral: true });
        }
        // Send an MP message to the sender
        await interaction.reply({ content: 'Your answer has been sent.', ephemeral: true });
    },
};