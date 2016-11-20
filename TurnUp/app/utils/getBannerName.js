export default function getBannerName(eventType) {
    switch(eventType) {
        case 'BUSINESS':
            return 'banner_rocket';
        case 'FOOD':
            return 'banner_food';
        default:
            return 'banner_rocket';
    }
}