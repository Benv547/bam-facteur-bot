const { SlashCommandBuilder } = require('discord.js');
const stickyDB = require("../database/sticky");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sticky')
        .setDescription('Permet de créer un message épinglé.')
        .addStringOption(option =>
            option.setName('original')
                .setDescription('The sticky message')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Save to database
            await stickyDB.insertSticky(interaction.guildId, interaction.channelId, interaction.options.getString('original'));
            return await interaction.reply({ content:'C\'est fait.', ephemeral: true});
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};