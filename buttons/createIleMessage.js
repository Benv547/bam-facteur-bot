const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'createIleMessage',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('createIleMessage')
            .setTitle('Envoyer un nouveau message sur l\'île');

        // Add components to modal
        const input = new TextInputBuilder()
            .setCustomId('textMessage')
            .setLabel("Quel est votre message ?")
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