const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'createTicket',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('createTicket')
            .setTitle('Nouveau ticket');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textTicket')
            .setLabel("Quelle est la raison du ticket ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};