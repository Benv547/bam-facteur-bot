const bottleDB = require("../database/bottle");
const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");

module.exports = {
    name: 'deleteBottle',
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('deleteBottle')
            .setTitle('Êtes-vous sûr ?');

        // Add components to modal
        const deleteInput = new TextInputBuilder()
            .setCustomId('textSuppression')
            .setLabel("⚠️ Ecrivez 'supprimer' pour confirmer :")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Short);

        const raisonInput = new TextInputBuilder()
            .setCustomId('textRaison')
            .setLabel("Quelle est la raison ?")
            .setRequired(false)
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(deleteInput);
        const secondaryActionRow = new ActionRowBuilder().addComponents(raisonInput);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow, secondaryActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};