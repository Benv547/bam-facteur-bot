const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');
const roles = require('../utils/roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Initialize the #ma_bouteille message\'s')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of the init')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            if (interaction.options.getString('type') === 'ticket') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createTicket')
                            .setLabel('Click me!')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: 'I think you should,', components: [row] });
            } else if (interaction.options.getString('type') === 'bottle') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createBottle')
                            .setLabel('Click me!')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: 'I think you should,', components: [row] });
            } else if (interaction.options.getString('type') === 'opinion') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createOpinion')
                            .setLabel('Click me!')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: 'I think you should,', components: [row] });
            } else if (interaction.options.getString('type') === 'suggestion') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createSuggestion')
                            .setLabel('Click me!')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: 'I think you should,', components: [row] });
            } else if (interaction.options.getString('type') === 'help') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createHelp')
                            .setLabel('Click me!')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: 'I think you should,', components: [row] });
            }
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};