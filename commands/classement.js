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
        let rankMoneySpent = await userDB.getRankOrSpent(interaction.user.id);
        let rankXp = await userDB.getRankXp(interaction.user.id);
        let rankCorail = await userDB.getRankCorail(interaction.user.id);
        let rankCorailSpent = await userDB.getRankCorailSpent(interaction.user.id);
        const money =  user.money;
        const xp =  user.xp;
        if (rankXp === 1){
            rankXp+="er•e"
        }
        else {
            rankXp+="ème"
        }

        if (rankMoneySpent === 1){
            rankMoneySpent+="er•e"
        }
        else {
            rankMoneySpent+="ème"
        }

        if (rankCorail === 1){
            rankCorail+="er•e"
        }
        else {
            rankCorail+="ème"
        }

        if (rankCorailSpent === 1){
            rankCorailSpent+="er•e"
        }
        else {
            rankCorailSpent+="ème"
        }

        if (rankMoney === 1){
            rankMoney+="er•e"
        }
        else {
            rankMoney+="ème"
        }

        const embed = createEmbeds.createFullEmbed('Regardez comme vous êtes puissants !', '' +
            'Vous êtes **' + rankCorail + '** au classement du corail avec un total de **' + user.corail + ' <:corail:1045638309235404860>** ! \n' +
            'Vous êtes **' + rankCorailSpent + '** au classement du corail dépensé avec un total de **' + user.corail_spent + ' <:corail:1045638309235404860>** ! \n\n' +
            'Vous êtes **' + rankMoney +'** au classement de l\'or avec un total de **' + money + ' <:piece:1045638309235404860>** ! \n' +
            'Vous êtes **' + rankMoneySpent + '** au classement de l\'or dépensé avec un total de **' + user.money_spent + ' <:piece:1045638309235404860>** ! \n\n' +
            'Vous êtes **' + rankXp + '** au classement de l\'XP avec un total de **' + xp + ' points d\'<:xp:851123277497237544>** !', null, null, 0x2f3136, null);
        return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};