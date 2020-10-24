import defaultSettings from '@/settings';

const title = defaultSettings.title || '管理系统';

export default function getPageTitle(pageTitle, hideSuffix = false) {
    if (pageTitle) {
        return hideSuffix ? pageTitle : `${pageTitle} - ${title}`;
    }
    return `${title}`;
}
