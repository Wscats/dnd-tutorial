import React, { CSSProperties, FC, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { XYCoord, useDragLayer, useDragDropManager } from "react-dnd";
import PreviewHolder from './PreviewHolder';
import { getEmptyImage } from 'react-dnd-html5-backend';

const Box = () => {
    const style: CSSProperties = {
        width: 200,
        height: 50,
        lineHeight: '50px',
        background: 'pink',
        margin: '30px auto'
    }
    // 使用 useDrag
    const [, drager, previewRef] = useDrag({
        type: 'Box',
    })
    useEffect(() => {
        // 断开拖拽图层与原图层的联系，使原图层不会跟随鼠标拖动
        previewRef(getEmptyImage(), { captureDraggingState: true });
    }, []);
    return (
        // 将第二个参数赋值给 ref
        <div ref={drager} style={style}>可拖拽组件 Box</div>
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
): CSSProperties {
    if (!initialOffset || !currentOffset) {
        return {
            display: "none"
        };
    }

    // const { x, y } = initialOffset
    const { x, y } = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform
    };
}

export const CustomDragLayer: FC = () => {

    const {
        isDragging,
        initialOffset,
        currentOffset,
        delta
    } = useDragLayer((monitor) => {
        return {
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            delta: monitor.getDifferenceFromInitialOffset(),
            isDragging: monitor.isDragging()
        };
    });

    console.log('initialOffset', initialOffset, 'currentOffset', currentOffset, 'delta', delta);

    return (
        <div className="drag-layer" data-is-dragging={isDragging} style={{ ...layerStyles, display: isDragging ? 'block' : 'none' }}>
            <div style={getItemStyles(initialOffset, currentOffset)}>
                <PreviewHolder />
            </div>
        </div>
    );
};


// const Dustbin = () => {
//     const style: CSSProperties = {
//         width: 400,
//         height: 400,
//         margin: '100px auto',
//         lineHeight: '60px',
//         border: '1px dashed black'
//     }
//     // 第一个参数是 collect 方法返回的对象，第二个参数是一个 ref 值，赋值给 drop 元素
//     const [collectProps, droper] = useDrop({
//         // accept 是一个标识，需要和对应的 drag 元素中 item 的 type 值一致，否则不能感应
//         accept: 'Box',
//         // collect 函数，返回的对象会成为 useDrop 的第一个参数，可以在组件中直接进行使用
//         collect: (minoter) => ({
//             isOver: minoter.isOver()
//         })
//     })
//     const bg = collectProps.isOver ? 'deeppink' : 'white';
//     const content = collectProps.isOver ? '快松开，放到碗里来' : '将 Box 组件拖动到这里'
//     return (
//         // 将 droper 赋值给对应元素的 ref
//         <div ref={droper} style={{ ...style, background: bg }}>{content}</div>
//     )
// }

export const App = () => {
    return (
        <div className="container">
            <DndProvider backend={HTML5Backend}>
                <CustomDragLayer />
                <Box />
                {/* <Dustbin /> */}
            </DndProvider>
        </div>
    );
}
