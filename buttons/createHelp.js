const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'createHelp',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('createHelp')
            .setTitle('Besoin d\'aide ?');

        // Add components to modal
        const input = new TextInputBuilder()
            .setCustomId('textHelp')
            .setLabel("Quel est votre problème ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1500);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(input);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};