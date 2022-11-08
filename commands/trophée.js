const { SlashCommandBuilder } = require('discord.js');
const achievementDB = require("../database/achievement");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('trophée')
        .setDescription('Admirez vos trophées !'),
    async execute(interaction) {
        const achievements = await achievementDB.getAllAchievementsFromUser(interaction.user.id);
        const allAchievements = await achievementDB.getAllAchievements();

        const embed = createEmbeds.createFullEmbed("Vos trophées", '', null, null, 0x2f3136, null);
        let fields = [];
        allAchievements.forEach(achievement => {
            let message = '';
            let status = '';
            let rarity = '';
            let a;
            if (achievements && achievements.length > 0) {
                a = achievements.find(a => a.id_achievement === achievement.id_achievement);
            }
            if (a) {
                const date = new Date(a.date);
                message = '• **' + achievement.name + '**';
                status = '🏆 (' + date.toLocaleDateString('fr-FR') + ')\n';
            } else {
                message = '• ?????????';
                status = '(non obtenu)\n';
            }
            status += '[**' + achievement.rarity + '**]' + '\n** **';
            fields.push({
                name: message,
                value: status,
                inline: true
            });
        });
        embed.addFields(fields);
        return interaction.reply({content: '', embeds: [embed], ephemeral: true});
    },
};