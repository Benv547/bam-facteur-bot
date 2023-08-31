const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'replyWanted',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('replyWanted')
            .setTitle('My reply');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textWanted')
            .setLabel("What's your reply?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(2000);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};