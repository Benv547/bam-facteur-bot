const {SlashCommandBuilder} = require("discord.js");

const backgroundDB = require("../database/background");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('voir')
        .setDescription('Voir un item !')
        .addStringOption(option =>
            option.setName('catégorie')
                .setDescription('La catégorie de boutique')
                .setRequired(true)
                .setChoices(
                    { name: 'Fond', value: 'background' },
                ))
        .addStringOption(option =>
            option.setName('item')
                .setDescription('L\'item à voir')
                .setRequired(true)),
    async execute(interaction) {
        const categorie = interaction.options.get('catégorie').value;
        const item = interaction.options.get('item').value;

        if (categorie == 'background') {
            const backgrounds = await backgroundDB.getBackgroundWithName(item);
            if (backgrounds === null || backgrounds.length == 0) {
                return await interaction.reply({content: 'Aucun fond ne correspond à ce nom.', ephemeral: true});
            }
            if (backgrounds.length === 1) {
                const background = backgrounds[0];
                const embed = createEmbeds.createFullEmbed('Fond ' + background.name, null, null, background.url, 0x2f3136, null);
                return await interaction.reply({content: "", embeds: [embed], ephemeral: true});
            } else {
                return await interaction.reply({ content: 'Plusieurs fonds correspondent à ce nom, veuillez préciser.', ephemeral: true });
            }
        }

        return await interaction.reply({ content: 'Cette catégorie n\'existe pas.', ephemeral: true });
    }
};