const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Informations avantages des boosters !'),
    async execute(interaction) {
        const embedBoosted = createEmbeds.createFullEmbed('🎖 La puissance du boost !', `${interaction.member} tu es **déjà booster**, super !\nVoici les avantages que tu as :\n- Faire du **surf** sur les vagues de Bouteille à la mer !\n- Être une vraie **star** du serveur, la classe !\n- Un **gros bisous** de la part de Mushiuta !`, null, null, null);
        const embedNotBoosted = createEmbeds.createFullEmbed('🎖 La puissance du boost !', `[Booster](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-FAQ-) le serveur Bouteille à la mer pourrait te donner plus d'un avantages !\n- Faire du **surf** sur les vagues de Bouteille à la mer !\n- Être une vraie **star** du serveur, la classe !\n- De **gros bisous** de la part de Mushiuta !`, null, null, null);


        if (await roles.userIsBooster(interaction.member)) {
            return await interaction.reply({ ephemeral: true, embeds: [embedBoosted] });
        } else {
            return await interaction.reply({ ephemeral: true, embeds: [embedNotBoosted] });
        }
                
    },
};