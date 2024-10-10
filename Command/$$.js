// Command/$$

module.exports = async function Balance(message, P) {
    await message.reply('```' + P.Dong.toLocaleString() + '₫```');
};