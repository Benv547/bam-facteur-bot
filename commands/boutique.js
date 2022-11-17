const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const stickerDB = require("../database/sticker");
const userDB = require("../database/user");
const boutiqueDB = require("../database/boutique");
const orAction = require("../utils/orAction");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('boutique')
        .setDescription('Voir les boutiques du bot !')
        .addStringOption(option =>
            option.setName('catégorie')
                .setDescription('La catégorie de boutique')
                .setRequired(true)
                .setChoices(
                    { name: 'Sticker', value: 'sticker' },
                ))
        .addStringOption(option =>
            option.setName('item')
                .setDescription('L\'item à acheter')),
    async execute(interaction) {

        const categorie = interaction.options.get('catégorie').value;
        const item = interaction.options.get('item')?.value;

        if (item) {

            if (categorie == 'sticker') {
                let stickers = await stickerDB.getStickerFromUserWithName(interaction.user.id, item);
                if (stickers !== null && stickers.length > 0) {
                    return await interaction.reply({ content: 'Vous avez déjà cet item.', ephemeral: true });
                }
                stickers = await stickerDB.getStickerWithName(item);
                if (stickers === null || stickers.length == 0) {
                    return await interaction.reply({ content:'Aucun sticker ne correspond à ce nom.', ephemeral: true });
                } else if (stickers.length > 1) {
                    return await interaction.reply({ content:'Plusieurs stickers correspondent à ce nom, veuillez préciser.', ephemeral: true });
                }
                const sticker = stickers[0];

                const product = await boutiqueDB.getProductByIdItem(sticker.id_sticker);
                if (product === null) {
                    return await interaction.reply({ content:'Ce sticker n\'est pas en vente.', ephemeral: true });
                }
                if (await orAction.reduce(interaction.user.id, product.price)) {
                    await stickerDB.giveStickerToUser(interaction.user.id, sticker.id_sticker, interaction.guildId);
                    return await interaction.reply({ content:'Vous avez acheté le sticker **' + sticker.name + '** pour **' + product.price + ' pièces d\'or**.', ephemeral: true });
                }
                return await interaction.reply({ content:'Vous n\'avez pas assez d\'or pour acheter ce sticker.', ephemeral: true });
            }
            return await interaction.reply({ content:'Cette catégorie n\'existe pas.', ephemeral: true });
        }

        const items = await boutiqueDB.getProductByTypeOnBoutique(categorie);

        if (item === null || items.length == 0) {
            return await interaction.reply('Cette catégorie n\'existe pas ou est vide.');
        }

        let message = '';
        for (const item of items) {
            if (categorie == 'sticker') {
                const sticker = await stickerDB.getSticker(item.id_item);
                const stickers = await stickerDB.getStickerFromUserWithName(interaction.user.id, sticker.name);
                if (stickers.length > 0) {
                    message += '**~~' + sticker.name + '~~** - possédé\n';
                } else {
                    message += '• **' + sticker.name + '** : ' + item.price + ' pièces d\'or\n';
                }
            }
        }

        const embed = createEmbeds.createFullEmbed('Boutique de Bouteille à la mer', '**Voici les items de la catégorie "__' + categorie + '__" :**\n\n' + message, 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/shopping-cart_1f6d2.png', null, 0x2f3136, 'Pour acheter un item, utilisez la commande /boutique [catégorie] <item>', false);

        // Send embed
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};