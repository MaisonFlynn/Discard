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
            '`$<10-1000/10>`'
        )
        .setColor('#2B2D31')
        .setFooter({ text: '( ꩜ ᯅ ꩜;)⁭⁭', iconURL: 'https://bicyclecards.com/wp-content/themes/bicyclecards/favicon.ico' })
        .setURL('https://bicyclecards.com/how-to-play/blackjack');
        
    await message.reply({ embeds: [msg] });
};
