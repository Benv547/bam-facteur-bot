const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const orAction = require("../utils/orAction");
const xpAction = require("../utils/xpAction");
const hourlyDB = require("../database/hourly");
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");

module.exports = {
    name: 'treasureValise',
    async execute(interaction) {

        await interaction.update({ components: [] });

        // choose a random number between 1 and 100
        const random = Math.floor(Math.random() * 100) + 1;
        let gain = "";

        if (random <= 60) {
            // choose a random number between 1 and 300
            const random = Math.floor(Math.random() * 25) + 1;
            await orAction.increment(interaction.user.id, random);
            gain = random + " pièce(s) d'or";
        } else {
            // choose a random number between 1 and 500
            const random = Math.floor(Math.random() * 50) + 1;
            await xpAction.increment(interaction.guild, interaction.user.id, random);
            gain = random + " point(s) d'expérience";
        }

        const embed = createEmbeds.createFullEmbed('Bravo !', 'Vous avez reçu **' + gain + '**', null, null, null, null);
        try {
            await userDB.incr_nb_treasures(interaction.user.id);
            await interaction.user.send({ content: "", embeds: [embed], ephemeral: true });
        } catch {
        }

        const embedPublic = createEmbeds.createFullEmbed('','Un•e illustre inconnu•e a reçu **' + gain + '**', null, null, null, null);
        // fetch interaction message
        const message = await interaction.channel.messages.fetch(interaction.message.id);
        // update message
        await message.edit({ content: "", embeds: [embedPublic], components: [] });
    },
};