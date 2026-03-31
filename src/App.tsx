import React, { CSSProperties, FC, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend';
import { XYCoord, useDragLayer } from 'react-dnd';
import PreviewHolder from './PreviewHolder';

/** Draggable box component. */
const Box = () => {
    const style: CSSProperties = {
        width: '100%',
        height: 50,
        lineHeight: '50px',
        background: 'pink',
    }
    const [, drager, previewRef] = useDrag({
        type: 'Box',
        end: (_item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (dropResult) {
                console.log('Dropped on:', dropResult);
            }
        },
    })
    useEffect(() => {
        // Disconnect the drag preview from the default browser drag image
        previewRef(getEmptyImage(), { captureDraggingState: true });
    }, [previewRef]);
    return (
        <div ref={drager} style={style}>Draggable Box</div>
    )
}

const layerStyles: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 1000,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
};

function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null,
    mouseOffset: XYCoord | null,
): CSSProperties {
    if (!initialOffset || !currentOffset || !mouseOffset) {
        return {
            display: "none"
        };
    }

    const { x, y } = mouseOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform
    };
}

/** Custom drag layer for rendering drag preview. */
export const CustomDragLayer: FC = () => {
    const {
        isDragging,
        initialOffset,
        currentOffset,
        mouseOffset,
    } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        mouseOffset: monitor.getClientOffset(),
        delta: monitor.getDifferenceFromInitialOffset(),
        isDragging: monitor.isDragging(),
    }));

    return (
        <div className="drag-layer" data-is-dragging={isDragging} style={{ ...layerStyles, display: isDragging ? 'block' : 'none' }}>
            <div style={getItemStyles(initialOffset, currentOffset, mouseOffset)}>
                <PreviewHolder />
            </div>
        </div>
    );
};


/** Drop target component. */
const Dustbin = () => {
    const style: CSSProperties = {
        width: 400,
        height: 400,
        margin: '100px auto',
        lineHeight: '60px',
        border: '1px dashed black',
    }
    const [collectProps, droper] = useDrop({
        accept: 'Box',
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        drop(_item, _monitor) {
            return { name: 'AAA' };
        },
    })
    const bg = collectProps.isOver ? 'deeppink' : 'white';
    const content = collectProps.isOver ? 'Release to drop here' : 'Drag the Box component here';
    return (
        <div ref={droper} style={{ ...style, background: bg }}>{content}</div>
    )
}

export const App = () => {
    return (
        <div className="container">
            <DndProvider backend={HTML5Backend}>
                <CustomDragLayer />
                <Box />
                <Dustbin />
            </DndProvider>
        </div>
    );
}
