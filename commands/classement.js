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
        let rankMoney = await userDB.getRankOr(interaction.user.id);
        let rankXp = await userDB.getRankXp(interaction.user.id);
        const money =  user.money;
        const xp =  user.xp;
        if (rankXp == 1){
            rankXp+="er•e"
        }
        else {
            rankXp+="ème"
        }

        if (rankMoney == 1){
            rankMoney+="er•e"
        }
        else {
            rankMoney+="ème"
        }

        const embed = createEmbeds.createFullEmbed('Regardez comme vous êtes puissants !', 'Vous êtes **' + rankMoney +'** au classement de l\'or avec un total de **' + money + ' <:piece:1045638309235404860>** ! \n\n Vous êtes **' + rankXp + '** au classement de l\'XP avec un total de **' + xp + ' points d\'<:xp:851123277497237544>** !', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};