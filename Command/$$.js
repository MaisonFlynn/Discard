const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { Btn2 } = require('../Utility/Butt');
const { Bet } = require('./$N');

exports.Blackjack = async (interac, P) => {
    if (!P.Bet) {
        P.Bet = Math.min(Math.floor(P.Dong / 2 / 10) * 10, 1000);
        await P.save();
    }

    const dong = `\u001b[33m${P.Dong.toLocaleString()}₫\u001b[0m`;
    const title = `\`\`\`ansi\n👋 ${interac.member ? interac.member.displayName : interac.user.username} ${dong}\n\`\`\``;
    const shmoney = `\`\`\`ansi\n\u001b[31m-${P.Bet.toLocaleString()}₫\u001b[0m\n\`\`\``;

    const msg = async () => {
        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setDescription(`${title}${shmoney}`);

        const btn = Btn2(P.Bet, Math.min(P.Dong, 1000), P.Dong);
        await interac.update({ embeds: [embed], components: [btn] });
    };

    await msg();

    const filter = (btnInterac) =>
        ['DECREASE', 'INCREASE', 'CUSTOM', 'CONFIRM'].includes(btnInterac.customId) &&
        btnInterac.user.id === interac.user.id;

    const collector = interac.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (btnInterac) => {
        if (btnInterac.customId === 'CONFIRM') {
            collector.stop();
            await Bet(btnInterac, P, P.Bet);
            return;
        }

        if (btnInterac.customId === 'DECREASE') {
            P.Bet = Math.max(P.Bet - 10, 10);
        } else if (btnInterac.customId === 'INCREASE') {
            P.Bet = Math.min(P.Bet + 10, Math.min(P.Dong, 1000));
        } else if (btnInterac.customId === 'CUSTOM') {
            const modal = new ModalBuilder()
                .setCustomId('MODAL')
                .setTitle('✏️');

            const input = new TextInputBuilder()
                .setCustomId('BET')
                .setLabel('Bet?')
                .setPlaceholder(`-${P.Bet.toLocaleString()}₫`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(input);
            modal.addComponents(row);

            await btnInterac.showModal(modal);
            return;
        }

        await P.save(); // Save updated bet value
        const btn2 = Btn2(P.Bet, Math.min(P.Dong, 1000), P.Dong);
        const msg2 = new EmbedBuilder()
            .setColor('#2B2D31')
            .setDescription(`${title}${shmoney}`);

        await btnInterac.update({ embeds: [msg2], components: [btn2] });
    });
};

exports.Modal = async (interac, P) => {
    const input = interac.fields.getTextInputValue('BET');
    const bet = parseInt(input, 10);

    if (isNaN(bet) || bet < 10 || bet > 1000 || bet % 10 !== 0 || bet > P.Dong) {
        await interac.reply({
            content: '```ansi\n\u001b[31m𝐈𝐍𝐕𝐀𝐋𝐈𝐃 ₫! (𝟏𝟎-𝟏𝐊/𝟏𝟎)\u001b[0m\n```'
        });
        return;
    }

    P.Bet = bet;
    await P.save();

    const dong = `\u001b[33m${P.Dong.toLocaleString()}₫\u001b[0m`;
    const title = `\`\`\`ansi\n👋 ${interac.member ? interac.member.displayName : interac.user.username} ${dong}\n\`\`\``;
    const shmoney = `\`\`\`ansi\n\u001b[31m-${P.Bet.toLocaleString()}₫\u001b[0m\n\`\`\``;

    const embed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setDescription(`${title}${shmoney}`);

    const btn = Btn2(P.Bet, Math.min(P.Dong, 1000), P.Dong);

    await interac.update({ embeds: [embed], components: [btn] });
};