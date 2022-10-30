const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const xpAction = require('../utils/xpAction.js');
const userDB = require("../database/user");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Consultez votre niveau !'),
    async execute(interaction) {
        // Get the user's currency
        let xp = await xpAction.get(interaction.user.id);
        if (xp == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
            xp = 0;
        }

        const nextXp = await xpAction.getNextLevel(interaction.user.id);
        const difference = nextXp - xp;
        if (difference < 0) {
            const embed = createEmbeds.createFullEmbed('Un niveau impressionnant !', "Vous êtes au niveau maximum avec **" + xp + " XP** !", null, null, 0x2f3136, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
        }
        const embed = createEmbeds.createFullEmbed('Un niveau impressionnant !', 'Votre niveau est de **' + xp + ' XP** !\nVous avez besoin de **' + difference + ' XP** pour monter d\'un niveau.', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};