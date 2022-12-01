const footerDB = require("../database/footer");
const userDB = require("../database/user");

module.exports = {
    name: 'getFooter',
    async execute(interaction) {
        const footerName = interaction.customId.split('_')[1];
        if (footerName) {

            if (await userDB.getUser(interaction.user.id) == null) {
                // Add the user to the database
                await userDB.createUser(interaction.user.id, 0, 0);
            }

            const member = await interaction.member;
            if (member) {
                // Fetch role from id
                const footer = await footerDB.getFooterWithName(footerName);
                if (footer && footer.length > 0) {
                    try {
                        await footerDB.giveFooterToUser(member.id, footer[0].id_footer, interaction.guildId);
                        return await interaction.reply({content: 'Vous avez reçu l\'arabesque **' + footer[0].name + '**.', ephemeral: true});
                    } catch (e) {
                        return await interaction.reply({content: 'Vous avez déjà l\'arabesque **' + footer[0].name + '**.', ephemeral: true});
                    }
                }
            }
        }
    },
};