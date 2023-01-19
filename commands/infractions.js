const { SlashCommandBuilder} = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const sanctionDB = require("../database/sanctions");
const roles = require("../utils/roles");
const userDB = require("../database/user")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('infractions')
        .setDescription('Voir les infractions d\'un membre')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('L\'id du membre')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsMod(interaction.member)) {

            let userId = await userDB.getUser(interaction.options.getString('userid'));
            let user;

            try {
                user = await interaction.guild.members.fetch(interaction.options.getString('userid'));
            }
            catch {
                return interaction.reply({ content: 'Cet utilisateur n\'est pas sur le serveur ou n\'existe pas.', ephemeral: true });
            }

            const nbWarnAbus = await sanctionDB.countDetail(userId.id_user, "abusif");
            const nbWarn = await sanctionDB.countDetail(userId.id_user, "warn");
            const nbMute = await sanctionDB.countDetail(userId.id_user, "mute");
            const nbBan = await sanctionDB.countDetail(userId.id_user, "ban");

            let resume = "😡 **" + nbWarnAbus + "**, ⚠️ **" + nbWarn + "**, 🚫 **" + nbMute + "**, ⛔️ **" + nbBan + "**";
            const embed = createEmbeds.createFullEmbed(`Voici les infractions de l\'utilisateur :` , resume, 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/325/fax-machine_1f4e0.png', null, 0x2f3136, null);
            
           
            return await interaction.reply({ content: "", embeds: [embed], ephemeral: true });

        }
        return interaction.reply({ content: 'Vous n\'avez pas le droit de faire cela.', ephemeral: true });
    },
};