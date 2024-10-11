const { EmbedBuilder } = require('discord.js');

module.exports = async function Help(message) {
    const msg = new EmbedBuilder()
    .setTitle('CMD')
        .setDescription(
            '`$?`\n' +
            '`$!`\n' +
            '`$#`\n' +
            '`$$`\n' +
            '`$-`\n' +
            '`$+`\n' +
            '`$<10-1000/10>`'
        )
        .setColor('#2B2D31')
        .setFooter({ text: 'https://bicyclecards.com/how-to-play/blackjack' });
        
    await message.reply({ embeds: [msg] });
};
