const { EmbedBuilder } = require('discord.js');

module.exports = async function Help(message) {
    const idk = [
        '(づ_ど)',
        '(⸝⸝⸝>﹏<⸝⸝⸝)',
        '(づ￣ ³￣)づ'
    ];

    const rnd = idk[Math.floor(Math.random() * idk.length)];

    const msg = new EmbedBuilder()
        .setDescription(
            '- `$?`\n' +
            '- `$!`\n' +
            '- `$#`\n' +
            '- `$$`\n' +
            '- `$-`\n' +
            '- `$+`\n' +
            '- `$<10-1000/10>`\n\n' +
            `[${rnd}](https://github.com/sponsors/MaisonFlynn)`
        )
        .setColor('#2B2D31');
        
    await message.reply({ embeds: [msg] });
};
