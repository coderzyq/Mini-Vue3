//h函数，用于返回一个VNode对象
const h = (tag, props, children) => {
    //vnode -> javascript对象 -> {}
    return {
        tag,
        props,
        children
    }
}

//mount函数，用于将VNode对象挂载到DOM上
const mount = (vnode, container) => {
    //vnode -> element
    //1.创建出真实的元素，并且在vnode上保留el
    const el = vnode.el = document.createElement(vnode.tag)
        //2.处理props
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]
            if (key.startsWith("on")) {
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }
    //3.处理children
    if (vnode.children) {
        if (typeof vnode.children === "string") {
            el.textContent = vnode.children
        } else {
            vnode.children.forEach(item => {
                mount(item, el)
            })
        }
    }

    //4.将el挂载到container
    container.appendChild(el)
}

//pathch函数，用于对两个VNode进行对比，决定如何处理新的VNode
const patch = (node1, node2) => {
        //标签不相等时，直接将vnode1删除
        if (node1.tag !== node2.tag) {
            //获取父元素
            const n1Parent = node1.el.parentElement
                //删除node1
            n1Parent.removeChild(n1Parent.el)
                //将node2挂载到父元素上
            mount(node2, n1Parent)
        } else { //tag相等时，props不相等时
            //1.取出element对象，并在node2中进行保存
            const el = node1.el = node2.el
                //2.处理props
            const oldProps = node1.props || {}
            const newProps = node2.props || {}
                //2.1获取所有的newProps添加到el
            for (const key in newProps) {
                const oldValue = oldProps[key]
                const newValue = newProps[key]
                if (newValue !== oldValue) {
                    if (key.startsWith("on")) {
                        el.addEventListener(key.slice(2).toLowerCase, value)
                    } else {
                        el.setAttribute(key, value)
                    }
                }
            }
            //2.2删除旧的props
            for (const key in oldProps) {
                if (key.startsWith("on")) {
                    const value = oldProps[key]
                    el.removeEventListener(key.slice(2).toLowerCase, value)
                }
                if (!(key in newProps)) {
                    el.removeAttribute(key)
                }
            }
        }
        // const patch = (n1, n2) => {
        //     //3.处理children
        //     const oldChildren = n1.children || [];
        //     const newChildren = n2.children || [];
        //     if (typeof newChildren === "string") {
        //       //情况一：newChildrenben本身是一个string
        //       //edge case
        //       if (typeof oldChildren === "string") {
        //         if (newChildren !== oldChildren) {
        //           el.textContent = newChildren;
        //         }
        //       } else {
        //         el.innerHTML = newChildren;
        //       }
        //     } else {
        //       //情况二： newChildren本身是一个数组
        //       if (typeof oldChildren === "string") {
        //         el.innerHTML = "";
        //         newChildren.forEach((item) => {
        //           mount(item, el);
        //         });
        //       } else {
        //         //oldChildren: [v1, v2, v3, v7, v9]
        //         //newChildren: [v1, v5, v6]
        //         //1.前面有相同节点的原生进行patch操作
        //         const commonLength = Math.min(oldChildren.length, newChildren.length);
        //         for (let i = 0; i < commonLength; i++) {
        //           patch(oldChildren[i], newChildren[i]);
        //         }

        //         //2.newChildren.length > oldChildren.length
        //         if (newChildren.length > oldChildren.length) {
        //           newChildren.slice(oldChildren.length).forEach((item) => {
        //             mount(item, el);
        //           });
        //         }

        //         //3.newChildren.length < oldChildren.length
        //         if (newChildren.length < oldChildren.length) {
        //           oldChildren.slice(newChildren.length).forEach((item) => {
        //             el.removeChild(item.el);
        //           });
        //         }
        //       }
        //     }
        //   }
        // };