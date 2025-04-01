const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
// const footerDB = require("../database/footer");
const userDB = require("../database/user");
const createEmbeds = require("../utils/createEmbeds");

const DEFAULT = 8;

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('arabesque')
        .setDescription('Regardez et changez l\'arabesque de vos bouteilles !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom de l\'arabesque')),
    async execute(interaction) {
        if (interaction.options.getString('nom') === null) {
            await this.runMenu(interaction);
        } else {
            let footer_name = interaction.options.getString('nom');

            if (footer_name.toLocaleLowerCase().includes('défaut')) {
                const footer = await footerDB.getFooter(DEFAULT);
                await userDB.update_id_footer(interaction.user.id, DEFAULT);
                const embed = createEmbeds.createFullEmbed('Arabesque changée', 'Votre arabesque a bien été changée !', null, footer.url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }

            const footer = await footerDB.getFooterFromUserWithName(interaction.user.id, footer_name);
            if (footer.length === 0) {
                return interaction.reply({content: 'Cette arabesque n\'existe pas.', ephemeral: true});
            } else if (footer.length > 1) {
                return interaction.reply({content: 'Plusieurs arabesques ont ce nom, veuillez préciser.', ephemeral: true});
            } else {
                await userDB.update_id_footer(interaction.user.id, footer[0].id_footer);

                const embed = createEmbeds.createFullEmbed('Arabesque changée', 'Votre arabesque a bien été changée !', null, footer[0].url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }
        }
    },
    async runMenu(interaction, index = 0) {
        const footers = await footerDB.getAllFootersFromUser(interaction.user.id, 25 * index, 25);

        if (footers.length === 0) {
            return interaction.deferUpdate();
        }

        let current_footer_item = null;
        let content = '';

        const current_footer = await userDB.get_id_footer(interaction.user.id);
        if (current_footer !== null) {
            current_footer_item = await footerDB.getFooter(current_footer);
        } else {
            current_footer_item = await footerDB.getFooter(DEFAULT);
        }
        content = 'Votre arabesque actuellement équipé est **' + current_footer_item.name + '**';
        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Choisissez une arabesque');

            for (const footer of footers) {
                const footer_item = await footerDB.getFooter(footer.id_footer);
                let rarity = 'commun';
                if (footer_item.sharable_percentage == 0) rarity = 'trophée'; // trophée
                else if (footer_item.sharable_percentage <= 0.01) rarity = 'mythique'; // 1%
                else if (footer_item.sharable_percentage <= 0.1) rarity = 'légendaire'; // 10%
                else if (footer_item.sharable_percentage <= 0.25) rarity = 'épic'; // 25%
                else if (footer_item.sharable_percentage <= 0.5) rarity = 'rare'; // 50%
                
                select.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(footer_item.name)
                        .setDescription('Arabesque ' + rarity)
                        .setValue(footer_item.name),
                );
            }
        
        const rowB = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('select_footer')
                    .setLabel('Valider')
                    .setStyle(ButtonStyle.Secondary),
            )

        if (footers.length === 25) {
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

        const embed = createEmbeds.createFullEmbed("Vos arabesques", content, null, current_footer_item.url, null, 'Faite /arabesque <nom> pour changer d\'arabesque');
        
        let message;
        if (index === 0) {
            message = await interaction.reply({content: '', embeds: [embed], components: [rowS, rowB], ephemeral: true});
        } else {
            interaction.update({content: '', embeds: [embed], components: [rowS, rowB], ephemeral: true});
            message = await interaction.channel.messages.fetch(interaction.message.id);
        }
        const collectorSelect = message.createMessageComponentCollector({ componentType: ComponentType.StringSelectMenuBuilder, time: 60000 });
        collectorSelect.on('collect', async i => {
            if (i.customId === 'starter') {
                const footer_name = i.values[0];
                const footer = await footerDB.getFooterFromUserWithName(interaction.user.id, footer_name);
                const embed = createEmbeds.createFullEmbed('Vos arabesques', 'L\'arabesque actuellement sélectionnée est **' + footer[0].name + '**.\nCelle actuellement équipée est **' + current_footer_item.name + '**.', null, footer[0].url, null, 'Faite /arabesque <nom> pour changer d\'arabesque');
                return i.update({content: '', embeds: [embed], ephemeral: true});
            }
        });
        const collectorButton = message.createMessageComponentCollector({ componentType: ComponentType.ButtonBuilder, time: 60000 });
        collectorButton.on('collect', async i => {
            if (i.customId === 'select_footer') {
                // fetch message
                const message = await i.channel.messages.fetch(i.message.id);
                // find footer name from embed with regex
                const footer_name = message.embeds[0].description.match(/\*\*(.*)\*\*/)[1];
                console.log(footer_name);
                const footer = await footerDB.getFooterFromUserWithName(interaction.user.id, footer_name);
                await userDB.update_id_footer(interaction.user.id, footer[0].id_footer);
                const embed = createEmbeds.createFullEmbed('Arabesque changée', 'Votre arabesque a bien été changé !', null, footer[0].url, null, null);
                return i.update({content: '', embeds: [embed], ephemeral: true, components: []});
            }
            if (i.customId.startsWith('show_more_')) {
                const index = parseInt(i.customId.replace('show_more_', ''))
                return await this.runMenu(i, index + 1);
            }
        });
    }
};