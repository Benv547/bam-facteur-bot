const { SlashCommandBuilder } = require('discord.js');
const stickerDB = require("../database/sticker");
const userDB = require("../database/user");
const createEmbeds = require("../utils/createEmbeds");

const DEFAULT = 21;

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('sticker')
        .setDescription('Look and change the sticker of your bottles!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the sticker')),
    async execute(interaction) {
        if (interaction.options.getString('name') === null) {
            const stickers = await stickerDB.getAllStickersFromUser(interaction.user.id);
            let message = '';
            if (stickers === null) {
                message = 'You don\'t have any sticker!';
            } else {
                message = 'Here\'s your stickers:\n';
                for (const sticker of stickers) {
                    const sticker_item = await stickerDB.getSticker(sticker.id_sticker);
                    let rarity = 'common';
                    if (sticker_item.sharable_percentage == 0) rarity = 'trophy'; // trophée
                    else if (sticker_item.sharable_percentage <= 0.01) rarity = 'mythic'; // 1%
                    else if (sticker_item.sharable_percentage <= 0.1) rarity = 'legendary'; // 10%
                    else if (sticker_item.sharable_percentage <= 0.25) rarity = 'epic'; // 25%
                    else if (sticker_item.sharable_percentage <= 0.5) rarity = 'uncommon'; // 50%
                    message += '• **' + sticker_item.name + '** (*' + rarity + '*)\n';
                }
                message += '\n';
                const current_sticker = await userDB.get_id_sticker(interaction.user.id);
                if (current_sticker !== null) {
                    const current_sticker_item = await stickerDB.getSticker(current_sticker);
                    message += 'Your currently equipped sticker is **' + current_sticker_item.name + '**';
                } else {
                    message += 'You don\'t have any sticker at the moment!';
                }
            }

            const embed = createEmbeds.createFullEmbed("Your stickers", message, null, null, null, 'Do /sticker <name> to change the sticker');
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        } else {
            let sticker_name = interaction.options.getString('name');

            if (sticker_name.toLocaleLowerCase().includes('défaut')) {
                const sticker = await stickerDB.getSticker(DEFAULT);
                await userDB.update_id_sticker(interaction.user.id, DEFAULT);
                const embed = createEmbeds.createFullEmbed('Sticker changed', 'Your sticker was well changed!', null, sticker.url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }

            const sticker = await stickerDB.getStickerFromUserWithName(interaction.user.id, sticker_name);
            if (sticker.length === 0) {
                return interaction.reply({content: 'This sticker dosn\'t exst.', ephemeral: true});
            } else if (sticker.length > 1) {
                return interaction.reply({content: 'Several stickers have this name, please specify.', ephemeral: true});
            } else {
                await userDB.update_id_sticker(interaction.user.id, sticker[0].id_sticker);

                const embed = createEmbeds.createFullEmbed('Sticker changed', 'Your sticker was well changed!', null, sticker[0].url, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }
        }
    },
};