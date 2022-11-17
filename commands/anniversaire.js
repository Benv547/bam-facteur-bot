const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require('../database/user');

module.exports = {
    public: true,
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
        const user = await userDB.getUser(interaction.member.id);
        if (user == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        } else {
            if (user['anniversaireJour'] !== null) {
                return await interaction.reply({ content: 'Votre anniversaire est déjà enregistré.', ephemeral: true });
            }
        }
        const jourValue = parseInt(interaction.options.get('jour').value);
        if (jourValue > 31 || jourValue < 1) {
            return await interaction.reply({ content: 'Veuillez insérer un jour valide.', ephemeral: true });
        }

        const mois = {
            janvier: 1,
            fevrier: 2,
            mars: 3,
            avril: 4,
            mai: 5,
            juin: 6,
            juillet: 7,
            aout: 8,
            septembre: 9,
            octobre: 10,
            novembre: 11,
            decembre: 12
        }
        // Si un jour on veux afficher la date d'anniversaire en timestamp continuer cette ligne de code + l'intégrer au message en-dessous : const dateanniversaire = interaction.options.getString('date')
        const embed = createEmbeds.createFullEmbed('🎂 Encore un super anniversaire', `Ton anniversaire a bien été enregistré pour le ${jourValue} ${interaction.options.get('mois').value} !`, null, null, null);

        try {         // Check if the user exists in the database
            await userDB.update_anniversaire(interaction.member.id, jourValue, mois[interaction.options.getString('mois')]);
        } catch (e) {
            console.error(e);
            return await interaction.reply({ content: 'Une erreur est survenue pendant la sauvegarde de votre anniversaire.', ephemeral: true });
        }

        await interaction.reply({ ephemeral: true, embeds: [embed] });

    },
};