import { ImageFile } from "../types/Image";

export const oneImagePercentSize = 30;
export const oneImageMinSizeAspect = 9/16;
export const maxSizeAspect = 21/9;
export const minSizeAspect = 9/21;

export const imageIsVertical = (aspect: number) => {
    return aspect < 1;
};

export const imageIsHorizontal = (aspect: number) => {
    return aspect >= 1;
};

/**check by vertical aspect */
const checkByVerticalAspects = (items: ImageFile[]) => {
    return items.length < 2 ? false : !items.map((el) => imageIsVertical(el.imageSizes.aspect)).includes(false);
};

/**check by horisontal aspect */
const checkByHorizontalAspects = (items: ImageFile[]) => {
    return items.length < 2 ? false : !items.map((el) => imageIsHorizontal(el.imageSizes.aspect)).includes(false);
};

export const checkBySameAspects = (items: ImageFile[]) => {
    return checkByVerticalAspects(items)
        ? 'vertical'
        : checkByHorizontalAspects(items)
        ? 'horizontal'
        : false;
};