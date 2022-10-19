const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
// const annivDB = require("../database/anniversaires");

module.exports = {
    name: 'anniversaireAccept',
    async execute(interaction) {

        // Savoir si son anniversaire est déjà enregistré ou non - Il manque la création de la DB + l'enregistrement
        // const anniv = await annivDB.getAnniv(interaction.message.id, interaction.user.id);
        // if (anniv !== null) {
        //     await interaction.reply({ content: 'Tu as déjà renseigné votre anniversaire', ephemeral: true });
        //     return;
        // }

        await interaction.reply({ content: 'Tu as accepté', ephemeral: true });

    }
};