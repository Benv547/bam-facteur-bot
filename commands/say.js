const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Bot speak for you.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('The thumbnail of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('The image of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('The footer of the embed')
                .setRequired(false)),
    async execute(interaction) {
        if (await roles.userIsMod(interaction.member)) {
            const embed = createEmbeds.createFullEmbed(interaction.options.getString('title'), interaction.options.getString('description'), interaction.options.getString('thumbnail'), interaction.options.getString('image'), 0x2f3136, interaction.options.getString('footer'), false);
            await interaction.channel.send({ content: "", embeds: [embed] });
            return await interaction.reply({ content:'Done.', ephemeral: true});
        }
        return interaction.reply({ content:'You don\'t have the right to do that..', ephemeral: true});
    },
};