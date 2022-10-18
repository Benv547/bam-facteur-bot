const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond avec Pong !'),
    async execute(interaction) {
        return interaction.reply({ content: 'Pong !', ephemeral: true });
    },
};