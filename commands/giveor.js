const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const orAction = require('../utils/orAction.js');
const roles = require("../utils/roles");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveor')
        .setDescription('Give some <:gold:1058066245154525265>.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The user id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('The quantity of gold coins to give')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Get the user
            const userId = interaction.options.getString('userid');
            const money = Number.parseInt(interaction.options.getString('amount'));
            // Set the user's currency
            await orAction.increment(userId, money);

            // Fetch user
            const user = await interaction.guild.members.fetch(userId);
            const embed = createEmbeds.createFullEmbed('What luck!', 'You received **' + money + ' <:gold:1058066245154525265>** !', null, null, 0x2f3136, null);

            // Send direct message to user
            try {
                await user.send({content: "", embeds: [embed]});
            } catch {
            }
            return await interaction.reply({ content:'Done.', ephemeral: true});
        }
        return interaction.reply({ content:'You\'re not allowed to do that.', ephemeral: true});
    },
};