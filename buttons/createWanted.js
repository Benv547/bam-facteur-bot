const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const wantedDB = require("../database/wanted");
const roles = require("../utils/roles");

module.exports = {
    name: 'createWanted',
    async execute(interaction) {

        if (global.semaphore.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'Vous avez déjà une recherche en cours de création !', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId('createWanted')
            .setTitle('Ma recherche');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textWanted')
            .setLabel("Quelle est votre recherche ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(2000);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        // If last bottle date is less than 5minutes
        const dateLastBottle = await wantedDB.getDateOfLastWantedForUser(interaction.user.id);
        let waitMinutes = 120;

        if (await roles.userIsBooster(interaction.member)) {
            waitMinutes = 30;
        } else if (await roles.userIsVip(interaction.member)) {
            waitMinutes = 60;
        }

        if (dateLastBottle) {
            const diff = Math.abs(new Date() - new Date(dateLastBottle));
            const diffMinutes = Math.ceil(diff / (1000 * 60));
            if (diffMinutes < waitMinutes) {
                return await interaction.reply({ content: `Vous devez attendre ${waitMinutes - diffMinutes} minutes avant de pouvoir créer une nouvelle recherche.`, ephemeral: true });
            }
        }

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};