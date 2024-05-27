import { FC, useContext, useMemo, useState, createContext, useLayoutEffect, ComponentProps, useEffect, useCallback } from "react";
import { ImageFile } from "../types/Image";
import { ViewerRow } from "./Row";
import './Viewer.css';
import { checkBySameAspects } from "./Viewer.utils";
import { DragItem } from "./Viewer.types";
import { ViewerContext } from "./Viewer.context";
import { useDragDropManager, useDragLayer } from 'react-dnd';

export const Viewer: FC<{
    allowDrag: boolean;
    images: ImageFile[];
    onDrag: (fromItem: DragItem, toItem: DragItem, actionType: 'append' | 'prepend') => void;
    onDrop: (fromItem: DragItem, toItem: DragItem, actionType?: 'append' | 'prepend') => void;
}> = ({
    allowDrag,
    images,
    onDrag,
    onDrop
}) => {

    const [contextState, setContextState] = useState({ allowDrag });

    useEffect(() => {
        setContextState({ allowDrag });
    }, [allowDrag]);

    const rows = useMemo(() => {
        const arrayRows: ImageFile[][] = [];
        // const rows = new Map<number, ImageFile[]>();
        let currentId = 0;
        for(let idx in images) {
            const image = images[idx];
            if(!arrayRows[currentId]) {
                arrayRows[currentId] = [];
            }
            // if(!rows.get(currentId)) {
            //     rows.set(currentId, []);
            // }
            const nextItemId = currentId + 1;
            let isFistLine = arrayRows.length === 1;
            let rowItems = arrayRows[currentId];
            // let rowItems = rows.get(currentId)!;
            // if is last item and row is empty
            if(!isFistLine && !rowItems.length && idx.toString() === (images.length - 1).toString()) {
                let previousRowItems = arrayRows[currentId - 1];
                // let previousRowItems = rows.get(currentId - 1)!;
                previousRowItems.push(image);
                arrayRows[currentId - 1] = previousRowItems;
                // rows.set(currentId - 1, previousRowItems);
                continue;
            } else {
                rowItems.push(image);
            }
            let allItemsIsSameAspect = checkBySameAspects(rowItems);

            if(
                (
                    // if first by all is same
                    isFistLine && allItemsIsSameAspect && rowItems.length === 2
                )
                ||
                (
                    // if not first by all is vertical
                    allItemsIsSameAspect === 'vertical' && rowItems.length === 4
                )
                ||
                (
                    // by default change line if 3 items in line
                    (allItemsIsSameAspect === 'horizontal'
                    || !allItemsIsSameAspect)
                    && rowItems.length >= 3
                )) {
                    currentId = nextItemId;
            }
        }
        // const matrix: ImageFile[][] = [];
        // const entries = rows.entries();
        // let item = entries.next();
        // while(!item.done) {
        //     const [idx, items] = item.value;
        //     if(items.length) {
        //         matrix[idx] = items;
        //     }
        //     item = entries.next();
        // }
        return arrayRows; 
    }, [images]);

    const setCursor = useCallback((isDragging: boolean) => {
        isDragging
        ? document.body.classList.add('dragging')
        : document.body.classList.remove('dragging');
        // document.body.style.cursor = isDragging ? 'grabbing' : '';
    }, []);

    const isDragging = useDragLayer((manager) => {
        return manager.isDragging();
    });

    useEffect(() => {
        setCursor(isDragging);
    }, [isDragging]);

    return (
        <ViewerContext.Provider value={contextState}>
            <div className={`ImageViewer ${isDragging ? 'grabbing' : ''}`}>
                {
                    rows.map((el, idx) => {
                        return <ViewerRow key={idx} images={el} onDrag={onDrag} onDrop={onDrop} />
                    })
                }
            </div>
        </ViewerContext.Provider>
    );
};