const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const orAction = require("../utils/orAction");
const xpAction = require("../utils/xpAction");
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");
// const stickerDB = require("../database/sticker");
// const footerDB = require("../database/footer");

module.exports = {
    name: 'treasure',
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



        const treasureType = interaction.customId.split('_')[1];

        if (treasureType === 'botte') {
            if (random <= 2) {
                gain = " une reproduction de la Joconde.. 🖼️";
            } else if (random <= 40) {
                // choose a random number between 1 and 300
                const random = Math.floor(Math.random() * 10) + 1;
                await orAction.increment(interaction.user.id, random);
                gain = random + " <:piece:1045638309235404860>";
            } else {
                // choose a random number between 1 and 500
                const random = Math.floor(Math.random() * 25) + 1;
                await xpAction.increment(interaction.guild, interaction.user.id, random);
                gain = random + " <:xp:851123277497237544>";
            }
        }


        else if (treasureType === 'valise') {
            if (random <= 4) {
                gain = " un vieux sabre rouillé.. 🗡️";
            } else if (random <= 60) {
                // choose a random number between 1 and 300
                const random = Math.floor(Math.random() * 25) + 1;
                await orAction.increment(interaction.user.id, random);
                gain = random + " <:piece:1045638309235404860>";
            } else if (random <= 95) {
                // choose a random number between 1 and 500
                const random = Math.floor(Math.random() * 50) + 1;
                await xpAction.increment(interaction.guild, interaction.user.id, random);
                gain = random + " <:xp:851123277497237544>";
            } else {
                const randFloat = Math.random();
                const footer = await footerDB.getRandomWinnableFooter(randFloat);
                if (footer !== null) {
                    try {
                        await footerDB.giveFooterToUser(interaction.user.id, footer.id_footer, interaction.guild.id);
                    } catch {
                    }
                    gain = 'l\'arabesque ' + footer.name;
                }
            }
        }

        else if (treasureType === 'sable') {
            if (random <= 10) {
                gain = " un tas d'ossements enfouis.. 💀";
            } else if (random <= 70) {
                // choose a random number between 1 and 300
                const random = Math.floor(Math.random() * 25) + 1;
                await orAction.increment(interaction.user.id, random);
                gain = random + " <:piece:1045638309235404860>";
            } else {
                // choose a random number between 1 and 500
                const random = Math.floor(Math.random() * 50) + 1;
                await xpAction.increment(interaction.guild, interaction.user.id, random);
                gain = random + " <:xp:851123277497237544>";
            }
        }

        else if (treasureType === 'coffre') {
            if (random <= 2) {
                gain = " un nid d'araignées.. 🕷️";
            } else if (random <= 3) {
                gain = " de l'air.. 🍃";
            } else if (random <= 60) {
                // choose a random number between 1 and 300
                const random = Math.floor(Math.random() * 75) + 1;
                await orAction.increment(interaction.user.id, random);
                gain = random + " <:piece:1045638309235404860>";
            } else if (random <= 90) {
                // choose a random number between 1 and 500
                const random = Math.floor(Math.random() * 100) + 1;
                await xpAction.increment(interaction.guild, interaction.user.id, random);
                gain = random + " <:xp:851123277497237544>";
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
        }


        else if (treasureType === 'carnet') {
            if (random == 1) {
                gain = " un faux billet de 100€.. 💶";
            } else if (random <= 50) {
                const randFloat = Math.random();
                const sticker = await stickerDB.getRandomWinnableSticker(randFloat);
                if (sticker !== null) {
                    try {
                        await stickerDB.giveStickerToUser(interaction.user.id, sticker.id_sticker, interaction.guild.id);
                    } catch {
                    }
                    gain = 'le sticker ' + sticker.name;
                }
            } else {
                const randFloat = Math.random();
                const footer = await footerDB.getRandomWinnableFooter(randFloat);
                if (footer !== null) {
                    try {
                        await footerDB.giveFooterToUser(interaction.user.id, footer.id_footer, interaction.guild.id);
                    } catch {
                    }
                    gain = 'l\'arabesque ' + footer.name;
                }
            }
        }



        const embed = createEmbeds.createFullEmbed('Bravo !', 'Vous avez reçu **' + gain + '**', null, null, null, null);
        try {
            await userDB.incr_nb_treasures(interaction.user.id);
            await interaction.user.send({ content: "", embeds: [embed], ephemeral: true });
        } catch {
        }

        const embedPublic = createEmbeds.createFullEmbed('', 'Un•e illustre inconnu•e a gagné **' + gain + '**', null, null, null, null);
        // fetch interaction message
        const message = await interaction.channel.messages.fetch(interaction.message.id);
        // update message
        await message.edit({ content: "", embeds: [embedPublic], components: [] });
    },
};