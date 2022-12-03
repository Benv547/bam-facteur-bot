const { SlashCommandBuilder } = require('discord.js');
const bottleDB = require('../database/bottle');
const messageDB = require('../database/message');
const recordDB = require('../database/record');
const userDB = require('../database/user');
const birdDB = require('../database/bird');
const wantedDB = require('../database/wanted');
const sanctionDB = require('../database/sanctions');
const charts = require('../utils/charts');
const createEmbeds = require('../utils/createEmbeds');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('statistique')
        .setDescription('Affiche les statistiques du serveur !')
        .addStringOption(option =>
            option.setName('type')
                .setDescription("Le type d'information à afficher")
                .setRequired(true)
                .setChoices(
                    { name: 'Messages', value: 'message' },
                    { name: 'Bouteilles', value: 'bottle' },
                    { name: 'Utilisateurs', value: 'user' },
                    { name: 'Sanctions', value: 'sanction' },
                    { name: 'Oiseaux', value: 'bird' },
                    { name: 'Recherches', value: 'wanted' },
                    { name: 'Evénements', value: 'event' },
                    { name: 'Tout', value: 'all' },
                ))
        .addStringOption(option =>
            option.setName('periode')
                .setDescription("La période de temps")
                .setRequired(true)
                .setChoices(
                    { name: '7 jours', value: 'sevenDays' },
                    { name: '30 jours', value: 'thirtyDays' },
                    { name: '1 an', value: 'oneYear' },
                )),
    async execute(interaction) {
        const type = interaction.options.get('type').value;
        const periode = interaction.options.get('periode').value;

        let periodeName = '';
        const sevenDays = '7 derniers jours';
        const thirtyDays = '30 derniers jours';
        const oneYear = 'cette année';

        let chart = null;
        let text = '';

        switch (type) {
            case 'message':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalMessageSevenDays = await messageDB.getMessageCountForOneWeek();
                        text = `\n\n**${totalMessageSevenDays}** messages ont été envoyés sur le serveur durant cette période.`;
                        const statsMessage = await messageDB.getMessageCountEachDayForOneWeek();
                        chart = await charts.createChartForMessage(statsMessage);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalMessageThirtyDays = await messageDB.getMessageCountForOneMonth();
                        text = `\n\n**${totalMessageThirtyDays}** messages ont été envoyés sur le serveur durant cette période.`;
                        const statsMessageThirtyDays = await messageDB.getMessageCountEachDayForOneMonth();
                        chart = await charts.createChartForMessage(statsMessageThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalMessageOneYear = await messageDB.getMessageCountEachMonthForThisYear();
                        text = `\n\n**${totalMessageOneYear}** messages ont été envoyés sur le serveur durant cette période.`;
                        const statsMessageOneYear = await messageDB.getMessageCountEachMonthForThisYear();
                        chart = await charts.createChartForMessage(statsMessageOneYear);
                        break;
                }
                break;
            case 'bottle':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalBottleSevenDays = await bottleDB.getBottleCountForOneWeek();
                        text = `\n\n**${totalBottleSevenDays}** bouteilles ont été envoyées sur le serveur durant cette période.`;
                        const statsBottle = await bottleDB.getBottleCountEachDayForOneWeek();
                        const statsBottleArchived = await bottleDB.getBottleArchivedCountEachDayForOneWeek();
                        const statsBottleTerminated = await bottleDB.getBottleTerminatedCountEachDayForOneWeek();
                        chart = await charts.createChartForBottle(statsBottle, statsBottleArchived, statsBottleTerminated);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalBottleThirtyDays = await bottleDB.getBottleCountForOneMonth();
                        text = `\n\n**${totalBottleThirtyDays}** bouteilles ont été envoyées sur le serveur durant cette période.`;
                        const statsBottleThirtyDays = await bottleDB.getBottleCountEachDayForOneMonth();
                        const statsBottleArchivedThirtyDays = await bottleDB.getBottleArchivedCountEachDayForOneMonth();
                        const statsBottleTerminatedThirtyDays = await bottleDB.getBottleTerminatedCountEachDayForOneMonth();
                        chart = await charts.createChartForBottle(statsBottleThirtyDays, statsBottleArchivedThirtyDays, statsBottleTerminatedThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalBottleOneYear = await bottleDB.getBottleCountForThisYear();
                        text = `\n\n**${totalBottleOneYear}** bouteilles ont été envoyées sur le serveur durant cette période.`;
                        const statsBottleOneYear = await bottleDB.getBottleCountEachMonthForThisYear();
                        const statsBottleArchivedOneYear = await bottleDB.getBottleArchivedCountEachMonthForThisYear();
                        const statsBottleTerminatedOneYear = await bottleDB.getBottleTerminatedCountEachMonthForThisYear();
                        chart = await charts.createChartForBottle(statsBottleOneYear, statsBottleArchivedOneYear, statsBottleTerminatedOneYear);
                        break;
                }
                break;
            case 'user':

                let textMoneyAndXp = '';
                const total = await userDB.getTotalOfMoneyAndXp();
                if (total) {
                    textMoneyAndXp += `\n\n**${total.money}** pièces d'or sont en actuellement circulation sur le serveur.`;
                    textMoneyAndXp += `\n**${total.xp}** points d'<:xp:851123277497237544> sont en actuellement circulation sur le serveur.`;
                }

                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalUserSevenDays = await recordDB.getCountForOneWeek("user");
                        const totalVIPUserSevenDays = await recordDB.getCountForOneWeek("vip");
                        const totalBoostUserSevenDays = await recordDB.getCountForOneWeek("boost");
                        text = `\n\n**${totalUserSevenDays}** utilisateurs ont été sur le serveur durant cette période.`;
                        text += `\n**${totalVIPUserSevenDays}** utilisateurs ont été VIP durant cette période.`;
                        text += `\n**${totalBoostUserSevenDays}** utilisateurs ont boosté le serveur durant cette période.` + textMoneyAndXp;
                        const statsUser = await recordDB.getCountEachDayForOneWeek("user");
                        const statsVIPUser = await recordDB.getCountEachDayForOneWeek("vip");
                        const statsBoostUser = await recordDB.getCountEachDayForOneWeek("boost");
                        chart = await charts.createChartForUser(statsUser, statsVIPUser, statsBoostUser);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalUserThirtyDays = await recordDB.getCountForOneMonth("user");
                        const totalVIPUserThirtyDays = await recordDB.getCountForOneMonth("vip");
                        const totalBoostUserThirtyDays = await recordDB.getCountForOneMonth("boost");
                        text = `\n\n**${totalUserThirtyDays}** utilisateurs ont été sur le serveur durant cette période.`;
                        text += `\n**${totalVIPUserThirtyDays}** utilisateurs ont été VIP sur le serveur durant cette période.`;
                        text += `\n**${totalBoostUserThirtyDays}** utilisateurs ont boosté le serveur durant cette période.` + textMoneyAndXp;
                        const statsUserThirtyDays = await recordDB.getCountEachDayForOneMonth("user");
                        const statsVIPUserThirtyDays = await recordDB.getCountEachDayForOneMonth("vip");
                        const statsBoostUserThirtyDays = await recordDB.getCountEachDayForOneMonth("boost");
                        chart = await charts.createChartForUser(statsUserThirtyDays, statsVIPUserThirtyDays, statsBoostUserThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalUserOneYear = await recordDB.getCountForThisYear("user");
                        const totalVIPUserOneYear = await recordDB.getCountForThisYear("vip");
                        const totalBoostUserOneYear = await recordDB.getCountForThisYear("boost");
                        text = `\n\n**${totalUserOneYear}** utilisateurs ont été sur le serveur durant cette période.`;
                        text += `\n**${totalVIPUserOneYear}** utilisateurs VIP ont été sur le serveur durant cette période.`;
                        text += `\n**${totalBoostUserOneYear}** utilisateurs BOOST ont été sur le serveur durant cette période.` + textMoneyAndXp;
                        const statsUserOneYear = await recordDB.getCountEachMonthForThisYear("user");
                        const statsVIPUserOneYear = await recordDB.getCountEachMonthForThisYear("vip");
                        const statsBoostUserOneYear = await recordDB.getCountEachMonthForThisYear("boost");
                        chart = await charts.createChartForUser(statsUserOneYear, statsVIPUserOneYear, statsBoostUserOneYear);
                        break;
                }
                break;
            case 'bird':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalBirdSevenDays = await birdDB.getBirdCountForOneWeek();
                        const totalReactionSevenDays = await birdDB.getReactionCountForOneWeek();
                        text = `\n\n**${totalBirdSevenDays}** oiseaux ont été envoyés sur le serveur durant cette période.`;
                        text += `\n**${totalReactionSevenDays}** réactions ont été envoyées sur le serveur durant cette période.`;
                        const statsBird = await birdDB.getBirdCountEachDayForOneWeek();
                        const statsReaction = await birdDB.getReactionCountEachDayForOneWeek();
                        chart = await charts.createChartForBird(statsBird, statsReaction);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalBirdThirtyDays = await birdDB.getBirdCountForOneMonth();
                        const totalReactionThirtyDays = await birdDB.getReactionCountForOneMonth();
                        text = `\n\n**${totalBirdThirtyDays}** oiseaux ont été envoyés sur le serveur durant cette période.`;
                        text += `\n**${totalReactionThirtyDays}** réactions ont été envoyées sur le serveur durant cette période.`;
                        const statsBirdThirtyDays = await birdDB.getBirdCountEachDayForOneMonth();
                        const statsReactionThirtyDays = await birdDB.getReactionCountEachDayForOneMonth();
                        chart = await charts.createChartForBird(statsBirdThirtyDays, statsReactionThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalBirdOneYear = await birdDB.getBirdCountForThisYear();
                        const totalReactionOneYear = await birdDB.getReactionCountForThisYear();
                        text = `\n\n**${totalBirdOneYear}** oiseaux ont été envoyés sur le serveur durant cette période.`;
                        text += `\n**${totalReactionOneYear}** réactions ont été envoyées sur le serveur durant cette période.`;
                        const statsBirdOneYear = await birdDB.getBirdCountEachMonthForThisYear();
                        const statsReactionOneYear = await birdDB.getReactionCountEachMonthForThisYear();
                        chart = await charts.createChartForBird(statsBirdOneYear, statsReactionOneYear);
                        break;
                }
                break;
            case 'wanted':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalWantedSevenDays = await wantedDB.getWantedCountForOneWeek();
                        const totalRepliesSevenDays = await wantedDB.getRepliesCountForOneWeek();
                        text = `\n\n**${totalWantedSevenDays}** recherches ont été envoyées sur le serveur durant cette période.`;
                        text += `\n**${totalRepliesSevenDays}** réponses ont été envoyées sur le serveur durant cette période.`;
                        const statsWanted = await wantedDB.getWantedCountEachDayForOneWeek();
                        const statsReplies = await wantedDB.getRepliesCountEachDayForOneWeek();
                        chart = await charts.createChartForWanted(statsWanted, statsReplies);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalWantedThirtyDays = await wantedDB.getWantedCountForOneMonth();
                        const totalRepliesThirtyDays = await wantedDB.getRepliesCountForOneMonth();
                        text = `\n\n**${totalWantedThirtyDays}** recherches ont été envoyées sur le serveur durant cette période.`;
                        text += `\n**${totalRepliesThirtyDays}** réponses ont été envoyées sur le serveur durant cette période.`;
                        const statsWantedThirtyDays = await wantedDB.getWantedCountEachDayForOneMonth();
                        const statsRepliesThirtyDays = await wantedDB.getRepliesCountEachDayForOneMonth();
                        chart = await charts.createChartForWanted(statsWantedThirtyDays, statsRepliesThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalWantedOneYear = await wantedDB.getWantedCountForThisYear();
                        const totalRepliesOneYear = await wantedDB.getRepliesCountForThisYear();
                        text = `\n\n**${totalWantedOneYear}** recherches ont été envoyées sur le serveur durant cette période.`;
                        text += `\n**${totalRepliesOneYear}** réponses ont été envoyées sur le serveur durant cette période.`;
                        const statsWantedOneYear = await wantedDB.getWantedCountEachMonthForThisYear();
                        const statsRepliesOneYear = await wantedDB.getRepliesCountEachMonthForThisYear();
                        chart = await charts.createChartForWanted(statsWantedOneYear, statsRepliesOneYear);
                        break;
                }
                break;
            case 'sanction':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalBanSanctionSevenDays = await sanctionDB.getSanctionCountForOneWeek("ban");
                        const totalMuteSanctionSevenDays = await sanctionDB.getSanctionCountForOneWeek("mute");
                        const totalWarnSanctionSevenDays = await sanctionDB.getSanctionCountForOneWeek("warn");
                        const totalWarnabusifSanctionSevenDays = await sanctionDB.getSanctionCountForOneWeek("abusif");
                        text = `\n\n**${totalBanSanctionSevenDays}** bannissement ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalMuteSanctionSevenDays}** mutes ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalWarnSanctionSevenDays}** warns ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalWarnabusifSanctionSevenDays}** warns abusifs ont été appliqués sur le serveur durant cette période.`;
                        const statsBanSanctionSevenDays = await sanctionDB.getSanctionCountEachDayForOneWeek("ban");
                        const statsMuteSanctionSevenDays = await sanctionDB.getSanctionCountEachDayForOneWeek("mute");
                        const statsWarnSanctionSevenDays = await sanctionDB.getSanctionCountEachDayForOneWeek("warn");
                        const statsWarnabusifSanctionSevenDays = await sanctionDB.getSanctionCountEachDayForOneWeek("abusif");
                        chart = await charts.createChartForSanction(statsBanSanctionSevenDays, statsMuteSanctionSevenDays, statsWarnSanctionSevenDays, statsWarnabusifSanctionSevenDays);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalBanSanctionThirtyDays = await sanctionDB.getSanctionCountForOneMonth("ban");
                        const totalMuteSanctionThirtyDays = await sanctionDB.getSanctionCountForOneMonth("mute");
                        const totalWarnSanctionThirtyDays = await sanctionDB.getSanctionCountForOneMonth("warn");
                        const totalWarnabusifSanctionThirtyDays = await sanctionDB.getSanctionCountForOneMonth("abusif");
                        text = `\n\n**${totalBanSanctionThirtyDays}** bannissement ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalMuteSanctionThirtyDays}** mutes ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalWarnSanctionThirtyDays}** warns ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalWarnabusifSanctionThirtyDays}** warns abusifs ont été appliqués sur le serveur durant cette période.`;
                        const statsBanSanctionThirtyDays = await sanctionDB.getSanctionCountEachDayForOneMonth("ban");
                        const statsMuteSanctionThirtyDays = await sanctionDB.getSanctionCountEachDayForOneMonth("mute");
                        const statsWarnSanctionThirtyDays = await sanctionDB.getSanctionCountEachDayForOneMonth("warn");
                        const statsWarnabusifSanctionThirtyDays = await sanctionDB.getSanctionCountEachDayForOneMonth("abusif");
                        chart = await charts.createChartForSanction(statsBanSanctionThirtyDays, statsMuteSanctionThirtyDays, statsWarnSanctionThirtyDays, statsWarnabusifSanctionThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalBanSanctionOneYear = await sanctionDB.getSanctionCountForThisYear("Ban");
                        const totalMuteSanctionOneYear = await sanctionDB.getSanctionCountForThisYear("Mute");
                        const totalWarnSanctionOneYear = await sanctionDB.getSanctionCountForThisYear("Warn");
                        const totalWarnabusifSanctionOneYear = await sanctionDB.getSanctionCountForThisYear("Warn abusif");
                        text = `\n\n**${totalBanSanctionOneYear}** bannissement ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalMuteSanctionOneYear}** mutes ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalWarnSanctionOneYear}** warns ont été appliqués sur le serveur durant cette période.`;
                        text += `\n**${totalWarnabusifSanctionOneYear}** warns abusifs ont été appliqués sur le serveur durant cette période.`;
                        const statsBanSanctionOneYear = await sanctionDB.getSanctionCountEachMonthForThisYear("Ban");
                        const statsMuteSanctionOneYear = await sanctionDB.getSanctionCountEachMonthForThisYear("Mute");
                        const statsWarnSanctionOneYear = await sanctionDB.getSanctionCountEachMonthForThisYear("Warn");
                        const statsWarnabusifSanctionOneYear = await sanctionDB.getSanctionCountEachMonthForThisYear("Warn abusif");
                        chart = await charts.createChartForSanction(statsBanSanctionOneYear, statsMuteSanctionOneYear, statsWarnSanctionOneYear, statsWarnabusifSanctionOneYear);
                        break;
                }
                break;
            case 'event':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalEventSevenDays = await recordDB.getCountForOneWeek("event");
                        text = `\n\n**${totalEventSevenDays}** événements ont été organisés sur le serveur durant cette période.`;
                        const statsEventSevenDays = await recordDB.getCountEachDayForOneWeek("event");
                        chart = await charts.createChartForEvent(statsEventSevenDays);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalEventThirtyDays = await recordDB.getCountForOneMonth("event");
                        text = `\n\n**${totalEventThirtyDays}** événements ont été organisés sur le serveur durant cette période.`;
                        const statsEventThirtyDays = await recordDB.getCountEachDayForOneMonth("event");
                        chart = await charts.createChartForEvent(statsEventThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalEventOneYear = await recordDB.getCountForThisYear("event");
                        text = `\n\n**${totalEventOneYear}** événements ont été organisés sur le serveur durant cette période.`;
                        const statsEventOneYear = await recordDB.getCountEachMonthForThisYear("event");
                        chart = await charts.createChartForEvent(statsEventOneYear);
                        break;
                }
            case 'all':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalMessageSevenDays = await messageDB.getMessageCountForOneWeek();
                        const totalBottleSevenDays = await bottleDB.getBottleCountForOneWeek();
                        const totalUserSevenDays = await recordDB.getCountForOneWeek("user");
                        text = `\n\n**${totalMessageSevenDays}** messages ont été envoyés sur le serveur durant cette période.`;
                        text += `\n**${totalBottleSevenDays}** bouteilles ont été envoyées sur le serveur durant cette période.`;
                        text += `\n**${totalUserSevenDays}** utilisateurs ont été sur le serveur durant cette période.`;
                        const statsMessage = await messageDB.getMessageCountEachDayForOneWeek();
                        const statsBottle = await bottleDB.getBottleCountEachDayForOneWeek();
                        const statsUser = await recordDB.getCountEachDayForOneWeek("user");
                        chart = await charts.createChartForAll(statsBottle, statsMessage, statsUser);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalMessageThirtyDays = await messageDB.getMessageCountForOneMonth();
                        const totalBottleThirtyDays = await bottleDB.getBottleCountForOneMonth();
                        const totalUserThirtyDays = await recordDB.getCountForOneMonth("user");
                        text = `\n\n**${totalMessageThirtyDays}** messages ont été envoyés sur le serveur durant cette période.`;
                        text += `\n**${totalBottleThirtyDays}** bouteilles ont été envoyées sur le serveur durant cette période.`;
                        text += `\n**${totalUserThirtyDays}** utilisateurs ont été sur le serveur durant cette période.`;
                        const statsMessageThirtyDays = await messageDB.getMessageCountEachDayForOneMonth();
                        const statsBottleThirtyDays = await bottleDB.getBottleCountEachDayForOneMonth();
                        const statsUserThirtyDays = await recordDB.getCountEachDayForOneMonth("user");
                        chart = await charts.createChartForAll(statsBottleThirtyDays, statsMessageThirtyDays, statsUserThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalMessageOneYear = await messageDB.getMessageCountForThisYear();
                        const totalBottleOneYear = await bottleDB.getBottleCountForThisYear();
                        const totalUserOneYear = await recordDB.getCountForThisYear("user");
                        text = `\n\n**${totalMessageOneYear}** messages ont été envoyés sur le serveur durant cette période.`;
                        text += `\n**${totalBottleOneYear}** bouteilles ont été envoyées sur le serveur durant cette période.`;
                        text += `\n**${totalUserOneYear}** utilisateurs ont été sur le serveur durant cette période.`;
                        const statsMessageOneYear = await messageDB.getMessageCountEachMonthForThisYear();
                        const statsBottleOneYear = await bottleDB.getBottleCountEachMonthForThisYear();
                        const statsUserOneYear = await recordDB.getCountEachMonthForThisYear("user");
                        chart = await charts.createChartForAll(statsBottleOneYear, statsMessageOneYear, statsUserOneYear);
                        break;
                }
                break;
        }

        const embed = createEmbeds.createFullEmbed('Statistiques', 'Voici les statistiques du serveur pour la période : **' + periodeName + '**' + text, null, chart, null, undefined);
        return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
    },
};