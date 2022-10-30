const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const orAction = require('../utils/orAction.js');
const userDB = require("../database/user");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('or')
        .setDescription('Consultez votre solde d\'or !'),
    async execute(interaction) {
        // Get the user's currency

        let money = await orAction.get(interaction.user.id);
        if (money == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
            money = 0;
        }

        const embed = createEmbeds.createFullEmbed('Quelle bourse bien remplie !', 'Votre solde est de **' + money + ' pièces d\'or** !', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};