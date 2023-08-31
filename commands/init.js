const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');
const roles = require('../utils/roles.js');
const createEmbeds = require("../utils/createEmbeds");
const boutiqueAction = require("../utils/boutiqueAction");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Initialize the server messages.')
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
                            .setLabel('Create a ticket')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            } else if (interaction.options.getString('type') === 'bottle') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createBottle')
                            .setLabel('Create a bottle')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            } else if (interaction.options.getString('type') === 'bird') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createBird')
                            .setLabel('Create a bird')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            } else if (interaction.options.getString('type') === 'wanted') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createWanted')
                            .setLabel('Create a wanted notice')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            } else if (interaction.options.getString('type') === 'opinion') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createOpinion')
                            .setLabel('I give my feedback')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('**Your opinion is important!**',
                    'Do you like (or not) the server? **Leave us your feedback!\n' +
                    '\n' +
                    'Please note, suggestions must go in <#1030839758361993246>.',
                    'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/blue-heart_1f499.png',
                    null, 0x2f3136, null, false);
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (interaction.options.getString('type') === 'suggestion') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createSuggestion')
                            .setLabel('J\'ai une suggestion')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('**Suggestions**',
                    'To make the server progress, don\'t hesitate to send us your suggestions.\n' +
                    'You can also react to suggestions which you find interesting or not.',
                    'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/light-bulb_1f4a1.png',
                    null, 0x2f3136, null, false);
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (interaction.options.getString('type') === 'help') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createHelp')
                            .setLabel('I need help')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('',
                    ':warning: **You have a question?** the community answers it!\n' +
                    'Write your question by clicking below and answer by opening the thread.',
                    null, null, 0x2f3136, null, false);
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (interaction.options.getString('type') === 'ile') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createIleMessage')
                            .setLabel('New message')
                            .setStyle(ButtonStyle.Secondary),
                    );
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            } else if (interaction.options.getString('type') === 'shop') {
                await interaction.reply({ content:'It\'s done.', ephemeral: true});
                return await boutiqueAction.diplayShop(interaction);
            }
        }
        return interaction.reply({ content:'You don\'t have the right to do that.', ephemeral: true});
    },
};