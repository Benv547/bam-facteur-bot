const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const roles = require('../utils/roles.js');
const createEmbeds = require("../utils/createEmbeds");
const roleDB = require("../database/role");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Permet de créer un rôle dans le salon.')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji of the role')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role')
                .setDescription('The role id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the role')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('getRole')
                        .setLabel(interaction.options.getString('emoji'))
                        .setStyle(ButtonStyle.Secondary),
                );
            const embed = createEmbeds.createFullEmbed('', interaction.options.getString('description'), null, null, 0x2f3136, null);
            const message = await interaction.channel.send({ content: "", embeds: [embed], components: [row] });
            await roleDB.insertRole(interaction.options.getString('role'), message.id);
            return await interaction.reply({ content:'C\'est fait.', ephemeral: true});
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};