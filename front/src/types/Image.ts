export type ImageFile = File & {
    id: string;
    url: string;
    imageSizes: {
        orientation: string;
        aspect: number;
        width: number;
        height: number;
    }
};