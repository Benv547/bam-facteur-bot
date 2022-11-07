const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const orAction = require("../utils/orAction");
const xpAction = require("../utils/xpAction");
const hourlyDB = require("../database/hourly");
const createEmbeds = require("../utils/createEmbeds");
const stickerDB = require("../database/sticker");
const userDB = require("../database/user");

module.exports = {
    name: 'treasureCoffre',
    async execute(interaction) {

        try {
            await interaction.update({ components: [] });
        } catch {
            return;
        }

        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // choose a random number between 1 and 100
        const random = Math.floor(Math.random() * 100) + 1;
        let gain = "";

        if (random <= 60) {
            // choose a random number between 1 and 300
            const random = Math.floor(Math.random() * 75) + 1;
            await orAction.increment(interaction.user.id, random);
            gain = random + " pièce(s) d'or";
        } else if (random <= 90) {
            // choose a random number between 1 and 500
            const random = Math.floor(Math.random() * 100) + 1;
            await xpAction.increment(interaction.guild, interaction.user.id, random);
            gain = random + " point(s) d'expérience";
        } else {
            const randFloat = Math.random();
            const sticker = await stickerDB.getRandomWinnableSticker(randFloat);
            if (sticker !== null) {
                try {
                    await stickerDB.giveStickerToUser(interaction.user.id, sticker.id_sticker, interaction.guild.id);
                } catch {
                }
                gain = 'le sticker ' + sticker.name;
            }
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