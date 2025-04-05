const {SlashCommandBuilder} = require("discord.js");
const userDB = require("../database/user");
const ileDB = require("../database/user_ile");
const orAction = require("../utils/orAction");
const embeds = require("../utils/createEmbeds");
const { ile, ileVoice } = require('../config.json');
const { levels } = require('../xp.json');

module.exports = {
    public: true,
    price: 200,
    data: new SlashCommandBuilder()
        .setName('ile')
        .setDescription('Rejoignez une île !'),
    async execute(interaction) {

        const user = await userDB.getUser(interaction.user.id);
        if (user === null || user.xp < levels[4].xp) {
            // Fetch role
            const role = await interaction.guild.roles.fetch(levels[4].role);
            return interaction.reply({content: 'Vous n\'avez pas assez d\'<:xp:851123277497237544> pour rejoindre une île.\nRevenez me voir quand vous aurez atteint le **' + role.name + '**.', ephemeral: true});
        }

        // fetch channels
        const channel = await interaction.guild.channels.fetch(ile);
        const channelVoice = await interaction.guild.channels.fetch(ileVoice);

        // check if user is already in the channel
        if (channel.members.has(interaction.user.id)) {
            const date = await ileDB.getUserIleTicketDate(interaction.user.id);

            if (date) {
                return interaction.reply({content: '**Vous êtes déjà sur l\'<#' + ile + '>**.\nVotre ticket est valide jusque <t:' + Math.round(new Date(date).getTime() / 1000) + ':R>.', ephemeral: true});
            }
        }

        if (await orAction.get(interaction.user.id) < this.price) {
            return interaction.reply({content: 'Vous n\'avez pas assez d\'<:or:851123277497237544> pour rejoindre une île.\nIl vous faut **' + this.price + '** <:or:851123277497237544>.', ephemeral: true});
        }

        await orAction.reduce(interaction.user.id, this.price);
        await ileDB.createUserIleTicket(interaction.user.id);

        // add user to channel
        await channel.permissionOverwrites.edit(interaction.member, {ViewChannel: true, SendMessages: true});
        await channelVoice.permissionOverwrites.edit(interaction.member, {ViewChannel: true, Connect: true});
        const embed = embeds.createFullEmbed('', 'Bienvenue à <@' + interaction.user.id + '> sur l\'<#' + ile + '> !\n\n' +
            'Vous pouvez rejoindre l\'<#' + ileVoice + '> pour discuter en vocal.\n' +
            '**N\'oubliez pas de vous présenter aux autres membres !**', interaction.user.avatarURL(), null, 0x2f3136, null);
        await channel.send({content: '', embeds: [embed]});
        return interaction.reply({content: 'Vous avez rejoint l\'<#' + ile + '> !', ephemeral: true});
    },
};