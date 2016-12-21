import { NativeModules } from 'react-native';

const IntentSender = NativeModules.IntentSender;
const IntentSenderWrapper = {
    targets: {
        WHATSAPP: IntentSender.WHATSAPP,
        FB_MESSENGER: IntentSender.FB_MESSENGER,
    },
    sendTextToApplication(message, target) {
        IntentSender.sendTextToApplication(message, target);
    },
    chooseAndSendText(message, chooserTitle) {
        IntentSender.chooseAndSendText(message, chooserTitle);
    },
};

export default IntentSenderWrapper;
