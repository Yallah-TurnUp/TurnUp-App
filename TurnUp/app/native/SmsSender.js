import { NativeModules } from 'react-native';

function delayedMassSend(texts, index) {
    if (index >= texts.length) return;
    const { number, message, delivered } = texts[index];

    setTimeout(() => {
        SmsSender.sendSmsToNumber(index, number, message, delivered);
        delayedMassSend(texts, index + 1);
    }, 1500);
}

const SmsSender = NativeModules.SmsSender;
const SmsSenderWrapper = {
    sendTexts(texts) {
        delayedMassSend(texts, 0);
    }
};

export default SmsSenderWrapper;
