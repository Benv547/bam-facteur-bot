const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'replyTicketUser',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('replyTicketUser')
            .setTitle('Reply to the ticket');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textTicket')
            .setLabel("What do you want to tell us?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1500);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};