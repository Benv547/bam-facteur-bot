const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const xpAction = require('../utils/xpAction.js');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Consultez votre niveau !'),
    async execute(interaction) {
        // Get the user's currency
        const xp = await xpAction.get(interaction.user.id);
        const nextXp = await xpAction.getNextLevel(interaction.user.id);
        const difference = nextXp - xp;
        const embed = createEmbeds.createFullEmbed('Un niveau impressionnant !', 'Votre niveau est de **' + xp + ' XP** !\nVous avez besoin de **' + difference + ' XP** pour monter d\'un niveau.', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};