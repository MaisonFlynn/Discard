module.exports = async function Help(message) {
    const CMD = 
      '```\n' +
      '$?\n' +
      '$!\n' +
      '$#\n' +
      '$$\n' +
      '$-\n' +
      '$+\n' +
      '$<10-100/10>\n' +
      '```';
    
    await message.reply(CMD);
};  