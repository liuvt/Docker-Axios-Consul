export const detailOgc = (_sitename, _title, _description, _url, _type) => {
    return {
        sitename: _sitename || null,
        title: _title || null,
        description: _description || null,
        url: _url,
        type: _type || null,
    };
};

export const mediaOgc = (_url, _width, _height, _type) => {
    return {
        url: _url || null,
        width: _width || null,
        height: _height || null,
        type: _type || null,
    };
};

export const resultCrawler = (url) => {
    return {
        sitename: null,
        title: null,
        description: null,
        url,
        type: null,
        image: {
            url: null,
            width: null,
            height: null,
            type: null,
        },
    };
};
