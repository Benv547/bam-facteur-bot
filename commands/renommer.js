const {SlashCommandBuilder} = require("discord.js");
const userDB = require("../database/user");
const { ile } = require('../config.json');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('renommer')
        .setDescription('Renommer l\'île !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('le nouveau nom de l\'île')
                .setRequired(true)),
    async execute(interaction) {

        const user = await userDB.getUser(interaction.user.id);

        // fetch channel
        if (interaction.channelId !== ile) {
            return interaction.reply({content: 'Vous ne pouvez pas renommer l\'île ici.', ephemeral: true});
        }

        if (interaction.channel.name !== '🏝│île_facteur') {
            return interaction.reply({content: 'Vous ne pouvez pas renommer l\'île maintenant, attendez demain.', ephemeral: true});
        }

        const newName = interaction.options.getString('nom');

        if (!newName.includes('île') && !newName.includes('ile')) {
            return interaction.reply({content: 'Le nom de l\'île doit contenir le mot "île" ou "ile".', ephemeral: true});
        }

        await interaction.channel.setName('🏝│' + newName);
        return interaction.reply({content: 'Vous avez renommé l\'île en **' + newName + '** !', ephemeral: true});
    },
};