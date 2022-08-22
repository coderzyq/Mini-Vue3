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
    //1.创建出真实的原生，并且在vnode上保留element
    const element = vnode.el = document.createElement(vnode.tag)

    //2.处理props
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]

            if (key.startsWith("on")) {
                element.addEventListener(key.slice(2).toLocaleLowerCase(), value)
            } else {
                element.setAttribute(key, value)
            }
        }
    }

    //3.处理children
    if (vnode.children) {
        if (typeof vnode.children === 'string') {
            element.textContent = vnode.children
        } else {
            vnode.children.forEach(item => {
                mount(item, element)
            })
        }
    }

    //4.将el挂载带container上
    container.appendChild(element)
}

//pathch函数，用于对两个VNode进行对比，决定如何处理新的VNode
const patch = (n1, n2) => {

}