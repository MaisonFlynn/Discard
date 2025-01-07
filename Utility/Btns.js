const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = function Btns(Msg, L = false) {
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
            .setCustomId(Msg ? 'UNMUTE' : 'MUTE')
            .setEmoji(Msg ? '🔔' : '🔕')
            .setStyle(ButtonStyle.Success)
    );
};