const { EmbedBuilder } = require('discord.js');
const User = require('../Model/User');

module.exports = async function Leaderboard(message) {
  let U = await User.find({}); // ALL User(s)

  const Top5 = U.sort((a, b) => b.Dong - a.Dong).slice(0, 3);
  
  const L = await Promise.all(Top5.map(async (u, i) => {
    const m = await message.guild.members.fetch(u.ID).catch(() => null);
    let emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
    return `${emoji} ${u.Dong.toLocaleString()}₫ <@${m ? m.id : '?'}>`;
  }));

  const msg = new EmbedBuilder().setDescription(L.join('\n')).setColor('#2B2D31');
  await message.reply({ embeds: [msg] });
};
