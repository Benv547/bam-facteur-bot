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
        .setName('shop')
        .setDescription('See the bot shops!')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category of shop')
                .setRequired(true)
                .setChoices(
                    { name: 'Sticker', value: 'sticker' },
                    { name: 'Arabesque', value: 'arabesque' },
                ))
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item to purchase')),
    async execute(interaction) {

        const categorie = interaction.options.get('category').value;
        const item = interaction.options.get('item')?.value;

        if (item) {
            return await boutiqueAction.buyItem(interaction, categorie, item);
        }

        const items = await boutiqueDB.getProductByTypeOnBoutique(categorie);

        if (items === null || items.length == 0) {
            return await interaction.reply({ content: 'This category does not exist or is empty.', ephemeral: true });
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
                    message += '• **~~' + sticker.name + '~~** - owned\n';
                } else {
                    message += '• **' + sticker.name + '**: ' + item.price + ' <:gold:1058066245154525265>\n';
                }
            } else if (categorie === 'arabesque') {
                const footer = await footerDB.getFooter(item.id_item);
                const footers = await footerDB.getFooterFromUserWithName(interaction.user.id, footer.name);
                if (footers.length > 0) {
                    message += '• **~~' + footer.name + '~~** - owned\n';
                } else {
                    message += '• **' + footer.name + '**: ' + item.price + ' <:gold:1058066245154525265>\n';
                }
            }
        }

        const embed = createEmbeds.createFullEmbed('Bottle in the Sea Shop', '**These are the items in the category __' + categorie.toUpperCase() + '__":**\n\n' + message, 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/shopping-cart_1f6d2.png', null, 0x2f3136, 'To purchase an item, do /shop [category] <item> or /see [category] [item] to view it.', false);

        // Send embed
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};