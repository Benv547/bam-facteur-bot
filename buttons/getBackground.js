const backgroundDB = require("../database/background");
const userDB = require("../database/user");

module.exports = {
    name: 'getBackground',
    async execute(interaction) {
        const stickeName = interaction.customId.split('_')[1];
        if (stickeName) {

            if (await userDB.getUser(interaction.user.id) == null) {
                // Add the user to the database
                await userDB.createUser(interaction.user.id, 0, 0);
            }

            const member = await interaction.member;
            if (member) {
                // Fetch role from id
                const background = await backgroundDB.getBackgroundWithName(stickeName);
                if (background && background.length > 0) {
                    try {
                        await backgroundDB.giveBackgroundToUser(member.id, background[0].id_background, interaction.guildId);
                        return await interaction.reply({content: 'Vous avez reçu le fond **' + background[0].name + '**.', ephemeral: true});
                    } catch (e) {
                        return await interaction.reply({content: 'Vous avez déjà le fond **' + background[0].name + '**.', ephemeral: true});
                    }
                }
            }
        }
    },
};