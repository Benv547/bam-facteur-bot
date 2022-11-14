const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");


module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('classement')
        .setDescription('Voyez à quel point vous êtes actifs !'),
    async execute(interaction) {
        // Get the user's currency
        const user = await userDB.getUser(interaction.user.id);
        if (user == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }
        const rankMoney = await userDB.getRankOr(interaction.user.id);
        const rankXp = await userDB.getRankXp(interaction.user.id);
        const money =  user.money;
        const xp =  user.xp;

        const embed = createEmbeds.createFullEmbed('Regardez comme vous êtes puissants !', 'Vous êtes **' + rankMoney + 'ème** au classement de l\'or avec un total de **' + money + ' pièces d\'or** ! \n\n Vous êtes **' + rankXp + 'ème** au classement de l\'XP avec un total de **' + xp + ' points d\'expérience** !', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};