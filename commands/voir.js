const {SlashCommandBuilder} = require("discord.js");

const stickerDB = require("../database/sticker");
const footerDB = require("../database/footer");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('see')
        .setDescription('See an item!')
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
                .setDescription('The item to see')
                .setRequired(true)),
    async execute(interaction) {
        const categorie = interaction.options.get('category').value;
        const item = interaction.options.get('item').value;

        if (categorie == 'sticker') {
            const stickers = await stickerDB.getStickerWithName(item);
            if (stickers === null || stickers.length == 0) {
                return await interaction.reply({ content:'No sticker matches this name.', ephemeral: true});
            }
            if (stickers.length === 1) {
                const sticker = stickers[0];
                const embed = createEmbeds.createFullEmbed('Sticker ' + sticker.name, null, null, sticker.url, 0x2f3136, null);
                return await interaction.reply({content: "", embeds: [embed], ephemeral: true});
            } else {
                return await interaction.reply({ content: 'Several stickers have this name, please specify.', ephemeral: true });
            }
        } else if (categorie == 'arabesque') {
            const footers = await footerDB.getFooterWithName(item);
            if (footers === null || footers.length == 0) {
                return await interaction.reply({content: 'No arabesque matches this name.', ephemeral: true});
            }
            if (footers.length === 1) {
                const footer = footers[0];
                const embed = createEmbeds.createFullEmbed('Arabesque ' + footer.name, null, null, footer.url, 0x2f3136, null);
                return await interaction.reply({content: "", embeds: [embed], ephemeral: true});
            } else {
                return await interaction.reply({content: 'Several arabesques have this name, please specify.', ephemeral: true});
            }
        }

        return await interaction.reply({ content: 'This category dosn\'t exist.', ephemeral: true });
    }
};