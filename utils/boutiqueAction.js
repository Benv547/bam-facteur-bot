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
                return await interaction.reply({ content: 'You already have this item.', ephemeral: true });
            }
            stickers = await stickerDB.getStickerWithName(item);
            if (stickers === null || stickers.length == 0) {
                return await interaction.reply({ content:'No stickers matching this name.', ephemeral: true });
            } else if (stickers.length > 1) {
                return await interaction.reply({ content:'Several stickers match this name, please specify.', ephemeral: true });
            }
            const sticker = stickers[0];

            const product = await boutiqueDB.getProductByIdItem(sticker.id_sticker, categorie);
            if (product === null) {
                return await interaction.reply({ content:'This sticker is not in sale.', ephemeral: true });
            }

            if (await roles.userIsBooster(interaction.member)) {
                product.price = Math.round(product.price * 0.5);
            }
            else if (await roles.userIsVip(interaction.member)) {
                product.price = Math.round(product.price * 0.75);
            }

            if (await orAction.reduce(interaction.user.id, product.price)) {
                await stickerDB.giveStickerToUser(interaction.user.id, sticker.id_sticker, interaction.guildId);
                return await interaction.reply({ content:'You have purchased the sticker **' + sticker.name + '** for **' + product.price + ' <:gold:1058066245154525265>**.', ephemeral: true });
            }
            return await interaction.reply({ content:'You don\'t have enough gold to buy this sticker.', ephemeral: true });
        } else if (categorie == 'arabesque') {
            let footers = await footerDB.getFooterFromUserWithName(interaction.user.id, item);
            if (footers !== null && footers.length > 0) {
                return await interaction.reply({ content:'You already have this item.', ephemeral: true });
            }
            footers = await footerDB.getFooterWithName(item);
            if (footers === null || footers.length == 0) {
                return await interaction.reply({ content:'No arabesques matching this name.', ephemeral: true });
            } else if (footers.length > 1) {
                return await interaction.reply({ content:'Several arabesques match this name, please specify.', ephemeral: true });
            }
            const footer = footers[0];

            const product = await boutiqueDB.getProductByIdItem(footer.id_footer, categorie);
            if (product === null) {
                return await interaction.reply({ content:'This arabesque is not in sale.', ephemeral: true });
            }

            if (await roles.userIsBooster(interaction.member)) {
                product.price = Math.round(product.price * 0.5);
            }
            else if (await roles.userIsVip(interaction.member)) {
                product.price = Math.round(product.price * 0.75);
            }

            if (await orAction.reduce(interaction.user.id, product.price)) {
                await footerDB.giveFooterToUser(interaction.user.id, footer.id_footer, interaction.guildId);
                return await interaction.reply({ content:'You have purchased the arabesque **' + footer.name + '** for **' + product.price + ' <:gold:1058066245154525265>**.', ephemeral: true });
            }
            return await interaction.reply({ content:'You don\'t have enough gold to buy this arabesque.', ephemeral: true });
        }
        return await interaction.reply({ content:'This category doesn\'t exist.', ephemeral: true });
    },
    diplayShop: async function (interaction) {
        const items = await boutiqueDB.getProductOnBoutique();

        let types = [];

        for (const item of items) {

            if (!types.includes(item.type)) {
                if (types.length === 0) {
                    await interaction.channel.send({ content: '**' + item.type.toUpperCase() + 'S**' });
                } else {
                    await interaction.channel.send({ content: '** **\n\n\n**' + item.type.toUpperCase() + 'S**' });
                }
                types.push(item.type);
            }

            const textExample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer enim neque volutpat ac tincidunt vitae semper. Fames ac turpis egestas integer eget aliquet nibh. Faucibus purus in massa tempor nec feugiat nisl pretium fusce.";
            const randomText = "boutique";
            const randomHexColor = Math.floor(Math.random() * 16777215).toString(16);

            if (item.type === 'sticker') {
                const sticker = await stickerDB.getSticker(item.id_item);
                const embed = await createEmbeds.createBottle(textExample, randomText, sticker.id_sticker, "An illustrious stranger", randomHexColor, 8);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buyItem_' + item.type + '_' + sticker.name)
                            .setLabel(item.price + ' (' + sticker.name + ')')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('1045638309235404860'),
                    );
                await interaction.channel.send({ content: "** **", embeds: [embed], components: [row] });
            } else if (item.type === 'arabesque') {
                const footer = await footerDB.getFooter(item.id_item);
                const embed = await createEmbeds.createBottle(textExample, randomText, 1, "An illustrious stranger", randomHexColor, footer.id_footer);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buyItem_' + item.type + '_' + footer.name)
                            .setLabel(item.price + ' (' + footer.name + ')')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('1045638309235404860'),
                    );
                await interaction.channel.send({ content: "** **", embeds: [embed], components: [row] });
            }
        }

        return await interaction.channel.send({ content: '** **\n\n\n__Reminder:__\n- **Boosters** get **50% off** the entire store.\n- **VIPs** have **25% off** the entire store.\n(*The price displayed is the public price.*)' });
    }
}