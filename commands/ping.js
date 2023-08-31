const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Answer with Pong!'),
    async execute(interaction) {
        return interaction.reply({ content: `Pong with ${Math.round(interaction.client.ws.ping)}ms!`, ephemeral: true });
    },
};