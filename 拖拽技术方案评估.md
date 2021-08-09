# 拖拽实现方式

实现元素拖放的两种方式：

- 传统方式 mouseEvent 实现：通过监听鼠标事件，获取元素移动的位置，计算并赋值到目标位置上，依赖 position 的定位样式
- HTML5方式 dragEvent 实现：HTML5 中提供了直接拖放的 API，极大的方便我们实现拖放效果，只需要通过监听元素的拖放事件就能实现各种拖放功能。想要拖放某个元素，必须设置该元素的 draggable 属性为 true 目标

优劣势：

- HTML5 拖放允许在浏览器外部拖动与其他应用程序交互。
- 传统方式兼容性高
- HTML5 拖放偏向数据传输，传统方式偏向元素移动

`dragEvent` 兼容性

https://developer.mozilla.org/en-US/docs/Web/API/DragEvent

![image](https://user-images.githubusercontent.com/17243165/128323939-00d35c85-602a-4ecb-8252-723beb6c98c6.png)

`mouseEvent` 兼容性

https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event

![image](https://user-images.githubusercontent.com/17243165/128467894-fce04ece-b61b-40af-9262-90832c78bb3e.png)


# 飞书(基于HTML5方式实现)

代码搜索关键词 `dnd-preview__holder`

使用 `addEventListeners` 监听全局 `window`

```js
e.prototype.setup = function () {
    if (void 0 !== this.window) {
        if (this.window.__isReactDndBackendSetUp) throw new Error('Cannot have two HTML5 backends at the same time.');
        (this.window.__isReactDndBackendSetUp = !0), this.addEventListeners(this.window);
    }
};
```

![image](https://user-images.githubusercontent.com/17243165/128457893-977f9050-49ad-4012-b929-25f3ae37f2da.png)

上面这段代码可以看出使用了 [`react-dnd`](https://github.com/react-dnd/react-dnd/blob/e8bd6436548d96f6d6594f763752f424c2e0834b/packages/backend-html5/src/HTML5BackendImpl.ts)

监听了很多方法，这里把被拖放的元素称为`源对象`，被经过的元素称为`过程对象`，到达的元素称为目标对象，不同的对象产生不同的拖放事件，在所有拖放事件中提供了一个数据传递对象 dataTransfer，用于在源对象和目标对象间传递数据，它包含了一些方法及属性。包括了 setData()、getData()、clearData()方法来操作拖拽过程中传递的数据，setDragImage(）方法来设置拖拽时鼠标的下面的图片默认为被拖拽元素，effectAllowed 和 dropEffect 属性来设置拖放效果。

```js
e.prototype.addEventListeners = function (e) {
    e.addEventListener &&
        (e.addEventListener('dragstart', this.handleTopDragStart),
        e.addEventListener('dragstart', this.handleTopDragStartCapture, !0),
        e.addEventListener('dragend', this.handleTopDragEndCapture, !0),
        e.addEventListener('dragenter', this.handleTopDragEnter),
        e.addEventListener('dragenter', this.handleTopDragEnterCapture, !0),
        e.addEventListener('dragleave', this.handleTopDragLeaveCapture, !0),
        e.addEventListener('dragover', this.handleTopDragOver),
        e.addEventListener('dragover', this.handleTopDragOverCapture, !0),
        e.addEventListener('drop', this.handleTopDrop),
        e.addEventListener('drop', this.handleTopDropCapture, !0));
};
e.prototype.removeEventListeners = function (e) {
    e.removeEventListener &&
        (e.removeEventListener('dragstart', this.handleTopDragStart),
        e.removeEventListener('dragstart', this.handleTopDragStartCapture, !0),
        e.removeEventListener('dragend', this.handleTopDragEndCapture, !0),
        e.removeEventListener('dragenter', this.handleTopDragEnter),
        e.removeEventListener('dragenter', this.handleTopDragEnterCapture, !0),
        e.removeEventListener('dragleave', this.handleTopDragLeaveCapture, !0),
        e.removeEventListener('dragover', this.handleTopDragOver),
        e.removeEventListener('dragover', this.handleTopDragOverCapture, !0),
        e.removeEventListener('drop', this.handleTopDrop),
        e.removeEventListener('drop', this.handleTopDropCapture, !0));
};
```

当滑动的时候 `handleTopDragStart` 触发，然后使用 `getEventClientOffset ` 方法获取 `r` 里面包含 `x` 和 `y` 的坐标

![image](https://user-images.githubusercontent.com/17243165/127980263-1d446b75-240b-46d2-9d5e-b31da0170e5a.png)

```js
e.prototype.handleTopDragStart = function (e) {
    var t = this,
        n = this.dragStartSourceIds;
    this.dragStartSourceIds = null;
    var r = c.getEventClientOffset(e);
    this.monitor.isDragging() && this.actions.endDrag(),
        this.actions.beginDrag(n || [], {
            publishSource: !1,
            getSourceClientOffset: this.getSourceClientOffset,
            clientOffset: r,
        });
};
```

当拿到坐标之后会使用 `this.actions.beginDrag` 方法通信三个参数，通过 `redux` 通信数据

-   publishSource
-   getSourceClientOffset
-   clientOffset

![image](https://user-images.githubusercontent.com/17243165/127982506-1508c57a-bf03-468e-b8f6-7333d9dca490.png)

![image](https://user-images.githubusercontent.com/17243165/127981923-1d495663-858e-4839-878c-e670b93481ec.png)

```js
(r.prototype.handleChange = function () {
    if (this.isCurrentlyMounted) {
        var e = this.getCurrentState();
        d(e, this.state) || this.setState(e);
    }
}),
    (r.prototype.getCurrentState = function () {
        var t = this.manager.getMonitor();
        return e(t, this.props);
    });
```

![image](https://user-images.githubusercontent.com/17243165/127990512-0e4f930e-a9c9-4f26-b1e7-289a83c0cee7.png)

然后通过 `d(e, this.state) || this.setState(e)` 做对比判断是否发生了变化，然后执行 `setState` 来触发 `render` 更新，这里会根据 `isVisible` 来决定拖拽组件是否需要显示

```js
{
    key: "render",
    value: function() {
        if (!this.isVisible)
            return null;
        var e = this.props.currentOffset || {
            x: 0,
            y: 0
        }
            , n = e.x
            , t = e.y
            , r = this.item;
        return _.a.createElement("div", {
            className: "dnd-preview__holder",
            style: {
                transform: "translate(".concat(n, "px, ").concat(t, "px)")
            }
        }, _.a.createElement(j, null, _.a.createElement(k, null, this.icon, r && r.is_shortcut && _.a.createElement(A.u, null)), _.a.createElement(R, {
            className: "ellipsis"
        }, this.name)), this.renderMultipleSelection())
    }
}
```

![image](https://user-images.githubusercontent.com/17243165/128208497-9261be91-8584-40a5-a577-da298ee6f058.png)

# 金山(基于传统方式实现)

代码搜索关键词 `yun-list__dragicon`

![image](https://user-images.githubusercontent.com/17243165/128281345-47677dd2-2f58-421d-bec8-d2911727d71f.png)

使用的是 `mousedown`，`mousemove` 和 `mouseup` 配合实现

-   onDocUp
-   onDocMove
-   onDown

```ts
onDown: function(e, t) {
    this.sx = e.clientX,
    this.sy = e.clientY,
    this.curItem = t,
    this.setItemRectCache([].concat((0,
    i.default)(document.getElementsByClassName(this.dropClassName))), "dropCache"),
    document.addEventListener("mousemove", this.onDocMove),
    document.addEventListener("mouseup", this.onDocUp)
},
onDocMove: function(e) {
    var t = e.clientX
        , n = e.clientY;
    (Math.abs(t - this.sx) > 5 || Math.abs(n - this.sy) > 5) && (this.draging = !0,
    this.setDropItem(e, t, n),
    this.setIconPos(t, n))
},
onDocUp: function(e) {
    this.draging = !1,
    this.setOutDrop(e),
    document.removeEventListener("mousemove", this.onDocMove),
    document.removeEventListener("mouseup", this.onDocUp)
},
```

![image](https://user-images.githubusercontent.com/17243165/128287907-74829527-ed64-4e1b-b922-4417cbaae1c2.png)

`onDocMove` 阶段使用 `setIconPos` 去改变拖拽容器的位置

![image](https://user-images.githubusercontent.com/17243165/128292221-85d11f4c-98ea-4909-a7b7-c7aff9e61901.png)

分别有两个碰撞的检测，`setHoverItem` 检测跟自身的列表项，`setOutDrop` 检测左侧边栏的列表项

```ts
setIconPos: function(e, t) {
    var n = this.$refs.icon;
    if (this.$refs.icon) {
        var i = this.iconSize
            , a = this.draging
            , r = this.curIndex
            , o = this.droping
            , c = (0,
        s.default)(i, 2)
            , u = c[0]
            , l = c[1];
        n.style.left = e - (u + 100) / 2 + "px",
        n.style.top = t - l - 50 + "px",
        n.style.cursor = !a || ~r || o ? "default" : "not-allowed"
    }
},
```

`onDocMove` 阶段使用 `setHoverItem` 去计算拖动到自身列表的那一行，循环列表的每一项，判断拖拽的滑块落在那一项中，所以这里也做了碰撞检测，拖拽到那一项用 `curIndex` 记录下来

![image](https://user-images.githubusercontent.com/17243165/128298971-5b5eb0c2-158c-4b09-9148-28349cb7fe6e.png)

```ts
setHoverItem: function(e, t) {
    for (var n = this.rectCache, i = !1, a = n.length - 1; a >= 0; a--) {
        var r = n[a]
            , s = r.x1
            , o = r.y1
            , c = r.x2
            , u = r.y2
            , l = r.index
            , d = r.canDrop;
        if (e < c && e > s && t < u && t > o && d) {
            this.curIndex = l,
            i = !0;
            break
        }
    }
    !i && (this.curIndex = -1)
},
```

当松开手的时候触发 `onDocUp` 事件，再使用 `setOutDrop` 实现碰撞检测，查看拖动文件和目标位置的相对坐标，来判断是否成功拖入

![image](https://user-images.githubusercontent.com/17243165/128295039-337ee021-e364-40e5-bdd9-d55e4569b309.png)

```ts
setOutDrop: function(e) {
    var t = this
        , n = this.dropCache;
    if (n && n.length && 1 === this.checkedKeys.length) {
        var i = e.clientX
            , a = e.clientY;
        n.forEach(function(e) {
            var n = e.x1
                , r = e.y1
                , s = e.x2
                , o = e.y2
                , c = e.index
                , u = e.el
                , l = e.height
                , d = u.classList
                , p = r + l / 2;
            d.remove("dragover"),
            d.remove("dragover-top"),
            // ↓这里为碰撞检测
            i < s && a > n && a < o && a > r && t.$emit("itemdrop", c, t.checkedKeys, 0 === c && a < p)
        })
    }
    this.dropCache = null
},
```

空跑了 for 了来定位

![image](https://user-images.githubusercontent.com/17243165/128298094-418e096c-f445-4fed-a9d0-98ff90f834ef.png)

# 微云(基于传统方式实现)

跟金山相似

![image](https://user-images.githubusercontent.com/17243165/128318218-472967e3-fee9-42bc-a6b9-445fb289fc31.png)

https://git.woa.com/weiyun-web/wy/blob/master/vue-plugin/dragdrop.js

![image](https://user-images.githubusercontent.com/17243165/128322155-4c9647a3-0b7b-44f4-bd74-0dd15717925b.png)

# 谷歌(暂无方式实现)

无拖拽功能


# React DND(基于HTML5方式实现)

React DnD 的英文是 `Drag and Drop for React`

React DnD 是 React 和 Redux 的核心作者 Dan Abramov 创造的一组 React 高阶组件，可以在保持组件分离的前提下帮助构建复杂的拖放接口

两个 `react-dnd-html5-backend` 和 `react-dnd` 核心包的大小

![image](https://user-images.githubusercontent.com/17243165/128459739-cca68440-777c-47b1-ac8c-30f04fa6dbf3.png)

![image](https://user-images.githubusercontent.com/17243165/128459870-ee82de49-ea12-4888-a4eb-8d3ee201f9f4.png)



![image](https://user-images.githubusercontent.com/17243165/128458938-a0926404-ee41-434a-9b0d-bb550c99e8d1.png)

提供的接口

-  exports.DndContext = DndContext;
-  exports.DndProvider = DndProvider;
-  exports.DragLayer = DragLayer;
-  exports.DragPreviewImage = DragPreviewImage;
-  exports.DragSource = DragSource;
-  exports.DropTarget = DropTarget;
-  exports.useDrag = useDrag;
-  exports.useDragDropManager = useDragDropManager;
-  exports.useDragLayer = useDragLayer;
-  exports.useDrop = useDrop;


# Dnd Core

React-DnD 使用数据而不是视图作为事实来源，当在屏幕拖动某些东西的时候，并不是正在拖动组件或者 DOM 节点。而是通过数据模拟 preview 让拖动源正在被拖动。dnd-core正式围绕着数据为核心，并且React-DnD内部使用了 Redux

ReactDnD 通过坐标形式的接口，来控制拖拽源的 preview 位置，如果判断可以落下再把拖拽源移动过去。

配合边界函数和多数逻辑判断，封装了 dnd-core 核心逻辑数据驱动

## 碰撞检测原理

Dnd Core 的工具库里面封装了很多碰撞检测的工具函数

确定两个笛卡尔坐标偏移是否相等

![image](https://user-images.githubusercontent.com/17243165/128461968-98cdcae7-7d5b-4ba0-8ba7-c4ecd38a048b.png)

返回拖动源组件位置的笛卡尔距离，基于其位置，计算当前拖动操作开始的时间，以及移动差异，如果没有被拖动的项目，则返回 null

![image](https://user-images.githubusercontent.com/17243165/128462173-bcf295b1-ff00-4df5-a2dc-367d9b3d67d7.png)


# 基本概念

## Backends

React DnD 抽象了后端的概念，我们可以使用 HTML5 拖拽后端，也可以自定义 touch、mouse 事件模拟的后端实现，后端主要用来抹平浏览器差异，处理 DOM 事件，同时把 DOM 事件转换为 React DnD 内部的 redux action

可以理解为具体拖拽的事件的实现方法

- 移动端主要为 `dragstart`，`selectstart`，`dragenter`，`dragover` 和  `dragend` 的实现

https://github.com/react-dnd/react-dnd/blob/main/packages/backend-html5/src/HTML5BackendImpl.ts

- 移动端主要为 `move`，`start`，`end`，`contextmenu` 和  `keydown` 的实现

https://github.com/react-dnd/react-dnd/blob/e8bd6436548d96f6d6594f763752f424c2e0834b/packages/backend-touch/src/TouchBackendImpl.ts

dnd 后端可以使用官方的提供的两个 HTML5Backend or TouchBackend，或者也可以自己写backend后端

## Item
React DnD 基于数据驱动，当拖放发生时，它用一个数据对象来描述当前的元素，比如 { cardId: 25 }

## Type
类型是唯一标识应用程序中整个项目类别的字符串（或符号），类似于 redux 里面的 actions types 枚举常量。

## Monitors

拖放操作都是有状态的，React DnD 通过 Monitor 来存储这些状态并且提供查询

## Connectors

Backend 关注 DOM 事件，组件关注拖放状态，connector 可以连接组件和 Backend ，可以让 Backend 获取到 DOM。

## useDrag

用于将当前组件用作拖动源的钩子

## useDrop
使用当前组件作为放置目标的钩子

## useDragLayer

用于将当前组件用作拖动层的钩子

inport style from './style.ts'

div className={style.xxxx}