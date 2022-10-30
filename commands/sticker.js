const { SlashCommandBuilder } = require('discord.js');
const stickerDB = require("../database/sticker");
const userDB = require("../database/user");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('sticker')
        .setDescription('Regardez et changez vos stickers !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom du sticker')),
    async execute(interaction) {
        if (interaction.options.getString('nom') === null) {
            const stickers = await stickerDB.getAllStickersFromUser(interaction.user.id);
            let message = '';
            if (stickers === null) {
                message = 'Vous n\'avez pas de sticker !';
            } else {
                message = 'Voici vos stickers :\n';
                for (const sticker of stickers) {
                    const sticker_item = await stickerDB.getSticker(sticker.id_sticker);
                    message += '• **' + sticker_item.name + '**\n';
                }
                message += '\n';
                const current_sticker = await userDB.get_id_sticker(interaction.user.id);
                if (current_sticker !== null) {
                    const current_sticker_item = await stickerDB.getSticker(current_sticker);
                    message += 'Votre sticker actuel est **' + current_sticker_item.name + '**';
                } else {
                    message += 'Vous n\'avez pas de sticker actuellement !';
                }
            }

            const embed = createEmbeds.createFullEmbed("Vos stickers", message, null, null, null, 'Faite /sticker <nom> pour changer de sticker');
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        } else {
            let sticker_name = interaction.options.getString('nom');
            sticker_name = sticker_name.charAt(0).toUpperCase() + sticker_name.slice(1).ToLowerCase();

            const sticker = await stickerDB.getStickerFromUserWithName(interaction.user.id, sticker_name);
            if (sticker.length === 0) {
                return interaction.reply({content: 'Ce sticker n\'existe pas.', ephemeral: true});
            } else if (sticker.length > 1) {
                return interaction.reply({content: 'Plusieurs bouteilles ont ce nom, veuillez préciser.', ephemeral: true});
            } else {
                await userDB.update_id_sticker(interaction.user.id, sticker[0].id_sticker);
                const embed = createEmbeds.createFullEmbed('Sticker changé', 'Votre sticker a bien été changé !', null, null, null, null);
                return interaction.reply({content: '', embeds: [embed], ephemeral: true});
            }
        }
    },
};