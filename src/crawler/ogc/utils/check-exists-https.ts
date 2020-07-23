export const isExistHttps = (url: string) => {
    const reUrl = url.replace('http://', '');
    return reUrl.search('https://') === -1 ? `https://${reUrl}` : reUrl;
};
