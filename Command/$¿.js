const { EmbedBuilder } = require('discord.js');

module.exports = async function Help(message) {
    const msg = new EmbedBuilder()
        .setDescription(
            '`$?`\n' +
            '`$!`\n' +
            '`$#`\n' +
            '`$$`\n' +
            '`$-`\n' +
            '`$+`\n' +
            '`$<10-1000/10>`\n\n' +
            '[( ꩜ ᯅ ꩜;)](https://bicyclecards.com/how-to-play/blackjack)'
        )
        .setColor('#2B2D31');
        
    await message.reply({ embeds: [msg] });
};
