const orAction = require("../utils/orAction");
const createEmbeds = require("../utils/createEmbeds");
const inspirationDB = require("../database/inspiration");
const userDB = require("../database/user");

module.exports = {
    name: 'inspirationBottle',
    async execute(interaction) {
        // Get the user's currency
        let money = await orAction.get(interaction.user.id);
        if (money == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
            money = 0;
        }

        // If the user has more than 1000 or
        if (money < 50) {
            const embed = createEmbeds.createFullEmbed("Pas assez d'or !", 'Vous devez avoir au moins **50 <:piece:1045638309235404860>** pour utiliser cette fonctionnalité !', null, null, 0x2f3136, null, false);
            return interaction.reply({ content: "", embeds: [embed], ephemeral:true });
        }

        // Remove 50 or from the user
        await orAction.reduce(interaction.user.id, 50);

        // Get the inspiration
        const inspiration = await inspirationDB.getRandomInspiration();

        // Create the embed
        const embed = createEmbeds.createFullEmbed("Besoin d'inspiration ?", 'Si vous avez besoin d\'inspiration, j\'ai ce qu\'il vous faut.. essayez ceci :\n\n**"' + inspiration + '"**', null, null, 0x2f3136, 'Si vous n\'êtes pas satisfait de cette inspiration, vous pouvez en demander une autre.', false);
        // Send the embed
        return await interaction.reply({ content: "", embeds: [embed], ephemeral:true });
    },
};