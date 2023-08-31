const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");
const roles = require("../utils/roles");

module.exports = {
    public: true,
    price: 500,
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Choose the color of your messages in your bottles!')
        .addStringOption(option =>
            option.setName('hex')
                .setDescription('The color of the bottle')),
    async execute(interaction) {

        let price = this.price;
        if (await roles.userIsBooster(interaction.member)) {
            price = Math.round(price * 0.5);
        } else if (await roles.userIsVip(interaction.member)) {
            price = Math.round(price * 0.8);
        }
        // set random hex color
        let color = Math.floor(Math.random()*16777215).toString(16);

        let codeGivenByUser = interaction.options.getString('hex');
        if (codeGivenByUser !== null) {
            color = codeGivenByUser;
            if (color.length !== 6) {
                const embed = createEmbeds.createFullEmbed('Error', 'The hexadecimal code must be composed of 6 characters!', null, null, null, null);
                return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
            }
        }


        if(!await orAction.reduce(interaction.user.id, price)) {
            const embed = createEmbeds.createFullEmbed('Something is missing..', 'You don\'t have enough money to change your color!\nSave **' + price + ' <:gold:1058066245154525265>** and come back!', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }


        // set lowerCase
        color = color.toLowerCase();

        const url = 'https://singlecolorimage.com/get/' + color + '/400x400.png'
        const embed = createEmbeds.createFullEmbed('A color that looks great!', 'This is your color for your next bottles!', null, url, null, 'Code of the color: ' + color);

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