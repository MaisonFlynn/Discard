// Utility/Button

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function btn(pΣ, dH) {
	const row = new ActionRowBuilder()
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
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('DOUBLE')
				.setLabel('𝐃𝐎𝐔𝐁𝐋𝐄 𝐃𝐎𝐖𝐍')
				.setStyle(ButtonStyle.Danger)
		);
	}

	if (dH && Array.isArray(dH) && dH.length > 0 && dH[0].startsWith('A')) {
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('INSURANCE')
				.setLabel('𝐈𝐍𝐒𝐔𝐑𝐀𝐍𝐂𝐄')
				.setStyle(ButtonStyle.Success)
		);
	}	

	return row;
}

module.exports = { btn };