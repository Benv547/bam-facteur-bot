const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const boutiqueAction = require("../utils/boutiqueAction");

module.exports = {
    name: 'buyItem',
    async execute(interaction) {
        const categorie = interaction.customId.split('_')[1];
        const item = interaction.customId.split('_')[2];

        return await boutiqueAction.buyItem(interaction, categorie, item);
    },
};