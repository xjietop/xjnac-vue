import defaultSettings from '@/settings'

const title = defaultSettings.title || '恒昌医药'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}
