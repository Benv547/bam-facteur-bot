const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");
const roles = require("../utils/roles");

module.exports = {
    public: true,
    price: 250,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Choisissez l\'avatar de vos bouteilles !')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Le code de l\'avatar')),
    async execute(interaction) {

        let price = this.price;
        if (await roles.userIsBooster(interaction.member)) {
            price = Math.round(price * 0.5);
        } else if (await roles.userIsVip(interaction.member)) {
            price = Math.round(price * 0.8);
        }

        if(!await orAction.reduce(interaction.user.id, price )) {
            const embed = createEmbeds.createFullEmbed('Il manque quelque chose..', 'Vous n\'avez pas assez d\'argent pour changer d\'avatar !\nEconomisez **' + price + ' <:piece:1045638309235404860>** et revenez me voir !', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }

        let code = (Math.random() + 1).toString(36).substring(7);

        let codeGivenByUser = interaction.options.getString('code');
        if (codeGivenByUser !== null) {
            code = codeGivenByUser;
        }

        const url = 'https://api.dicebear.com/7.x/adventurer-neutral/png?seed=' + code
        const embed = createEmbeds.createFullEmbed('Encore un super avatar !', 'Voici votre avatar pour vos prochaines bouteilles !', null, url, null, 'Code de l\'avatar : ' + code);

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        await userDB.update_diceBearSeed(interaction.user.id, code);

        return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};
