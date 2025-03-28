const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");
const roles = require("../utils/roles");

module.exports = {
    public: true,
    price: 500,
    data: new SlashCommandBuilder()
        .setName('signature')
        .setDescription('Choisissez la signature de vos bouteilles !')
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('La signature de la bouteille')
                .setRequired(true)),
    async execute(interaction) {

        let price = this.price;
        if (await roles.userIsBooster(interaction.member)) {
            price = Math.round(price * 0.5);
        } else if (await roles.userIsVip(interaction.member)) {
            price = Math.round(price * 0.8);
        }

        if(!await orAction.reduce(interaction.user.id, price)) {
            const embed = createEmbeds.createFullEmbed('Il manque quelque chose..', 'Vous n\'avez pas assez d\'argent pour changer de signature !\nEconomisez **' + price + ' <:piece:1045638309235404860>** et revenez me voir !', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }

        const signature = interaction.options.getString('texte');

        const embed = createEmbeds.createFullEmbed('Signé et approuvé !', 'Voici votre signature pour vos prochaines bouteilles !\n\n"**'+ signature +'**"', null, null, null, null);

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        await userDB.update_signature(interaction.user.id, signature);
        return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};