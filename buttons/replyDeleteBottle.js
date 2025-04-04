const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'replyDeleteBottle',
    async execute(interaction) {

        const type = interaction.customId.split('_')[1];
        if (type === 'ok') {
            await interaction.update({ components: [] });
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId('replyDeleteBottle')
            .setTitle('Ma réponse');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textBottle')
            .setLabel("Quel est votre message ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
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