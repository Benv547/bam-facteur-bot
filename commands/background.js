const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
const backgroundDB = require("../database/background");
const userDB = require("../database/user");
const createEmbeds = require("../utils/createEmbeds");

const DEFAULT = 1;

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('fond')
        .setDescription('Regardez et changez le fond de vos bouteilles !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom du fond')),
    async execute(interaction) {
        if (interaction.options.getString('nom') === null) {
            await this.runMenu(interaction);
        } else {
            let background_name = interaction.options.getString('nom');

            if (background_name.toLocaleLowerCase().includes('défaut')) {
                const background = await backgroundDB.getBackground(DEFAULT);
                await backgroundDB.setAppliedBackgroundFromUser(DEFAULT, interaction.user.id, interaction.guildId);
                const embed = createEmbeds.createFullEmbed('Fond changé', 'Votre fond a bien été changé !', null, background.url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }

            const background = await backgroundDB.getBackgroundFromUserWithName(interaction.user.id, background_name);
            if (background.length === 0) {
                return interaction.reply({content: 'Ce fond n\'existe pas.', ephemeral: true});
            } else if (background.length > 1) {
                return interaction.reply({content: 'Plusieurs fonds ont ce nom, veuillez préciser.', ephemeral: true});
            } else {
                await backgroundDB.setAppliedBackgroundFromUser(background[0].id_background, interaction.user.id, interaction.guildId);

                const embed = createEmbeds.createFullEmbed('Fond changé', 'Votre fond a bien été changé !', null, background[0].url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }
        }
    },

    async runMenu(interaction, index = 0) {
        const backgrounds = await backgroundDB.getAllBackgroundsFromUser(interaction.user.id, index * 25, 25);

        if (backgrounds.length === 0) {
            return interaction.deferUpdate();
        }

        let content = '';

        const current_background = await backgroundDB.getAppliedBackgroundFromUser(interaction.user.id, interaction.guildId);
        content = 'Votre fond actuellement équipé est **' + current_background.name + '**';

        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Choisissez un fond');

            for (const background of backgrounds) {
                const background_item = await backgroundDB.getBackground(background.id_background);
                let rarity = 'commun';
                if (background_item.sharable_percentage == 0) rarity = 'trophée'; // trophée
                else if (background_item.sharable_percentage <= 0.01) rarity = 'mythique'; // 1%
                else if (background_item.sharable_percentage <= 0.1) rarity = 'légendaire'; // 10%
                else if (background_item.sharable_percentage <= 0.25) rarity = 'épic'; // 25%
                else if (background_item.sharable_percentage <= 0.5) rarity = 'rare'; // 50%
                
                select.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(background_item.name)
                        .setDescription('Fond ' + rarity)
                        .setValue(background_item.name),
                );
            }
        
        const rowB = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('select_background')
                    .setLabel('Valider')
                    .setStyle(ButtonStyle.Primary),
            )

        if (backgrounds.length === 25) {
            rowB
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('show_more_' + index)
                        .setLabel('Voir plus')
                        .setStyle(ButtonStyle.Secondary),
                )
        }

        const rowS = new ActionRowBuilder()
            .addComponents(select);

        const embed = createEmbeds.createFullEmbed("Vos fonds", content, null, current_background.url, null, 'Faite /background <nom> pour changer de background');
        let message;
        if (index === 0) {
            message = await interaction.reply({content: '', embeds: [embed], components: [rowS, rowB], ephemeral: true});
        }
        else {
            interaction.update({content: '', embeds: [embed], components: [rowS, rowB], ephemeral: true});
            message = await interaction.channel.messages.fetch(interaction.message.id);
        }
 
        const collectorSelect = message.createMessageComponentCollector({ componentType: ComponentType.StringSelectMenuBuilder, time: 60000 });
        collectorSelect.on('collect', async i => {
            if (i.customId === 'starter') {
                const background_name = i.values[0];
                const background = await backgroundDB.getBackgroundFromUserWithName(interaction.user.id, background_name);
                const embed = createEmbeds.createFullEmbed('Vos fonds', 'Le fond actuellement sélectionné est **' + background[0].name + '**.\nCelui actuellement équipé est **' + current_background.name + '**.', null, background[0].url, null, 'Faite /background <nom> pour changer de background');
                return i.update({content: '', embeds: [embed], ephemeral: true});
            }
        });
        const collectorButton = message.createMessageComponentCollector({ componentType: ComponentType.ButtonBuilder, time: 60000 });
        collectorButton.on('collect', async i => {
            if (i.customId === 'select_background') {
                // fetch message
                const message = await i.channel.messages.fetch(i.message.id);
                // find background name from embed with regex
                const background_name = message.embeds[0].description.match(/\*\*(.*)\*\*/)[1];
                console.log(background_name);
                const background = await backgroundDB.getBackgroundFromUserWithName(interaction.user.id, background_name);
                await backgroundDB.setAppliedBackgroundFromUser(background[0].id_background, interaction.user.id, interaction.guildId);
                const embed = createEmbeds.createFullEmbed('Fond changé', 'Votre fond a bien été changé !', null, background[0].url, null, null);
                return i.update({content: '', embeds: [embed], ephemeral: true, components: []});
            }
            if (i.customId.startsWith('show_more_')) {
                const index = parseInt(i.customId.replace('show_more_', ''))
                return await this.runMenu(i, index + 1);
            }
        });
    }
};