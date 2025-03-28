const { SlashCommandBuilder, userMention } = require('discord.js');
const { sanction } = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");
const roles = require("../utils/roles");
const sanctionDB = require("../database/sanctions");
const userDB = require("../database/user")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Permet de ban un membre sans signalement')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The user id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason of the ban')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsMod(interaction.member)&&(await roles.userIsApprenti(interaction.member))==false) {
            // Get the user and the reason
            let userId = await userDB.getUser(interaction.options.getString('userid'));
            let user;

            
            try {
                user = await interaction.guild.members.fetch(interaction.options.getString('userid'));
            }
            catch {
                return interaction.reply({ content: 'Cet utilisateur n\'est pas sur le serveur ou n\'existe pas.', ephemeral: true });
            }

            if (userId === null) {
                // Add the user to the database
                await userDB.createUser(interaction.options.getString('userid'), 0, 0);
                userId = await userDB.getUser(interaction.options.getString('userid'))
            }
            const reason = interaction.options.getString('reason');

            const embed = createEmbeds.createFullEmbed('Vous avez été banni•e', 'Une de vos actions a été jugée comme inappropriée par ' + userMention(interaction.user.id) + ' pour la raison suivante : **' + reason + '**', null, null, 0x2f3136, null);
            await sanctionDB.saveSanction(userId.id_user, interaction.user.id, "ban", reason);

            const channel = await interaction.guild.channels.fetch(sanction);
            await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed('ban', 'L\'utilisateur ' + userMention(userId.id_user) + ' a été ban par ' + userMention(interaction.user.id) + ' pour la raison suivante : **' + reason + '**', null, null, 0x2f3136, null)] });

            // Send direct message to user
            try {
                user.send({ content: "", embeds: [embed] });
            } catch {
            }
            await user.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: reason });
            return await interaction.reply({ content: 'L\'utilisateur ' + userMention(userId.id_user) + 'à bien été banni', ephemeral: true });

        }
        return interaction.reply({ content: 'Vous n\'avez pas le droit de faire cela.', ephemeral: true });
    },
};


