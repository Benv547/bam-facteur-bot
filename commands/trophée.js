const { SlashCommandBuilder } = require('discord.js');
const achievementDB = require("../database/achievement");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('trophy')
        .setDescription('Enjoy your trophies!'),
    async execute(interaction) {
        const achievements = await achievementDB.getAllAchievementsFromUser(interaction.user.id);
        const allAchievements = await achievementDB.getAllAchievements();

        const embed = createEmbeds.createFullEmbed('Your trophies (' + achievements.length + '/' + allAchievements.length + ')', '', null, null, 0x2f3136, null);
        let fields = [];
        for (const achievement of allAchievements) {
            let message = '';
            let status = '';
            let rarity = '';
            let percentage = await achievementDB.getPercentageAchievementForAllUsers(achievement.id_achievement);
            percentage = percentage / 100;
            let a;
            if (achievements && achievements.length > 0) {
                a = achievements.find(a => a.id_achievement === achievement.id_achievement);
            }
            if (a) {
                const date = new Date(a.date);
                message = '** **\n• **' + achievement.name + '**';
                status = achievement.description;
                status += '\n\n🏆 (' + date.toLocaleDateString('fr-FR') + ')\n';
            } else {
                message = '** **\n• ?????????';
                status = '(not obtained)\n';
            }
            status += '[**' + achievement.rarity + '**]';
            status += '\nUnlocked by ' + percentage + '%\n';
            status += '\n** **';
            fields.push({
                name: message,
                value: status,
                inline: true
            });
        }
        embed.addFields(fields);
        return interaction.reply({content: '', embeds: [embed], ephemeral: true});
    },
};