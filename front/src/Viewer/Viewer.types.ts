import { ImageFile } from "../types/Image";

export type DragItem = {
    id: ImageFile['id'];
    type: 'ViewerItem';
    ref?: HTMLDivElement;
};