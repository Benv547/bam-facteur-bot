// const stickerDB = require("../database/sticker");
const userDB = require("../database/user");

module.exports = {
    name: 'getSticker',
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
                const sticker = await stickerDB.getStickerWithName(stickeName);
                if (sticker && sticker.length > 0) {
                    try {
                        await stickerDB.giveStickerToUser(member.id, sticker[0].id_sticker, interaction.guildId);
                        return await interaction.reply({content: 'Vous avez reçu le sticker **' + sticker[0].name + '**.', ephemeral: true});
                    } catch (e) {
                        return await interaction.reply({content: 'Vous avez déjà le sticker **' + sticker[0].name + '**.', ephemeral: true});
                    }
                }
            }
        }
    },
};