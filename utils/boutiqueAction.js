const backgroundDB = require("../database/background");
const boutiqueDB = require("../database/boutique");
const orAction = require("./orAction");
const createEmbeds = require("./createEmbeds");
// const footerDB = require("../database/footer");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const roles = require("./roles");

module.exports = {
    buyItem: async function (interaction, categorie, item) {
        if (categorie === 'background') {
            let backgrounds = await backgroundDB.getBackgroundFromUserWithName(interaction.user.id, item);
            if (backgrounds !== null && backgrounds.length > 0) {
                return await interaction.reply({ content: 'Vous avez déjà ce fond.', ephemeral: true });
            }
            backgrounds = await backgroundDB.getBackgroundWithName(item);
            if (backgrounds === null || backgrounds.length === 0) {
                return await interaction.reply({ content:'Aucun fond ne correspond à ce nom.', ephemeral: true });
            } else if (backgrounds.length > 1) {
                return await interaction.reply({ content:'Plusieurs fonds correspondent à ce nom, veuillez préciser.', ephemeral: true });
            }
            const background = backgrounds[0];

            const product = await boutiqueDB.getProductByIdItem(background.id_background, categorie);
            if (product === null) {
                return await interaction.reply({ content:'Ce fond n\'est pas en vente.', ephemeral: true });
            }

            if (await roles.userIsBooster(interaction.member)) {
                product.price = Math.round(product.price * 0.5);
            }
            else if (await roles.userIsVip(interaction.member)) {
                product.price = Math.round(product.price * 0.75);
            }

            if (await orAction.reduce(interaction.user.id, product.price)) {
                await backgroundDB.giveBackgroundToUser(interaction.user.id, background.id_background, interaction.guildId);
                return await interaction.reply({ content:'Vous avez acheté le fond **' + background.name + '** pour **' + product.price + ' <:piece:1045638309235404860>**.', ephemeral: true });
            }
            return await interaction.reply({ content:'Vous n\'avez pas assez d\'or pour acheter ce fond.', ephemeral: true });
        }
        return await interaction.reply({ content:'Cette catégorie n\'existe pas.', ephemeral: true });
    },
    diplayShop: async function (channel) {

        // Clear channel
        try {
            await channel.bulkDelete(25);
        } catch (error) {
            console.error('Failed to delete messages: ', error);
        }

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
            let randomHexColor = Math.floor(Math.random() * 16777215).toString(16);
            if (randomHexColor.length < 6) {
                randomHexColor = '0'.repeat(6 - randomHexColor.length) + randomHexColor;
            }

            if (item.type === 'background') {
                const background = await backgroundDB.getBackground(item.id_item);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buyItem_' + item.type + '_' + background.name)
                            .setLabel(item.price + ' (' + background.name + ')')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('1045638309235404860'),
                    );
                await channel.send({ content: "** **", files: [background.url], components: [row] });
            }
        }
        let message = "** **\n\n\n__Commandes utiles :__\n- /voir [categorie] [item] : voir un item de la boutique.\n- /boutique [categorie] [item] : acheter un item de la boutique.";
        return await channel.send({ content: message + '\n\n__Rappel :__\n- Les **boosters** ont **50% de réduction** sur toute la boutique.\n- Les **V.I.P.** ont **25% de réduction** sur toute la boutique.\n(*Le prix affiché est le prix public.*)' });
    },
    randomShop: async function () {
        // Remove all items from shop
        await boutiqueDB.removeAllItemsOnBoutique();

        // Stickers
        await boutiqueDB.set3RandomBackgroundsWinnableInTheBoutique();

        // Footers
        await boutiqueDB.set3RandomArabesquesWinnableInTheBoutique();
    }
}