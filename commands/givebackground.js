const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const backgroundDB = require('../database/background');
const roles = require("../utils/roles");
const userDB = require("../database/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givebackground')
        .setDescription('Permet de donner un fond.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The user id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('backgroundname')
                .setDescription('The background name to give')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Get the user
            const userId = interaction.options.getString('userid');
            const backgroundname = interaction.options.getString('backgroundname');
            // Set the user's currency
            const background = await backgroundDB.getBackgroundWithName(backgroundname);
            if (background === null || background === undefined || background.length === 0) {
                return interaction.reply({ content:'Ce fond n\'existe pas.', ephemeral: true});
            } else if (background.length > 1) {
                return interaction.reply({ content:'Plusieurs fonds ont ce même nom, affinez votre recherche.', ephemeral: true});
            }

            const checkUserID = await userDB.getUser(userId);
            if (checkUserID == null) {
                // Add the user to the database
                await userDB.createUser(userId, 0, 0);
            }

            await backgroundDB.giveBackgroundToUser(userId, background[0].id_background, interaction.guild.id);

            // Fetch user
            const user = await interaction.guild.members.fetch(userId);
            const embed = createEmbeds.createFullEmbed('Quelle chance !', 'Vous avez reçu le fond **' + background[0].name + '** !', null, null, 0x2f3136, null);

            // Send direct message to user
            try {
                await user.send({content: "", embeds: [embed]});
            } catch {
            }
            return await interaction.reply({ content:'C\'est fait.', ephemeral: true});
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};