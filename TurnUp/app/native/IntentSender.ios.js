const IntentSenderWrapper = {
    targets: {
        WHATSAPP: 'WHATSAPP',
        FB_MESSENGER: 'FB_MESSENGER',
    },
    sendTextToApplication(message, target) {},
    chooseAndSendText(message, chooserTitle) {},
};

export default IntentSenderWrapper;
