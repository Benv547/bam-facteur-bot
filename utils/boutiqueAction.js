const stickerDB = require("../database/sticker");
const boutiqueDB = require("../database/boutique");
const orAction = require("./orAction");
const createEmbeds = require("./createEmbeds");
const footerDB = require("../database/footer");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const roles = require("./roles");

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

            if (await roles.userIsBooster(interaction.member)) {
                product.price = Math.round(product.price * 0.5);
            }
            else if (await roles.userIsVip(interaction.member)) {
                product.price = Math.round(product.price * 0.75);
            }

            if (await orAction.reduce(interaction.user.id, product.price)) {
                await stickerDB.giveStickerToUser(interaction.user.id, sticker.id_sticker, interaction.guildId);
                return await interaction.reply({ content:'Vous avez acheté le sticker **' + sticker.name + '** pour **' + product.price + ' <:piece:1045638309235404860>**.', ephemeral: true });
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

            if (await roles.userIsBooster(interaction.member)) {
                product.price = Math.round(product.price * 0.5);
            }
            else if (await roles.userIsVip(interaction.member)) {
                product.price = Math.round(product.price * 0.75);
            }

            if (await orAction.reduce(interaction.user.id, product.price)) {
                await footerDB.giveFooterToUser(interaction.user.id, footer.id_footer, interaction.guildId);
                return await interaction.reply({ content:'Vous avez acheté l\'arabesque **' + footer.name + '** pour **' + product.price + ' <:piece:1045638309235404860>**.', ephemeral: true });
            }
            return await interaction.reply({ content:'Vous n\'avez pas assez d\'or pour acheter cette arabesque.', ephemeral: true });
        }
        return await interaction.reply({ content:'Cette catégorie n\'existe pas.', ephemeral: true });
    },
    diplayShop: async function (channel) {

        // Clear channel
        await channel.bulkDelete(25);

        const items = await boutiqueDB.getProductOnBoutique();

        let types = [];

        for (const item of items) {

            if (!types.includes(item.type)) {
                if (types.length === 0) {
                    await channel.send({ content: '**' + item.type.toUpperCase() + 'S**' });
                } else {
                    await channel.send({ content: '** **\n\n\n**' + item.type.toUpperCase() + 'S**' });
                }
                types.push(item.type);
            }

            const textExample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer enim neque volutpat ac tincidunt vitae semper. Fames ac turpis egestas integer eget aliquet nibh. Faucibus purus in massa tempor nec feugiat nisl pretium fusce.";
            const randomText = "boutique";
            const randomHexColor = Math.floor(Math.random() * 16777215).toString(16);
            if (randomHexColor.length < 6) {
                randomHexColor = '0'.repeat(6 - randomHexColor.length) + randomHexColor;
            }

            if (item.type === 'sticker') {
                const sticker = await stickerDB.getSticker(item.id_item);
                const embed = await createEmbeds.createBottle(textExample, randomText, sticker.id_sticker, "Un•e illustre inconnu•e", randomHexColor, 8);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buyItem_' + item.type + '_' + sticker.name)
                            .setLabel(item.price + ' (' + sticker.name + ')')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('1045638309235404860'),
                    );
                await channel.send({ content: "** **", embeds: [embed], components: [row] });
            } else if (item.type === 'arabesque') {
                const footer = await footerDB.getFooter(item.id_item);
                const embed = await createEmbeds.createBottle(textExample, randomText, 1, "Un•e illustre inconnu•e", randomHexColor, footer.id_footer);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buyItem_' + item.type + '_' + footer.name)
                            .setLabel(item.price + ' (' + footer.name + ')')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('1045638309235404860'),
                    );
                await channel.send({ content: "** **", embeds: [embed], components: [row] });
            }
        }
        let message = "** **\n\n\n__Commandes utiles :__\n- /voir [categorie] [item] : voir un item de la boutique.\n- /boutique [categorie] [item] : acheter un item de la boutique.";
        return await channel.send({ content: message + '\n\n__Rappel :__\n- Les **boosters** ont **50% de réduction** sur toute la boutique.\n- Les **V.I.P.** ont **25% de réduction** sur toute la boutique.\n(*Le prix affiché est le prix public.*)' });
    },
    randomShop: async function () {
        // Remove all items from shop
        await boutiqueDB.removeAllItemsOnBoutique();

        // Stickers
        await boutiqueDB.set3RandomStickersWinnableInTheBoutique();

        // Footers
        await boutiqueDB.set3RandomArabesquesWinnableInTheBoutique();
    }
}