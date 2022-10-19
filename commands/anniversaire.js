const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anniversaire')
        .setDescription('Fêtons ton anniversaire !')
        .addStringOption(option =>
            option.setName('jour')
                .setDescription('Le jour de ton anniversaire')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mois')
                .setDescription("Le mois de ton anniversaire")
                .setRequired(true)
                .setChoices(
                        { name: 'Janvier', value: 'janvier' },
                        { name: 'Février', value: 'fevrier' },
                        { name: 'Mars', value: 'mars' },
                        { name: 'Avril', value: 'avril' },
                        { name: 'Mai', value: 'mai' },
                        { name: 'Juin', value: 'juin' },
                        { name: 'Juillet', value: 'juillet' },
                        { name: 'Aout', value: 'aout' },
                        { name: 'Septembre', value: 'septembre' },
                        { name: 'Octobre', value: 'octobre' },
                        { name: 'Novembre', value: 'novembre' },
                        { name: 'Décembre', value: 'decembre' },
                )),

    async execute(interaction) {
        // Si un jour on veux afficher la date d'anniversaire en timestamp continuer cette ligne de code + l'intégrer au message en-dessous : const dateanniversaire = interaction.options.getString('date')
        const embed = createEmbeds.createFullEmbed('🎂 Encore un super anniversaire', `Ton anniversaire est bien le ${interaction.options.get('jour').value} ${interaction.options.get('mois').value} ?`, null, null, null, `Attention, elle s'affichera publiquement !`);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Valider')
                    .setStyle(ButtonStyle.Success),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Annuler')
                    .setStyle(ButtonStyle.Danger),
            );

                await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });

                if(interaction.isButton()) {
                    if(interaction.customId === "accept") {
                        interaction.reply("Tu as accepté")
                    }
                }
},
}
