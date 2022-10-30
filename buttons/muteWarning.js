const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'muteWarning',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('muteWarning')
            .setTitle('Raison de l\'exclusion');

        // Add components to modal
        const raisonInput = new TextInputBuilder()
            .setCustomId('raison')
            .setLabel("Pourquoi le signalement est justifié ?")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1500);

        const timeoutInput = new TextInputBuilder()
            .setCustomId('timeout')
            .setLabel("Combien de temps ? (en minutes)")
            .setStyle(TextInputStyle.Short);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(timeoutInput);
        const secondActionRow = new ActionRowBuilder().addComponents(raisonInput);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};