import { CSSProperties, FC, StyleHTMLAttributes, createRef, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ImageFile } from "../types/Image";
import './Item.css';
import { useDrag, useDrop, DragPreviewImage } from "react-dnd";
import { DragItem } from "./Viewer.types";
import { ViewerContext } from "./Viewer.context";
import { getEmptyImage } from 'react-dnd-html5-backend'

const breforeTemplate = (id:string, value:number) => {
    return `
    .ViewerItem.${id}:before {
        content: "";
        float: left;
        padding-top: ${value}%;
        display: block;
    }
    `;
};

const ViewerItemPr: FC<{
    image: ImageFile;
    width: number;
    rowAspect: number;
    isContain?: boolean;
    onDrag: (fromItem: DragItem, toItem: DragItem, actionType: 'append' | 'prepend') => void;
    onDrop: (fromItem: DragItem, toItem: DragItem) => void;
}> = ({
    image,
    width,
    rowAspect,
    isContain,
    onDrag,
    onDrop
}) => {

    const contextValue = useContext(ViewerContext);
    const contextRef = useRef(contextValue);
    contextRef.current = contextValue;

    const getContextValue = useCallback(() => {
        return contextRef.current;
    }, []);

    const ref = useRef<HTMLDivElement | undefined>();

    const id = `id-${image.id}`;

    useLayoutEffect(() => {
        const prevStyle = document.getElementById(id);
        if(prevStyle) {
            prevStyle.remove();
        }
        const beforeScc = document.createElement('style');
        beforeScc.setAttribute('id', id);
        beforeScc.textContent = breforeTemplate(id, 100 / rowAspect);
        document.head.append(beforeScc);
    }, []);
    
    const [collectedDrag, drag, dragPreview] = useDrag<DragItem, any, { canDrag: boolean, isDragging: boolean }>(() => ({
        type: 'ViewerItem',
        item: { type: 'ViewerItem', id },
        canDrag: (monitor) => {
            const contextValue = getContextValue();
            return contextValue.allowDrag;
        },
        collect: (monitor) => ({
            canDrag: monitor.canDrag(),
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }));

    const [collectedDrop, drop] = useDrop<DragItem>(() => ({
        accept: 'ViewerItem',
        hover: (item, monitor) => {
            const mouseCoords = monitor.getClientOffset();
            if(!ref.current || !mouseCoords) return;
            const currentRect = ref.current.getBoundingClientRect();
            const currentCenter = currentRect.x + (currentRect.width / 2);
            const type = mouseCoords.x > currentCenter ? 'append' : 'prepend';
            onDrag(item, { id, type: 'ViewerItem' }, type);
        },
        drop: (item, monitor) => {
            if(!ref.current) return;
            onDrop(item, { id, type: 'ViewerItem' });
        },
    }));

    useEffect(() => {
        drag(drop(ref));
        // dragPreview(getEmptyImage(), { captureDraggingState: true })
    }, []);

    return (
        <>
            <div ref={ref as any} className={`ViewerItem ${id} ${collectedDrag.canDrag ? 'draggable' : ''}`} style={{ flexBasis: `${width}%`, opacity: collectedDrag.isDragging ? .5 : undefined }} {...{ vertical: (image.imageSizes.aspect < 1).toString(), orientation: image.imageSizes.orientation }} >
                <img src={image.url} style={{ objectFit: isContain ? 'contain' : undefined }} loading="lazy" />
            </div>
        </>
    );
};

export const ViewerItem = memo(ViewerItemPr);