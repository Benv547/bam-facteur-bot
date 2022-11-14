const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'warning',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId(interaction.customId)
            .setTitle('🚨⚠️ Raison du signalement ⚠️🚨');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textWarning')
            .setLabel("Pourquoi avez-vous signalé le message ?")
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