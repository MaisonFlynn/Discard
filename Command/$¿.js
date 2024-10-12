const { EmbedBuilder } = require('discord.js');

module.exports = async function Help(message) {
    const idk = [
        '∘ ∘ ∘ ( °ヮ° ) ?',
        '( ꩜ ᯅ ꩜;)⁭⁭',
        '( ╹ -╹)?'
    ];

    const rnd = idk[Math.floor(Math.random() * idk.length)];

    const msg = new EmbedBuilder()
        .setDescription(
            '- `$?` ( • - • ) ...\n' +
            '- `$!` (,,>ヮ<,,)!\n' +
            '- `$#` ( ◡̀_◡́)ᕤ\n' +
            '- `$$` ($⩊$)\n' +
            '- `$-` (° × ° )\n' +
            '- `$+` (ᗒᗩᗕ)\n' +
            '- `$<10-1000/10>` (づ ᴗ _ᴗ)づ.☘︎ ́˖\n\n' +
            `[${rnd}](https://bicyclecards.com/how-to-play/blackjack)`
        )
        .setColor('#2B2D31');
        
    await message.reply({ embeds: [msg] });
};
