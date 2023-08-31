const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const xpAction = require('../utils/xpAction.js');
const roles = require("../utils/roles");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givexp')
        .setDescription('Gives <:xp:1058066266797113455> to a member.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The user id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('The quantity of experience to give')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Get the user
            const userId = interaction.options.getString('userid');
            const xp = Number.parseInt(interaction.options.getString('amount'));
            // Set the user's currency
            await xpAction.increment(interaction.guild, userId, xp);

            // Fetch user
            const user = await interaction.guild.members.fetch(userId);
            const embed = createEmbeds.createFullEmbed('What luck!', 'You\'ve received **' + xp + ' XP**!', null, null, 0x2f3136, null);

            // Send direct message to user
            try {
                await user.send({content: "", embeds: [embed]});
            } catch {
            }
            return await interaction.reply({ content:'Done.', ephemeral: true});
        }
        return interaction.reply({ content:'You don\'t have the right to do that.', ephemeral: true});
    },
};