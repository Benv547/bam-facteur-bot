const {SlashCommandBuilder} = require("discord.js");
const {afkRole} = require("../config.json");
const userDB = require("../database/user");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Permet de se mettre AFK (ou de revenir de AFK).'),
    async execute(interaction) {
        if (interaction.member.roles.cache.has(afkRole)) {
            await interaction.member.roles.remove(afkRole);
            await userDB.reset_afk_number(interaction.member.id);
            return interaction.reply({content: "Tu n'es plus AFK !", ephemeral: true});
        } else {
            await interaction.member.roles.add(afkRole);
            return interaction.reply({content: "Tu es maintenant AFK !", ephemeral: true});
        }
    }
}