const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('couleur')
        .setDescription('Choisissez votre couleur !')
        .addStringOption(option =>
            option.setName('hex')
                .setDescription('La couleur de la bouteille')),
    async execute(interaction) {
        // set random hex color
        let color = Math.floor(Math.random()*16777215).toString(16);

        let codeGivenByUser = interaction.options.getString('hex');
        if (codeGivenByUser !== null) {
            color = codeGivenByUser;
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