const { SlashCommandBuilder} = require('discord.js');

const stickerDB = require("../database/sticker");
const footerDB = require("../database/footer");
const boutiqueDB = require("../database/boutique");
const boutiqueAction = require("../utils/boutiqueAction");
const createEmbeds = require("../utils/createEmbeds");
const roles = require("../utils/roles");

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
                    { name: 'Arabesque', value: 'arabesque' },
                ))
        .addStringOption(option =>
            option.setName('item')
                .setDescription('L\'item à acheter')),
    async execute(interaction) {

        const categorie = interaction.options.get('catégorie').value;
        const item = interaction.options.get('item')?.value;

        if (item) {
            return await boutiqueAction.buyItem(interaction, categorie, item);
        }

        const items = await boutiqueDB.getProductByTypeOnBoutique(categorie);

        if (items === null || items.length == 0) {
            return await interaction.reply({ content: 'Cette catégorie n\'existe pas ou est vide.', ephemeral: true });
        }

        if (await roles.userIsBooster(interaction.member)) {
            for (let i = 0; i < items.length; i++) {
                items[i].price = Math.round(items[i].price * 0.5);
            }
        }
        else if (await roles.userIsVip(interaction.member)) {
            for (let i = 0; i < items.length; i++) {
                items[i].price = Math.round(items[i].price * 0.75);
            }
        }

        let message = '';
        for (const item of items) {
            if (categorie === 'sticker') {
                const sticker = await stickerDB.getSticker(item.id_item);
                const stickers = await stickerDB.getStickerFromUserWithName(interaction.user.id, sticker.name);
                if (stickers.length > 0) {
                    message += '• **~~' + sticker.name + '~~** - possédé\n';
                } else {
                    message += '• **' + sticker.name + '** : ' + item.price + ' <:piece:1045638309235404860>\n';
                }
            } else if (categorie === 'arabesque') {
                const footer = await footerDB.getFooter(item.id_item);
                const footers = await footerDB.getFooterFromUserWithName(interaction.user.id, footer.name);
                if (footers.length > 0) {
                    message += '• **~~' + footer.name + '~~** - possédé\n';
                } else {
                    message += '• **' + footer.name + '** : ' + item.price + ' <:piece:1045638309235404860>\n';
                }
            }
        }

        const embed = createEmbeds.createFullEmbed('Boutique de Bouteille à la mer', '**Voici les items de la catégorie "__' + categorie.toUpperCase() + '__" :**\n\n' + message, 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/shopping-cart_1f6d2.png', null, 0x2f3136, 'Pour acheter un item, faites /boutique [catégorie] <item> ou /voir [catégorie] [item] pour le voir.', false);

        // Send embed
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};