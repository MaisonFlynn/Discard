const User = require('../Model/User');

module.exports = async function Leaderboard(guild) {
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
};
