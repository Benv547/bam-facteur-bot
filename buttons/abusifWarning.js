const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'abusifWarning',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('abusifWarning')
            .setTitle('Raison donnée par le modérateur');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('raison')
            .setLabel("Pourquoi le signalement est abusif ?")
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