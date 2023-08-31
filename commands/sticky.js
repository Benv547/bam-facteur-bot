const { SlashCommandBuilder } = require('discord.js');
const stickyDB = require("../database/sticky");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sticky')
        .setDescription('Create a pinned message.')
        .addStringOption(option =>
            option.setName('original')
                .setDescription('The sticky message')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Save to database
            await stickyDB.deleteSticky(interaction.channelId);
            await stickyDB.insertSticky(interaction.guildId, interaction.channelId, interaction.options.getString('original'));
            return await interaction.reply({ content:'Done.', ephemeral: true});
        }
        return interaction.reply({ content:'You don\'t have the right to do that.', ephemeral: true});
    },
};