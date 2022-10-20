const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const orAction = require('../utils/orAction.js');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('or')
        .setDescription('Consultez votre solde d\'or !'),
    async execute(interaction) {
        // Get the user's currency
        const money = await orAction.get(interaction.user.id);
        const embed = createEmbeds.createFullEmbed('Quelle bourse bien remplie !', 'Votre solde est de **' + money + ' pièces d\'or** !', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};