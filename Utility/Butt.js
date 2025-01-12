const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function Btn1(Msg, L = false) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('BLACKJACK')
            .setEmoji('♠️')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('LEADERBOARD')
            .setEmoji('🏆')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(L),
        new ButtonBuilder()
            .setCustomId(Msg ? 'MUTE' : 'UNMUTE')
            .setEmoji(Msg ? '🔕' : '🔔')
            .setStyle(ButtonStyle.Secondary)
    );
}

function Btn2(cur, max, VND) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('INCREASE')
            .setEmoji('➕')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(cur >= max),
        new ButtonBuilder()
            .setCustomId('DECREASE')
            .setEmoji('➖')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(cur <= 10),
        new ButtonBuilder()
            .setCustomId('CUSTOM')
            .setEmoji('❔')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('CONFIRM')
            .setEmoji('✔️')
            .setStyle(ButtonStyle.Success)
            .setDisabled(VND < 10)
    );
}

function Btn3(pΣ, dH) {
    const btn = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('HIT')
                .setLabel('𝐇𝐈𝐓')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('STAND')
                .setLabel('𝐒𝐓𝐀𝐍𝐃')
                .setStyle(ButtonStyle.Secondary)
        );

    if (pΣ === 9 || pΣ === 10 || pΣ === 11) {
        btn.addComponents(
            new ButtonBuilder()
                .setCustomId('DOUBLE')
                .setLabel('𝐃𝐎𝐔𝐁𝐋𝐄 𝐃𝐎𝐖𝐍')
                .setStyle(ButtonStyle.Danger)
        );
    }

    if (dH && Array.isArray(dH) && dH.length > 0 && dH[0].startsWith('A')) {
        btn.addComponents(
            new ButtonBuilder()
                .setCustomId('INSURANCE')
                .setLabel('𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄')
                .setStyle(ButtonStyle.Success)
        );
    }

    return btn;
}

function Btn4() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('REPLAY')
            .setEmoji('♾️')
            .setStyle(ButtonStyle.Primary)
    );
}

module.exports = { Btn1, Btn2, Btn3, Btn4 };