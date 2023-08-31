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
        .setName('statistics')
        .setDescription('Display the server statistics!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription("The type of information to display")
                .setRequired(true)
                .setChoices(
                    { name: 'Messages', value: 'message' },
                    { name: 'Bottles', value: 'bottle' },
                    { name: 'Users', value: 'user' },
                    { name: 'Sanctions', value: 'sanction' },
                    { name: 'Birds', value: 'bird' },
                    { name: 'Wanted notices', value: 'wanted notices' },
                    { name: 'Events', value: 'event' },
                ))
        .addStringOption(option =>
            option.setName('period')
                .setDescription("The time period")
                .setRequired(true)
                .setChoices(
                    { name: '7 days', value: 'sevenDays' },
                    { name: '30 days', value: 'thirtyDays' },
                    { name: '1 year', value: 'oneYear' },
                )),
    async execute(interaction) {
        const type = interaction.options.get('type').value;
        const periode = interaction.options.get('period').value;

        let periodeName = '';
        const sevenDays = 'Last 7 days';
        const thirtyDays = 'Lay 30 days';
        const oneYear = 'this year';

        let chart = null;
        let text = '';

        switch (type) {
            case 'message':
                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalMessageSevenDays = await messageDB.getMessageCountForOneWeek();
                        text = `\n\n**${totalMessageSevenDays}** messages were sent to the server during this period.`;
                        const statsMessage = await messageDB.getMessageCountEachDayForOneWeek();
                        chart = await charts.createChartForMessage(statsMessage);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalMessageThirtyDays = await messageDB.getMessageCountForOneMonth();
                        text = `\n\n**${totalMessageThirtyDays}** messages were sent to the server during this period.`;
                        const statsMessageThirtyDays = await messageDB.getMessageCountEachDayForOneMonth();
                        chart = await charts.createChartForMessage(statsMessageThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalMessageOneYear = await messageDB.getMessageCountEachMonthForThisYear();
                        text = `\n\n**${totalMessageOneYear}** messages were sent to the server during this period.`;
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
                        text = `\n\n**${totalBottleSevenDays}** bottles were sent to the server during this period.`;
                        const statsBottle = await bottleDB.getBottleCountEachDayForOneWeek();
                        const statsBottleArchived = await bottleDB.getBottleArchivedCountEachDayForOneWeek();
                        const statsBottleTerminated = await bottleDB.getBottleTerminatedCountEachDayForOneWeek();
                        chart = await charts.createChartForBottle(statsBottle, statsBottleArchived, statsBottleTerminated);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalBottleThirtyDays = await bottleDB.getBottleCountForOneMonth();
                        text = `\n\n**${totalBottleThirtyDays}** bottles were sent to the server during this period.`;
                        const statsBottleThirtyDays = await bottleDB.getBottleCountEachDayForOneMonth();
                        const statsBottleArchivedThirtyDays = await bottleDB.getBottleArchivedCountEachDayForOneMonth();
                        const statsBottleTerminatedThirtyDays = await bottleDB.getBottleTerminatedCountEachDayForOneMonth();
                        chart = await charts.createChartForBottle(statsBottleThirtyDays, statsBottleArchivedThirtyDays, statsBottleTerminatedThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalBottleOneYear = await bottleDB.getBottleCountForThisYear();
                        text = `\n\n**${totalBottleOneYear}** bottles were sent to the server during this period.`;
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
                    textMoneyAndXp += `\n\n**${total.money}** gold coins are currently in circulation on the server.`;
                    textMoneyAndXp += `\n**${total.xp}** <:xp:1058066266797113455> points are currently in circulation on the server.`;
                }

                switch (periode) {
                    case 'sevenDays':
                        periodeName = sevenDays;
                        const totalUserSevenDays = await recordDB.getCountForOneWeek("user");
                        const totalVIPUserSevenDays = await recordDB.getCountForOneWeek("vip");
                        const totalBoostUserSevenDays = await recordDB.getCountForOneWeek("boost");
                        text = `\n\n**${totalUserSevenDays}** users were on the server during this period.`;
                        text += `\n**${totalVIPUserSevenDays}** users VIP were on the server during this period.`;
                        text += `\n**${totalBoostUserSevenDays}** users have boosted the server during this period.` + textMoneyAndXp;
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
                        text = `\n\n**${totalUserThirtyDays}** users were on the server during this period.`;
                        text += `\n**${totalVIPUserThirtyDays}** users VIP were on the server during this period.`;
                        text += `\n**${totalBoostUserThirtyDays}** users have boosted the server during this period.` + textMoneyAndXp;
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
                        text = `\n\n**${totalUserOneYear}** users were on the server during this period.`;
                        text += `\n**${totalVIPUserOneYear}** users VIP were on the server during this period.`;
                        text += `\n**${totalBoostUserOneYear}** users have boosted the server during this period.` + textMoneyAndXp;
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
                        text = `\n\n**${totalBirdSevenDays}** birds were sent to the server during this period.`;
                        text += `\n**${totalReactionSevenDays}** reactions were sent to the server during this period.`;
                        const statsBird = await birdDB.getBirdCountEachDayForOneWeek();
                        const statsReaction = await birdDB.getReactionCountEachDayForOneWeek();
                        chart = await charts.createChartForBird(statsBird, statsReaction);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalBirdThirtyDays = await birdDB.getBirdCountForOneMonth();
                        const totalReactionThirtyDays = await birdDB.getReactionCountForOneMonth();
                        text = `\n\n**${totalBirdThirtyDays}** birds were sent to the server during this period.`;
                        text += `\n**${totalReactionThirtyDays}** reactions were sent to the server during this period.`;
                        const statsBirdThirtyDays = await birdDB.getBirdCountEachDayForOneMonth();
                        const statsReactionThirtyDays = await birdDB.getReactionCountEachDayForOneMonth();
                        chart = await charts.createChartForBird(statsBirdThirtyDays, statsReactionThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalBirdOneYear = await birdDB.getBirdCountForThisYear();
                        const totalReactionOneYear = await birdDB.getReactionCountForThisYear();
                        text = `\n\n**${totalBirdOneYear}** birds were sent to the server during this period.`;
                        text += `\n**${totalReactionOneYear}** reactions were sent to the server during this period.`;
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
                        text = `\n\n**${totalWantedSevenDays}** wanted notices were sent to the server during this period.`;
                        text += `\n**${totalRepliesSevenDays}** responses were sent to the server during this period.`;
                        const statsWanted = await wantedDB.getWantedCountEachDayForOneWeek();
                        const statsReplies = await wantedDB.getRepliesCountEachDayForOneWeek();
                        chart = await charts.createChartForWanted(statsWanted, statsReplies);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalWantedThirtyDays = await wantedDB.getWantedCountForOneMonth();
                        const totalRepliesThirtyDays = await wantedDB.getRepliesCountForOneMonth();
                        text = `\n\n**${totalWantedThirtyDays}** wanted notices were sent to the server during this period.`;
                        text += `\n**${totalRepliesThirtyDays}** responses were sent to the server during this period.`;
                        const statsWantedThirtyDays = await wantedDB.getWantedCountEachDayForOneMonth();
                        const statsRepliesThirtyDays = await wantedDB.getRepliesCountEachDayForOneMonth();
                        chart = await charts.createChartForWanted(statsWantedThirtyDays, statsRepliesThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalWantedOneYear = await wantedDB.getWantedCountForThisYear();
                        const totalRepliesOneYear = await wantedDB.getRepliesCountForThisYear();
                        text = `\n\n**${totalWantedOneYear}** wanted notices were sent to the server during this period.`;
                        text += `\n**${totalRepliesOneYear}** responses were sent to the server during this period.`;
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
                        text = `\n\n**${totalBanSanctionSevenDays}** banishments were applied on the server during this period.`;
                        text += `\n**${totalMuteSanctionSevenDays}** mutes were applied on the server during this period.`;
                        text += `\n**${totalWarnSanctionSevenDays}** warns were applied on the server during this period.`;
                        text += `\n**${totalWarnabusifSanctionSevenDays}** abusive warns were applied on the server during this period.`;
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
                        text = `\n\n**${totalBanSanctionThirtyDays}** banishments were applied on the server during this period.`;
                        text += `\n**${totalMuteSanctionThirtyDays}** mutes were applied on the server during this period.`;
                        text += `\n**${totalWarnSanctionThirtyDays}** warns were applied on the server during this period.`;
                        text += `\n**${totalWarnabusifSanctionThirtyDays}** abusive warns abusifs were applied on the server during this period.`;
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
                        text = `\n\n**${totalBanSanctionOneYear}** banishments were applied on the server during this period.`;
                        text += `\n**${totalMuteSanctionOneYear}** mutes were applied on the server during this period.`;
                        text += `\n**${totalWarnSanctionOneYear}** warns were applied on the server during this period.`;
                        text += `\n**${totalWarnabusifSanctionOneYear}** abusive warns abusifs were applied on the server during this period.`;
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
                        text = `\n\n**${totalEventSevenDays}** events were organized on the server during this period.`;
                        const statsEventSevenDays = await recordDB.getCountEachDayForOneWeek("event");
                        chart = await charts.createChartForEvent(statsEventSevenDays);
                        break;
                    case 'thirtyDays':
                        periodeName = thirtyDays;
                        const totalEventThirtyDays = await recordDB.getCountForOneMonth("event");
                        text = `\n\n**${totalEventThirtyDays}** events were organized on the server during this period.`;
                        const statsEventThirtyDays = await recordDB.getCountEachDayForOneMonth("event");
                        chart = await charts.createChartForEvent(statsEventThirtyDays);
                        break;
                    case 'oneYear':
                        periodeName = oneYear;
                        const totalEventOneYear = await recordDB.getCountForThisYear("event");
                        text = `\n\n**${totalEventOneYear}** events were organized on the server during this period.`;
                        const statsEventOneYear = await recordDB.getCountEachMonthForThisYear("event");
                        chart = await charts.createChartForEvent(statsEventOneYear);
                        break;
                }
                break;
        }

        try {
            const embed = createEmbeds.createFullEmbed('Statistics', 'This is the server statistics for the period: **' + periodeName + '**' + text, null, chart, null, undefined);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        } catch (error) {
            const embed = createEmbeds.createErrorEmbed('Error', 'Unable to create the chart.');
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }
    },
};