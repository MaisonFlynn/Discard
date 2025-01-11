const { EmbedBuilder } = require('discord.js');
const { Btn1 } = require('../Utility/Butt');

module.exports = async function Claim(I, P) {
    const rn = new Date();
    const d8 = P.Date ? new Date(P.Date) : null;

    let shmoney;

    if (d8 && (rn - d8) < 24 * 60 * 60 * 1000) {
        // Calc. ⩇⩇:⩇⩇:⩇⩇
        const tiktok = 24 * 60 * 60 * 1000 - (rn - d8);
        const h = Math.floor((tiktok / (1000 * 60 * 60)) % 24);
        const m = Math.floor((tiktok / (1000 * 60)) % 60);
        const s = Math.floor((tiktok / 1000) % 60);

        const formulation = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        shmoney = `\`\`\`ansi\n\u001b[31m${formulation}\u001b[0m\n\`\`\``;
    } else {
        P.Dong += 50;
        P.Date = rn;
        await P.save();

        shmoney = '```ansi\n\u001b[32m+50₫\u001b[0m\n```';
    }

    const dong = `\u001b[33m${P.Dong.toLocaleString()}₫\u001b[0m`;
    const title = `\`\`\`ansi\n👋 ${I.member ? I.member.displayName : I.author.username} ${dong}\n\`\`\``;

    const msg = new EmbedBuilder()
        .setColor('#2B2D31')
        .setDescription(`${title}${shmoney}`);

    const btn = Btn1(P.Msg);

    await I.reply({ embeds: [msg], components: [btn] });
};