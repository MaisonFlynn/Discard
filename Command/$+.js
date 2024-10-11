const { EmbedBuilder } = require('discord.js');

module.exports = async function Unmute(message, P) {
    P.Msg = true;
    await P.save();

    const msg = new EmbedBuilder()
        .setDescription('🔊')
        .setColor('#2B2D31');

    await message.reply({ embeds: [msg] });
};