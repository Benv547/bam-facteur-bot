const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const userDB = require("../database/user");


module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Look at how active you are!'),
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
            rankXp+="st"
        }
        if (rankXp == 2){
            rankXp+="nd"
        }
        if (rankXp == 3){
            rankXp+="rd"
        }
        else {
            rankXp+="th"
        }

        if (rankMoney == 1){
            rankMoney+="st"
        }
        if (rankMoney == 2){
            rankMoney+="nd"
        }
        if (rankMoney == 3){
            rankMoney+="rd"
        }
        else {
            rankMoney+="th"
        }

        const embed = createEmbeds.createFullEmbed('Look how powerful you are!', 'You are **' + rankMoney +'** in the gold ranking with a total of **' + money + ' <:gold:1058066245154525265>** ! \n\n You are **' + rankXp + '** i the XP ranking with a total of **' + xp + ' points <:xp:1058066266797113455>** !', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};