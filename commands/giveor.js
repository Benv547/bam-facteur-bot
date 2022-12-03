const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const orAction = require('../utils/orAction.js');
const roles = require("../utils/roles");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveor')
        .setDescription('Permet de donner des <:piece:1045638309235404860>.')
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
            const embed = createEmbeds.createFullEmbed('Quelle chance !', 'Vous avez reçu **' + money + ' <:piece:1045638309235404860>** !', null, null, 0x2f3136, null);

            // Send direct message to user
            try {
                await user.send({content: "", embeds: [embed]});
            } catch {
            }
            return await interaction.reply({ content:'C\'est fait.', ephemeral: true});
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};