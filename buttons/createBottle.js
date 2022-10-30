const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const bottleDB = require("../database/bottle");
const roles = require("../utils/roles");

module.exports = {
    name: 'createBottle',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('createBottle')
            .setTitle('Ma bouteille');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textBottle')
            .setLabel("Quel est votre message ?")
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
        const dateLastBottle = await bottleDB.getDateOfLastBottleWithOneMessageOfUser(interaction.user.id);
        let waitMinutes = 10;

        if (await roles.userIsBooster(interaction.member)) {
            waitMinutes = 1;
        } else if (await roles.userIsVip(interaction.member)) {
            waitMinutes = 5;
        }

        if (dateLastBottle) {
            const diff = Math.abs(new Date() - new Date(dateLastBottle));
            const diffMinutes = Math.ceil(diff / (1000 * 60));
            if (diffMinutes < waitMinutes) {
                return await interaction.reply({ content: `Vous devez attendre ${waitMinutes - diffMinutes} minutes avant de pouvoir créer une nouvelle bouteille.`, ephemeral: true });
            }
        }

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};