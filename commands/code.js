const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('Rejoignez une île !')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Le code secret de l\'île')
                .setRequired(true)),
    async execute(interaction) {
        const code = interaction.options.getString('code');

        if (code !== 'AuRevoirBouée') {
            return interaction.reply({content: 'Ce code est incorrect.', ephemeral: true});
        }

        // fetch role
        const roleId = "1032619119759081502";
        const role = await interaction.guild.roles.fetch(roleId);

        // add role to member interaction
        await interaction.member.roles.add(role);
        return interaction.reply({content: 'Vous avez rejoint l\'île abandonnée !', ephemeral: true});
    },
};