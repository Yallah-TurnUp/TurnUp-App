const SmsSenderWrapper = {
    sendTexts(texts) {
        texts.forEach(({ delivered }) => delivered());
    }
};

export default SmsSenderWrapper;
