const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const hourlyDB = require("../database/hourly");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('cadeau')
        .setDescription('Obtenez chaque heure votre cadeau !'),
    async execute(interaction) {

        try {
            await hourlyDB.deleteHourly();
        } catch (error) {
            console.log(error);
        }

        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        if (await hourlyDB.checkHourly(interaction.user.id)) {
            const hour = await hourlyDB.get_hourly(interaction.user.id);
            const date = new Date(hour);
            const now = new Date();
            // calculate the minutes remaining from the last hourly
            const minutes = Math.round((date.getMinutes() + 60 - now.getMinutes()));
            const embed = createEmbeds.createFullEmbed('Vous êtes gourmant !', 'Vous avez déjà récupéré votre cadeau ! Revenez dans ' + minutes + ' minute(s) !', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }
        // Get random price between 10 and 100
        const price = Math.floor(Math.random() * 40) + 10;
        await orAction.increment(interaction.user.id, price);
        try {
            await hourlyDB.insertHourly(interaction.user.id);
        } catch (e) {
            console.log(e);
        }
        const embed = createEmbeds.createFullEmbed('Un cadeau pour vous !', 'Vous avez reçu ' + price + ' pièces d\'or !', null, null, null, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};