const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Informations sur les avantages des boosters !'),
    async execute(interaction) {

        const text = '\n\nVoici les avantages que tu as :' +
            '\n- Avoir des **réductions de 50%** sur tes achats !' +
            '\n- Pouvoir **changer de pseudonyme** sur le serveur !' +
            '\n- Un **temps encore plus réduit** sur l\'envoi de tes bouteilles !' +
            '\n- Faire des **chateaux de sable** sur les plages de Bouteille à la mer !';

        const textBooster = 'Tu es **déjà BOOSTER**, super !' + text;
        const textNotBooster = '[Booster](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-FAQ-) le serveur Bouteille à la mer pourrait te donner plus d\'un avantages !' + text;

        const embedBoosted = createEmbeds.createFullEmbed('Un coup de Boost !', textBooster, null, null, null);
        const embedNotBoosted = createEmbeds.createFullEmbed('Un coup de Boost !', textNotBooster, null, null, null);


        if (await roles.userIsBooster(interaction.member)) {
            return await interaction.reply({ ephemeral: true, embeds: [embedBoosted] });
        } else {
            return await interaction.reply({ ephemeral: true, embeds: [embedNotBoosted] });
        }
                
    },
};