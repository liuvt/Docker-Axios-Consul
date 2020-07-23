import { extname } from 'path';
import * as Url from 'url';

export const extractUrlExtension = (urlImg) => {
    try {
        return extname(Url.parse(urlImg).pathname).replace('.', '');
    } catch (e) {
        return null;
    }
};
