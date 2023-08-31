const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const orAction = require('../utils/orAction.js');
const userDB = require("../database/user");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('gold')
        .setDescription('Check your gold balance!'),
    async execute(interaction) {
        // Get the user's currency

        let title = 'A lot of money!';

        let money = await orAction.get(interaction.user.id);
        if (money == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
            money = 0;
        }

        if (money == 0) {
            title = 'Outch! Is empty..';
        }

        let textHelp = '';
        if (money < 200) {
            textHelp = '\n\nNeed to know how to earn gold? Check out <#1057755820433088582>!';
        }

        const embed = createEmbeds.createFullEmbed('What a well-filled purse!', 'Your balance is **' + money + ' <:gold:1058066245154525265>**!', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};