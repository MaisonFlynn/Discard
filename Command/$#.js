const User = require('../Model/User');
const { EmbedBuilder } = require('discord.js');
const { Btn1 } = require('../Utility/Butt');

async function GETLeaderboard(guild) {
  let U = await User.find({}); // ALL User(s)
  const M = await guild.members.fetch();

  const L = U
    .filter((u) => M.has(u.ID))
    .sort((a, b) => b.Dong - a.Dong)
    .slice(0, 3)
    .map((u, i) => {
      const m = M.get(u.ID);
      return `${['🥇', '🥈', '🥉'][i]} ${u.Dong.toLocaleString()}₫ <@${m ? m.id : '?'}>`;
    });

  return {
    desc: L.length ? L.join('\n') : '?',
  };
}

exports.Leaderboard = async (I, P) => {
  const { desc } = await GETLeaderboard(I.guild);

  const msg = EmbedBuilder.from(I.message.embeds[0]).setDescription(desc);
  const btn = Btn1(P.Msg, true);

  await I.update({ embeds: [msg], components: [btn] });
};

module.exports.GETLeaderboard = GETLeaderboard;
