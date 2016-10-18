import { NativeModules } from 'react-native';

const SmsSender = NativeModules.SmsSender;
const SmsSenderWrapper = {
    sendTexts(texts, onComplete) {
        const numbers = texts.map(text => text.number);
        const messages = texts.map(text => text.message);
        SmsSender.sendSmsesToNumbers(numbers, messages, onComplete);
    },
};

export default SmsSenderWrapper;
