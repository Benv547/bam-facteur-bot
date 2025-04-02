const { SlashCommandBuilder, userMention } = require('discord.js');
const roles = require("../utils/roles");
const backgroundDB = require("../database/background");
// const footerDB = require("../database/footer");
const productDB = require("../database/product");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('asset')
        .setDescription('Permet de créer un asset (Background/Footer')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Le type de l\'asset')
                .setRequired(true)
                .setChoices(
                    { name: 'Fond', value: 'background' },
                ))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Le nom de l\'asset')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('L\'url de l\'asset')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prix')
                .setDescription('Le prix de l\'asset'))
        .addStringOption(option =>
            option.setName('gagnable')
                .setDescription('Défini si l\'asset est gagnable'))
        .addStringOption(option =>
            option.setName('partageable')
                .setDescription('Défini si l\'asset est partageable'))
        .addStringOption(option =>
            option.setName('chance_partageable')
                .setDescription('Défini la chance de partage')),
    async execute(interaction) {
        if (await roles.userIsMod(interaction.member)&&(await roles.userIsApprenti(interaction.member))===false) {
            const type = interaction.options.get('type').value;
            const name = interaction.options.get('name').value;
            const prix = interaction.options.get('prix') ? interaction.options.get('prix').value : null;
            const gagnable = interaction.options.get('gagnable') ? interaction.options.get('gagnable').value : false;
            const partageable = interaction.options.get('partageable') ? interaction.options.get('partageable').value : false;
            const chance_partageable = interaction.options.get('chance_partageable') ? interaction.options.get('chance_partageable').value : 0;
            const url = interaction.options.get('url').value;

            switch (type) {
                case 'background':
                {
                    const background = await backgroundDB.getBackgroundWithName(name);
                    if (background && background.length > 0) {
                        return await interaction.reply({ content: 'Un background avec ce nom existe déjà.', ephemeral: true })
                    }
                    const id = await backgroundDB.insertBackground(name, url, gagnable, partageable, chance_partageable);
                    if (!id) {
                        return await interaction.reply({ content: 'Impossible d\'insérer dans la base de données.', ephemeral: true })
                    }
                    if (prix && gagnable) {
                        await productDB.insertProduct(id, prix, 'background');
                    }
                }
                    break;
                default:
                    break;
            }
            return await interaction.reply({ content: 'Vous avez bien ajouté un nouvel asset.', ephemeral: true });
        }
        return interaction.reply({ content: 'Vous n\'avez pas le droit de faire cela.', ephemeral: true });
    },
};


