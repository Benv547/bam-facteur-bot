const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const xpAction = require('../utils/xpAction.js');
const userDB = require("../database/user");
const { levels } = require('../xp.json');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Check your level!'),
    async execute(interaction) {
        // Get the user's currency
        let xp = await xpAction.get(interaction.user.id);
        if (xp == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
            xp = 0;
        }

        // find the current role level of the user
        let role = null;
        for (const level of levels) {
            if (xp >= level.xp) {
                role = level.role;
            }
        }

        const nextXp = await xpAction.getNextLevel(interaction.user.id);
        const difference = nextXp - xp;
        if (difference < 0) {
            const embed = createEmbeds.createFullEmbed('An impressive level!', "You are at max level with **" + xp + " XP**!", null, null, 0x2f3136, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
        }
        const embed = createEmbeds.createFullEmbed('An impressive level!', 'You are **<@&' + role + '>** and have **' + xp + '** XP! \nYou need **' + difference + '** <:xp:1058066266797113455> to level up.', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};