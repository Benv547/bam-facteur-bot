const { SlashCommandBuilder } = require('discord.js');
const roles = require("../utils/roles");
const { facteur, factrice } = require("../config.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('murge')
        .setDescription('Permet de supprimer des messages (hors bots)')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre de messages à supprimer')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsMod(interaction.member)) {
            let nombre_message = interaction.options.getString('nombre');
            if (await roles.userIsApprenti(interaction.member) && nombre_message > 20) {
                nombre_message = 20;
            }
            if (nombre_message > 80) {
                nombre_message = 80;
            }
            const messages = await interaction.channel.messages.fetch({ limit: nombre_message });
            messages.forEach(function (message) {
                if (!message.author.bot) {
                    message.delete();
                }
        });
        return interaction.reply({ content: nombre_message + ' sont en train d\'être supprimés', ephemeral: true })
    }
        return interaction.reply({ content: 'Vous n\'avez pas le droit de faire cela.', ephemeral: true });
},
};


