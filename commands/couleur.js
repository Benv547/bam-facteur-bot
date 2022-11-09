const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");
const roles = require("../utils/roles");

module.exports = {
    public: true,
    price: 500,
    data: new SlashCommandBuilder()
        .setName('couleur')
        .setDescription('Choisissez la couleur de vos messages dans vos bouteilles !')
        .addStringOption(option =>
            option.setName('hex')
                .setDescription('La couleur de la bouteille')),
    async execute(interaction) {

        let price = this.price;
        if (await roles.userIsBooster(interaction.member)) {
            price = Math.round(price * 0.5);
        } else if (await roles.userIsVip(interaction.member)) {
            price = Math.round(price * 0.8);
        }

        if(!await orAction.reduce(interaction.user.id, price)) {
            const embed = createEmbeds.createFullEmbed('Il manque quelque chose..', 'Vous n\'avez pas assez d\'argent pour changer de couleur !\nEconomisez **' + price + ' pièces d\'or** et revenez me voir !', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }

        // set random hex color
        let color = Math.floor(Math.random()*16777215).toString(16);

        let codeGivenByUser = interaction.options.getString('hex');
        if (codeGivenByUser !== null) {
            color = codeGivenByUser;
            if (color.length !== 6) {
                const embed = createEmbeds.createFullEmbed('Erreur', 'Le code hexadécimal doit être composé de 6 caractères !', null, null, null, null);
                return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
            }
        }

        // set lowerCase
        color = color.toLowerCase();

        const url = 'https://singlecolorimage.com/get/' + color + '/400x400.png'
        const embed = createEmbeds.createFullEmbed('Une couleur qui en jette !', 'Voici votre couleur pour vos prochaines bouteilles !', null, url, null, 'Code de la couleur : ' + color);

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        await userDB.update_color(interaction.user.id, color);

        return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};