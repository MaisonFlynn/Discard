const User = require('../Model/User');

module.exports = async function Leaderboard(gangnam) {
  let U = await User.find({}); // ALL User(s)

  const Top5 = U.sort((a, b) => b.Dong - a.Dong).slice(0, 3);
  
  const L = await Promise.all(
    Top5.map(async (u, i) => {
      const m = await gangnam.members.fetch(u.ID).catch(() => null);
      let emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
      return `${emoji} ${u.Dong.toLocaleString()}₫ <@${m ? m.id : '?'}>`;
    })
  );

  return {
    desc: L.join('\n'),
  };
};
