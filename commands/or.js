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

        let title = 'Quelle bourse bien remplie !';

        let money = await orAction.get(interaction.user.id);
        if (money == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
            money = 0;
        }

        if (money == 0) {
            title = 'Quelle bourse bien vide ...';
        }

        let textHelp = '';
        if (money < 200) {
            textHelp = '\n\nBesoin de savoir comment gagner de l\'or ? Consultez le salon <#864884869376507912> !';
        }

        const embed = createEmbeds.createFullEmbed(title, 'Votre solde est de **' + money + ' <:piece:1045638309235404860>** !' + textHelp, null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};