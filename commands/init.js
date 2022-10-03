const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Initialize the #ma_bouteille message\'s'),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('createBottle')
                        .setLabel('Click me!')
                        .setStyle(ButtonStyle.Primary),
                );
            await interaction.reply({ content:'C\'est fait.', ephemeral: true});
            return interaction.channel.send({ content: 'I think you should,', components: [row] });
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};