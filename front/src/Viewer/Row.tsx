import { ComponentProps, FC, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ImageFile } from "../types/Image";
import { ViewerItem } from "./Item";
import './Row.css';
import { checkBySameAspects, imageIsVertical, maxSizeAspect, minSizeAspect, oneImageMinSizeAspect, oneImagePercentSize } from "./Viewer.utils";
import { DragItem } from "./Viewer.types";
import { useDragDropManager } from "react-dnd";
import { isEqual } from 'lodash';

const ViewerRowPr: FC<{
    images: ImageFile[];
    onDrag: (fromItem: DragItem, toItem: DragItem, actionType: 'append' | 'prepend') => void;
    onDrop: (fromItem: DragItem, toItem: DragItem) => void;
}> = ({
    images,
    onDrag,
    onDrop
}) => {

    const ref = useRef<HTMLDivElement>();

    const imagesSizes = useMemo(() => {

        const minImageHeight = Math.min(...images.map(el => el.imageSizes.height));
        const isOneImage = images.length === 1;
        const prepairedImages = images.map((el) => {
            let { aspect } = el.imageSizes;
            if(aspect > maxSizeAspect) {
                aspect = maxSizeAspect;
            }
            if(isOneImage && aspect < oneImageMinSizeAspect) {
                aspect = oneImageMinSizeAspect;
            } else
            if(aspect < minSizeAspect) {
                aspect = minSizeAspect;
            }
            const newHeight = minImageHeight;
            const newWidth = newHeight * aspect;
            return {
                aspect,
                width: newWidth,
                height: newHeight,
            }
        });
        const allItemsWidth = prepairedImages.map(el => el.width).reduce((a, c) => a + c, 0);
        const itemsInRow = prepairedImages.map(el => {
            let itemPercentsWidth = (el.width / allItemsWidth) * 100;
            if(isOneImage && imageIsVertical(el.aspect)) {
                itemPercentsWidth = oneImagePercentSize;
            }
            return {
                aspect: el.aspect,
                percent: itemPercentsWidth,
                width: el.width,
                height: el.height
            }
        });
        return itemsInRow.map(el => ({
                rowAspect: el.aspect,
                rowWidth: el.percent
            }))
    }, [images]);

    const [rowHeight, setRowHeight] = useState(0);
    const rowHeightRef = useRef(rowHeight);
    rowHeightRef.current = rowHeight;

    const onDragEnd = useCallback(() => {
        setRowHeight(0);
    }, []);

    useEffect(() => {
        window.addEventListener('drop', onDragEnd);
        return () => {
            window.removeEventListener('drop', onDragEnd);
        }
    }, []);

    const onDragHandler = useCallback<ComponentProps<typeof ViewerItem>['onDrag']>((...args) => {
        if(!ref.current) return;
        if(!rowHeightRef.current) setRowHeight(ref.current.clientHeight);
        onDrag(...args);
    }, []);

    const onDropHandler = useCallback<ComponentProps<typeof ViewerItem>['onDrop']>((...args) => {
        if(!ref.current) return;
        setRowHeight(0);
        onDrop(...args);
    }, []);

    return (
        <div
            ref={ref as any}
            className="ViewerRow"
            style={{
                height: rowHeight ? `${rowHeight}px` : 'auto',
                justifyContent: images.length === 1 ? 'center' : undefined
            }}
        >
            {
                images.map((el, idx) => {
                    return <ViewerItem
                        key={`id-${el.id}`}
                        image={el}
                        width={imagesSizes[idx].rowWidth}
                        rowAspect={imagesSizes[idx].rowAspect}
                        onDrag={onDragHandler}
                        onDrop={onDropHandler}
                    />
                })
            }
        </div>
    );
};

export const ViewerRow = memo(ViewerRowPr, isEqual); 