export interface OgcResponseInterface {
    sitename?: string;
    title?: string;
    description?: string;
    url: string;
    type?: string;
    image?: Image;
    video?: Video;
}

interface Image {
    url: string;
    width: number;
    height: number;
    type: string;
}

interface Video {
    url: string;
    width: number;
    height: number;
    type: string;
}
