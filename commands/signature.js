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
        .setDescription('Choose the signature of your bottles!')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The signature of the bottle')
                .setRequired(true)),
    async execute(interaction) {

        let price = this.price;
        if (await roles.userIsBooster(interaction.member)) {
            price = Math.round(price * 0.5);
        } else if (await roles.userIsVip(interaction.member)) {
            price = Math.round(price * 0.8);
        }

        if(!await orAction.reduce(interaction.user.id, price)) {
            const embed = createEmbeds.createFullEmbed('Something is missing..', 'You don\'t have enough money to change your signature!\nSave **' + price + ' <:gold:1058066245154525265>** and come back!', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }

        const signature = interaction.options.getString('text');

        const embed = createEmbeds.createFullEmbed('Signed and approved!', 'This is your signature for your next bottles!\n\n"**'+ signature +'**"', null, null, null, null);

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