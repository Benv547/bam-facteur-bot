const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Information about the benefits of boosters!'),
    async execute(interaction) {

        const text = '\n\nThese are the benefits you get:' +
            '\n- Get **50% off%** your purchases!' +
            '\n- Be able to **change your nickname** on the server!' +
            '\n- An **even shorter** time to send your bottles!' +
            '\n-  Make **sandcastles** on the beaches of Bottle in the sea!';

        const textBooster = 'You are **already BOOSTER**, awesome!' + text;
        const textNotBooster = '[Booster](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-FAQ-) the Bottle in the Sea server could give you more than one benefits!' + text;

        const embedBoosted = createEmbeds.createFullEmbed('A shot of Boost!', textBooster, null, null, null);
        const embedNotBoosted = createEmbeds.createFullEmbed('A shot of Boost!', textNotBooster, null, null, null);


        if (await roles.userIsBooster(interaction.member)) {
            return await interaction.reply({ ephemeral: true, embeds: [embedBoosted] });
        } else {
            return await interaction.reply({ ephemeral: true, embeds: [embedNotBoosted] });
        }
                
    },
};