module.exports = {
    name: 'getRole',
    async execute(interaction) {
        const roleId = interaction.customId.split('_')[1];
        if (roleId) {
            const member = await interaction.member;
            if (member) {
                // Fetch role from id
                const role = await interaction.guild.roles.fetch(roleId);
                if (role) {
                    // If member has role
                    if (member.roles.cache.has(roleId)) {
                        // Remove role
                        await member.roles.remove(role);
                        return await interaction.reply({content: 'Vous n\'avez plus le rôle **' + role.name + '**.', ephemeral: true});
                    }
                    // If member doesn't have role
                    else {
                        // Add role
                        await member.roles.add(role);
                        return await interaction.reply({ content:'Vous avez reçu le rôle **' + role.name + '**.', ephemeral: true});
                    }
                }
            }
        }
    },
};