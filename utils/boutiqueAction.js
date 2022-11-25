const stickerDB = require("../database/sticker");
const boutiqueDB = require("../database/boutique");
const orAction = require("./orAction");
const createEmbeds = require("./createEmbeds");
const footerDB = require("../database/footer");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    buyItem: async function (interaction, categorie, item) {
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

            const product = await boutiqueDB.getProductByIdItem(sticker.id_sticker, categorie);
            if (product === null) {
                return await interaction.reply({ content:'Ce sticker n\'est pas en vente.', ephemeral: true });
            }
            if (await orAction.reduce(interaction.user.id, product.price)) {
                await stickerDB.giveStickerToUser(interaction.user.id, sticker.id_sticker, interaction.guildId);
                return await interaction.reply({ content:'Vous avez acheté le sticker **' + sticker.name + '** pour **' + product.price + ' pièces d\'or**.', ephemeral: true });
            }
            return await interaction.reply({ content:'Vous n\'avez pas assez d\'or pour acheter ce sticker.', ephemeral: true });
        } else if (categorie == 'arabesque') {
            let footers = await footerDB.getFooterFromUserWithName(interaction.user.id, item);
            if (footers !== null && footers.length > 0) {
                return await interaction.reply({ content:'Vous avez déjà cet item.', ephemeral: true });
            }
            footers = await footerDB.getFooterWithName(item);
            if (footers === null || footers.length == 0) {
                return await interaction.reply({ content:'Aucune arabesque ne correspond à ce nom.', ephemeral: true });
            } else if (footers.length > 1) {
                return await interaction.reply({ content:'Plusieurs arabesques correspondent à ce nom, veuillez préciser.', ephemeral: true });
            }
            const footer = footers[0];

            const product = await boutiqueDB.getProductByIdItem(footer.id_footer, categorie);
            if (product === null) {
                return await interaction.reply({ content:'Cette arabesque n\'est pas en vente.', ephemeral: true });
            }
            if (await orAction.reduce(interaction.user.id, product.price)) {
                await footerDB.giveFooterToUser(interaction.user.id, footer.id_footer, interaction.guildId);
                return await interaction.reply({ content:'Vous avez acheté l\'arabesque **' + footer.name + '** pour **' + product.price + ' pièces d\'or**.', ephemeral: true });
            }
            return await interaction.reply({ content:'Vous n\'avez pas assez d\'or pour acheter cette arabesque.', ephemeral: true });
        }
        return await interaction.reply({ content:'Cette catégorie n\'existe pas.', ephemeral: true });
    },
    diplayShop: async function (interaction) {
        const items = await boutiqueDB.getProductOnBoutique();

        let types = [];

        for (const item of items) {

            if (!types.includes(item.type)) {
                types.push(item.type);
                await interaction.channel.send({ content: '**' + item.type.toUpperCase() + '**' });
            }

            const textExample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer enim neque volutpat ac tincidunt vitae semper. Fames ac turpis egestas integer eget aliquet nibh. Faucibus purus in massa tempor nec feugiat nisl pretium fusce.";
            const randomText = "boutique";
            const randomHexColor = Math.floor(Math.random() * 16777215).toString(16);

            if (item.type === 'sticker') {
                const sticker = await stickerDB.getSticker(item.id_item);
                const embed = await createEmbeds.createBottle(textExample, randomText, sticker.id_sticker, "Un•e illustre inconnu•e", randomHexColor, null);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buyItem_' + item.type + '_' + sticker.name)
                            .setLabel(item.price + ' (acheter)')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('1045638309235404860'),
                    );
                await interaction.channel.send({ embeds: [embed], components: [row] });
            } else if (item.type === 'arabesque') {
                const footer = await footerDB.getFooter(item.id_item);
                const embed = await createEmbeds.createBottle(textExample, randomText, 1, "Un•e illustre inconnu•e", randomHexColor, footer.id_footer);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buyItem_' + item.type + '_' + footer.name)
                            .setLabel(item.price + ' (acheter)')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('1045638309235404860'),
                    );
                await interaction.channel.send({ embeds: [embed], components: [row] });
            }
        }
    }
}