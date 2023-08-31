const {SlashCommandBuilder} = require("discord.js");
const {afkRole} = require("../config.json");
const userDB = require("../database/user");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Switch to AFK (or back from AFK).'),
    async execute(interaction) {
        if (interaction.member.roles.cache.has(afkRole)) {
            await interaction.member.roles.remove(afkRole);
            await userDB.reset_afk_number(interaction.member.id);
            return interaction.reply({content: 'You are no longer AFK! *It\'s good to see you again! You can now receive new bottles and access the benefits of Treasure Island.*', ephemeral: true});
        } else {
            await interaction.member.roles.add(afkRole);
            return interaction.reply({content: 'You are now AFK! *You will no longer receive any bottles and will not have the benefits of Treasure Island.*', ephemeral: true});
        }
    }
}