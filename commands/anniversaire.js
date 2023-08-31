const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require('../database/user');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Celebrate your birthday!')
        .addStringOption(option =>
            option.setName('jour')
                .setDescription('The day of your birthday')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mois')
                .setDescription("The month of your birthday")
                .setRequired(true)
                .setChoices(
                    { name: 'January', value: 'january' },
                    { name: 'February', value: 'february' },
                    { name: 'March', value: 'march' },
                    { name: 'April', value: 'april' },
                    { name: 'May', value: 'may' },
                    { name: 'June', value: 'june' },
                    { name: 'July', value: 'july' },
                    { name: 'August', value: 'august' },
                    { name: 'September', value: 'september' },
                    { name: 'October', value: 'october' },
                    { name: 'November', value: 'november' },
                    { name: 'December', value: 'december' },
                )),

    async execute(interaction) {
        const user = await userDB.getUser(interaction.member.id);
        if (user == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        } else {
            if (user['anniversaireJour'] !== null) {
                return await interaction.reply({ content: 'Your birthday is already registered.', ephemeral: true });
            }
        }
        const jourValue = parseInt(interaction.options.get('day').value);
        if (jourValue > 31 || jourValue < 1) {
            return await interaction.reply({ content: 'Please enter a valid day.', ephemeral: true });
        }

        const mois = {
            january: 1,
            february: 2,
            march: 3,
            april: 4,
            may: 5,
            june: 6,
            july: 7,
            august: 8,
            september: 9,
            october: 10,
            november: 11,
            december: 12
        }
        // Si un jour on veux afficher la date d'anniversaire en timestamp continuer cette ligne de code + l'intégrer au message en-dessous : const dateanniversaire = interaction.options.getString('date')
        const embed = createEmbeds.createFullEmbed('🎂 We\'ll celebrate together!', `Your birthday has been registred for ${jourValue} ${interaction.options.get('mois').value} !`, null, null, null);

        try {         // Check if the user exists in the database
            await userDB.update_anniversaire(interaction.member.id, jourValue, mois[interaction.options.getString('mois')]);
        } catch (e) {
            console.error(e);
            return await interaction.reply({ content: 'An error occurred while saving your birthday.', ephemeral: true });
        }

        await interaction.reply({ ephemeral: true, embeds: [embed] });

    },
};