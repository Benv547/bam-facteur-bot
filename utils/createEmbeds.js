const {EmbedBuilder} = require("discord.js");

module.exports = {
    createBottle: function (content, diceBearSeed) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: 'Un•e illustre inconnu•e', iconURL: 'https://avatars.dicebear.com/api/adventurer-neutral/' + diceBearSeed + '.png'})
            .setDescription(content)
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp();
        return embed;
    },
    createFullEmbed: function (title, description, thumbnail, image, color, footer) {
        const embed = new EmbedBuilder();
        if (title) {
            embed.setTitle(title);
        }
        if (description) {
            embed.setDescription(description);
        }
        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }
        if (image) {
            embed.setImage(image);
        }
        if (footer) {
            embed.setFooter({ text: footer });
        }
        if (color) {
            embed.setColor(color);
        }
        return embed;
    }
};

// inside a command, event listener, etc.
// const exampleEmbed = new EmbedBuilder()
//     .setColor(0x0099FF)
//     .setTitle('Some title')
//     .setURL('https://discord.js.org/')
//     .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
//     .setDescription('Some description here')
//     .setThumbnail('https://i.imgur.com/AfFp7pu.png')
//     .addFields(
//         { name: 'Regular field title', value: 'Some value here' },
//         { name: '\u200B', value: '\u200B' },
//         { name: 'Inline field title', value: 'Some value here', inline: true },
//         { name: 'Inline field title', value: 'Some value here', inline: true },
//     )
//     .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
//     .setImage('https://i.imgur.com/AfFp7pu.png')
//     .setTimestamp()
//     .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
//
// channel.send({ embeds: [exampleEmbed] });