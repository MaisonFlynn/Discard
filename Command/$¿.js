module.exports = async function Help(message) {
    const CMD = 
      '```\n' +
      '$?\n' +
      '$!\n' +
      '$#\n' +
      '$$\n' +
      '$-\n' +
      '$+\n' +
      '$<10-1000/10>\n' +
      '```';
    
    await message.reply(CMD);
};  