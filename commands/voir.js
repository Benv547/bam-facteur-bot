const {SlashCommandBuilder} = require("discord.js");

const stickerDB = require("../database/sticker");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('voir')
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
                .setDescription('L\'item à voir')
                .setRequired(true)),
    async execute(interaction) {
        const categorie = interaction.options.get('catégorie').value;
        const item = interaction.options.get('item').value;

        if (categorie == 'sticker') {
            const stickers = await stickerDB.getStickerWithName(item);
            if (stickers === null || stickers.length == 0) {
                return await interaction.reply('Aucun sticker ne correspond à ce nom.');
            }
            if (stickers.length === 1) {
                const sticker = stickers[0];
                const embed = createEmbeds.createFullEmbed('Sticker ' + sticker.name, null, null, sticker.url, 0x2f3136, null);
                return await interaction.reply({content: "", embeds: [embed], ephemeral: true});
            } else {
                return await interaction.reply('Plusieurs stickers correspondent à ce nom, veuillez préciser.');
            }
        }

        return await interaction.reply('Cette catégorie n\'existe pas.');
    }
};