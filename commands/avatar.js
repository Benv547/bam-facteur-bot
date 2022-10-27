const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Choisissez votre avatar !')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code of the avatar')),
    async execute(interaction) {

        const price = 100;
        if(!await orAction.reduce(interaction.user.id, price)) {
            const embed = createEmbeds.createFullEmbed('Il manque quelque chose..', 'Vous n\'avez pas assez d\'argent pour changer d\'avatar ! Economisez ' + price + ' pièces d\'or et revenez me voir !', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }

        let code = (Math.random() + 1).toString(36).substring(7);

        let codeGivenByUser = interaction.options.getString('code');
        if (codeGivenByUser !== null) {
            code = codeGivenByUser;
        }

        const url = 'https://avatars.dicebear.com/api/adventurer-neutral/' + code + '.png'
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