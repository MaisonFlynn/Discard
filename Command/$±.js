const { Btn1 } = require('../Utility/Butt');

exports.Notification = async (I, P) => {
    if (I.customId === 'MUTE') {
        P.Msg = false;
    } else if (I.customId === 'UNMUTE') {
        P.Msg = true;
    }
    await P.save();

    const btn = Btn1(P.Msg);
    await I.update({ components: [btn] });
};