const { SlashCommandBuilder, userMention } = require('discord.js');
const { sanction } = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");
const roles = require("../utils/roles");
const sanctionDB = require("../database/sanctions");
const userDB = require("../database/user");
const {nonKickRole} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kickrole')
        .setDescription('Permet de kick un rôle sans signalement')
        .addStringOption(option =>
            option.setName('roleid')
                .setDescription('The role id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason of the kick')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsMod(interaction.member) && !(await roles.userIsApprenti(interaction.member))) {
            // Get the role and the reason
            const roleId = interaction.options.getString('roleid');
            const reason = interaction.options.getString('reason');

            // Fetch the role
            let role;
            try {
                role = await interaction.guild.roles.fetch(roleId);
            } catch {
                return interaction.reply({ content: 'Ce rôle n\'existe pas sur le serveur.', ephemeral: true });
            }

            // Fetch all members with the specified role
            const membersWithRole = await interaction.guild.members.fetch();
            const membersToKick = membersWithRole.filter(member => member.roles.cache.has(roleId));

            // Kick members who do not have the @NoKick role
            const noKickRoleId = nonKickRole; // Remplacez par l'ID du rôle @NoKick
            let kickedCount = 0;

            for (const member of membersToKick.values()) {
                if (!member.roles.cache.has(noKickRoleId)) {
                    try {
                        await member.kick(reason);
                        kickedCount++;
                    } catch (error) {
                        console.error(`Failed to kick member ${member.user.tag}:`, error);
                    }
                }
            }

            return interaction.reply({ content: `Les membres avec le rôle ${role.name} ont été kickés (sauf ceux avec le rôle @NoKick). Total kické : ${kickedCount}`, ephemeral: true });
        }
        return interaction.reply({ content: 'Vous n\'avez pas le droit de faire cela.', ephemeral: true });
    },
};
