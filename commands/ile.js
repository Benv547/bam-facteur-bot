const {SlashCommandBuilder} = require("discord.js");
const userDB = require("../database/user");
const { ile, ileVoice } = require('../config.json');
const { levels } = require('../xp.json');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('island')
        .setDescription('Join an island!'),
    async execute(interaction) {

        const user = await userDB.getUser(interaction.user.id);
        if (user === null || user.xp < levels[4].xp) {
            // Fetch role
            const role = await interaction.guild.roles.fetch(levels[4].role);
            return interaction.reply({content: 'You don\'t have enough <:xp:1058066266797113455> to join an island.\nCome back to me when you have reached **' + role.name + '**.', ephemeral: true});
        }

        // fetch channels
        const channel = await interaction.guild.channels.fetch(ile);
        const channelVoice = await interaction.guild.channels.fetch(ileVoice);


        // check if user is already in the channel
        if (channel.members.has(interaction.user.id)) {
            await channel.permissionOverwrites.edit(interaction.member, {ViewChannel: false, SendMessages: false});
            await channelVoice.permissionOverwrites.edit(interaction.member, {ViewChannel: false, Connect: false});
            return interaction.reply({content: 'You have left the island!', ephemeral: true});
        }

        // add user to channel
        await channel.permissionOverwrites.edit(interaction.member, {ViewChannel: true, SendMessages: true});
        await channelVoice.permissionOverwrites.edit(interaction.member, {ViewChannel: true, Connect: true});
        return interaction.reply({content: 'You have join the island!', ephemeral: true});
    },
};