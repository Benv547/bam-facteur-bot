const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
const stickerDB = require("../database/sticker");
const userDB = require("../database/user");
const createEmbeds = require("../utils/createEmbeds");

const DEFAULT = 21;

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('sticker')
        .setDescription('Regardez et changez le sticker de vos bouteilles !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom du sticker')),
    async execute(interaction) {
        if (interaction.options.getString('nom') === null) {
            const stickers = await stickerDB.getAllStickersFromUser(interaction.user.id);
            let current_sticker_item = null;
            let content = '';

            const current_sticker = await userDB.get_id_sticker(interaction.user.id);
            if (current_sticker !== null) {
                current_sticker_item = await stickerDB.getSticker(current_sticker);
            } else {
                current_sticker_item = await stickerDB.getSticker(DEFAULT);
            }
            content = 'Votre sticker actuellement équipé est **' + current_sticker_item.name + '**';

            const select = new StringSelectMenuBuilder()
                .setCustomId('starter')
                .setPlaceholder('Choisissez un sticker');

                for (const sticker of stickers) {
                    const sticker_item = await stickerDB.getSticker(sticker.id_sticker);
                    let rarity = 'commun';
                    if (sticker_item.sharable_percentage == 0) rarity = 'trophée'; // trophée
                    else if (sticker_item.sharable_percentage <= 0.01) rarity = 'mythique'; // 1%
                    else if (sticker_item.sharable_percentage <= 0.1) rarity = 'légendaire'; // 10%
                    else if (sticker_item.sharable_percentage <= 0.25) rarity = 'épic'; // 25%
                    else if (sticker_item.sharable_percentage <= 0.5) rarity = 'rare'; // 50%
                    
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(sticker_item.name)
                            .setDescription('Sticker ' + rarity)
                            .setValue(sticker_item.name),
                    );
                }
            
            const rowB = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('select_sticker')
                        .setLabel('Valider')
                        .setStyle(ButtonStyle.Secondary),
                )

            const rowS = new ActionRowBuilder()
                .addComponents(select);

            const embed = createEmbeds.createFullEmbed("Vos stickers", content, null, current_sticker_item.url, null, 'Faite /sticker <nom> pour changer de sticker');
            const message = await interaction.reply({content: '', embeds: [embed], components: [rowS, rowB], ephemeral: true});
            
            const collectorSelect = message.createMessageComponentCollector({ componentType: ComponentType.StringSelectMenuBuilder, time: 60000 });
            collectorSelect.on('collect', async i => {
                if (i.customId === 'starter') {
                    const sticker_name = i.values[0];
                    const sticker = await stickerDB.getStickerFromUserWithName(interaction.user.id, sticker_name);
                    const embed = createEmbeds.createFullEmbed('Vos stickers', 'Le sticker actuellement sélectionné est **' + sticker[0].name + '**.\nCelui actuellement équipé est **' + current_sticker_item.name + '**.', null, sticker[0].url, null, 'Faite /sticker <nom> pour changer de sticker');
                    return i.update({content: '', embeds: [embed], ephemeral: true});
                }
            });
            const collectorButton = message.createMessageComponentCollector({ componentType: ComponentType.ButtonBuilder, time: 60000 });
            collectorButton.on('collect', async i => {
                if (i.customId === 'select_sticker') {
                    // fetch message
                    const message = await i.channel.messages.fetch(i.message.id);
                    // find sticker name from embed with regex
                    const sticker_name = message.embeds[0].description.match(/\*\*(.*)\*\*/)[1];
                    console.log(sticker_name);
                    const sticker = await stickerDB.getStickerFromUserWithName(interaction.user.id, sticker_name);
                    await userDB.update_id_sticker(interaction.user.id, sticker[0].id_sticker);
                    const embed = createEmbeds.createFullEmbed('Sticker changé', 'Votre sticker a bien été changé !', null, sticker[0].url, null, null);
                    return i.update({content: '', embeds: [embed], ephemeral: true, components: []});
                }
            });
            return;
        } else {
            let sticker_name = interaction.options.getString('nom');

            if (sticker_name.toLocaleLowerCase().includes('défaut')) {
                const sticker = await stickerDB.getSticker(DEFAULT);
                await userDB.update_id_sticker(interaction.user.id, DEFAULT);
                const embed = createEmbeds.createFullEmbed('Sticker changé', 'Votre sticker a bien été changé !', null, sticker.url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }

            const sticker = await stickerDB.getStickerFromUserWithName(interaction.user.id, sticker_name);
            if (sticker.length === 0) {
                return interaction.reply({content: 'Ce sticker n\'existe pas.', ephemeral: true});
            } else if (sticker.length > 1) {
                return interaction.reply({content: 'Plusieurs stickers ont ce nom, veuillez préciser.', ephemeral: true});
            } else {
                await userDB.update_id_sticker(interaction.user.id, sticker[0].id_sticker);

                const embed = createEmbeds.createFullEmbed('Sticker changé', 'Votre sticker a bien été changé !', null, sticker[0].url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }
        }
    },
};