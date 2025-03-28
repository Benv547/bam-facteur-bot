const {SlashCommandBuilder} = require("discord.js");
const userDB = require("../database/user");
const { ile, ileVoice } = require('../config.json');
const { levels } = require('../xp.json');

module.exports = {
    public: true,
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
            await channel.permissionOverwrites.edit(interaction.member, {ViewChannel: false, SendMessages: false});
            await channelVoice.permissionOverwrites.edit(interaction.member, {ViewChannel: false, Connect: false});
            return interaction.reply({content: 'Vous avez quitté l\'île !', ephemeral: true});
        }

        // add user to channel
        await channel.permissionOverwrites.edit(interaction.member, {ViewChannel: true, SendMessages: true});
        await channelVoice.permissionOverwrites.edit(interaction.member, {ViewChannel: true, Connect: true});
        return interaction.reply({content: 'Vous avez rejoint l\'île !', ephemeral: true});
    },
};