const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'createOpinion',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('createOpinion')
            .setTitle('Donnez votre avis');

        // Add components to modal
        const input = new TextInputBuilder()
            .setCustomId('textOpinion')
            .setLabel("Quel est votre avis sur le serveur ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(input);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};