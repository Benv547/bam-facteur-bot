const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js');
const roles = require('../utils/roles.js');
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Initialise les messages du serveur.')
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
                            .setLabel('Créer un ticket')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            } else if (interaction.options.getString('type') === 'bottle') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createBottle')
                            .setLabel('Créer une bouteille')
                            .setStyle(ButtonStyle.Primary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            } else if (interaction.options.getString('type') === 'opinion') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createOpinion')
                            .setLabel('Je donne mon avis')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('**Votre avis compte !**',
                    'Vous aimez (ou pas) le serveur ? **Laissez-nous votre avis !**\n' +
                    '\n' +
                    'Attention, les suggestions doivent aller dans <#1030839758361993246>.',
                    'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/blue-heart_1f499.png',
                    null, 0x2f3136, null, false);
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
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
                    'Pour faire avancer le serveur, n\'hésitez pas à nous transmettre vos suggestions.\n' +
                    'Vous pouvez aussi réagir pour les suggestions que vous trouvez intéressantes ou non.',
                    'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/light-bulb_1f4a1.png',
                    null, 0x2f3136, null, false);
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (interaction.options.getString('type') === 'help') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createHelp')
                            .setLabel('J\'ai besoin d\'aide')
                            .setStyle(ButtonStyle.Primary),
                    );
                const embed = createEmbeds.createFullEmbed('',
                    ':warning: **Vous avez une question ?** La communauté y répond !\n' +
                    'Écrit ta question en cliquant en dessous et répond en ouvrant le fil de discussion.',
                    null, null, 0x2f3136, null, false);
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: '', embeds: [embed], components: [row] });
            } else if (interaction.options.getString('type') === 'ile') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createIleMessage')
                            .setLabel('Nouveau message')
                            .setStyle(ButtonStyle.Secondary),
                    );
                await interaction.reply({ content:'C\'est fait.', ephemeral: true});
                return interaction.channel.send({ content: '', components: [row] });
            }
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};