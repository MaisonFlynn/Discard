const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function btn(pΣ, dH) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('HIT')
				.setLabel('HIT')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('STAND')
				.setLabel('STAND')
				.setStyle(ButtonStyle.Secondary)
		);

	if (pΣ === 9 || pΣ === 10 || pΣ === 11) {
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('DOUBLE')
				.setLabel('DOUBLE DOWN')
				.setStyle(ButtonStyle.Danger)
		);
	}

	if (dH && Array.isArray(dH) && dH.length > 0 && dH[0].startsWith('A')) {
		row.addComponents(
			new ButtonBuilder()
				.setCustomId('INSURANCE')
				.setLabel('INSURANCE')
				.setStyle(ButtonStyle.Success)
		);
	}	

	return row;
}

module.exports = { btn };