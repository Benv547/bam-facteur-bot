const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const corailAction = require('../utils/corailAction.js');
const userDB = require("../database/user");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('corail')
        .setDescription('Consultez votre solde de coraux !'),
    async execute(interaction) {
        // Get the user's currency

        let corail = await corailAction.get(interaction.user.id);
        if (corail == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
            corail = 0;
        }

        let title = 'Quelle bourse bien remplie !';
        if (corail === 0) {
            title = 'Quelle bourse bien vide ...';
        }

        let textHelp = '';
        if (corail < 1000) {
            textHelp = '\n\nBesoin de savoir comment gagner des coraux ? Consultez le salon <#864884869376507912> !';
        }

        const embed = createEmbeds.createFullEmbed(title, 'Votre solde est de **' + corail + ' <:corail:1045638307050168320>** !' + textHelp, null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};