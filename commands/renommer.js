const {SlashCommandBuilder} = require("discord.js");
const userDB = require("../database/user");
const { ile } = require('../config.json');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Rename the island!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The new name of the island')
                .setRequired(true)),
    async execute(interaction) {

        const user = await userDB.getUser(interaction.user.id);

        // fetch channel
        if (interaction.channelId !== ile) {
            return interaction.reply({content: 'You can\'t rename the island here.', ephemeral: true});
        }

        if (interaction.channel.name !== '🏝│island_factor') {
            return interaction.reply({content: 'You can\'t rename the island now, wait tomorrow.', ephemeral: true});
        }

        const newName = interaction.options.getString('name');

        if (!newName.includes('île') && !newName.includes('island')) {
            return interaction.reply({content: "The name of the island must contain the word 'island'.", ephemeral: true});
        }

        await interaction.channel.setName('🏝│' + newName);
        return interaction.reply({content: 'The island as rename in' + newName + ' by <@' + interaction.user + '>.'});
    },
};