const {SlashCommandBuilder} = require("discord.js");
const userDB = require("../database/user");
const { ile } = require('../config.json');
const { levels } = require('../xp.json');

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('ile')
        .setDescription('Rejoignez une île !'),
    async execute(interaction) {

        const xpAndMoney = await userDB.getTotalOfMoneyAndXp(interaction.user.id);
        if (xpAndMoney === null || xpAndMoney.xp < levels[9].xp) {
            return interaction.reply({content: 'Vous n\'avez pas assez d\'expérience pour rejoindre une île.', ephemeral: true});
        }

        // fetch channel
        const channel = await interaction.guild.channels.fetch(ile);

        // check if user is already in the channel
        if (channel.members.has(interaction.user.id)) {
            return interaction.reply({content: 'Vous êtes déjà sur l\'île.', ephemeral: true});
        }

        // add user to channel
        await channel.permissionOverwrites.edit(interaction.member, {ViewChannel: true, SendMessages: false});
        return interaction.reply({content: 'Vous avez rejoint l\'île !', ephemeral: true});
    },
};