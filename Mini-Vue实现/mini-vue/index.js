import {watchFn} from './reactive.js';
import {mount, patch} from './renderer.js';

function createApp (rootComponent) {
    return {
        mount (selector) {
            const container = document.querySelector(selector)
            let isMounted = false
            let oldVNode = null

            watchFn(() => {
                if (!isMounted) {
                    oldVNode = rootComponent.render()
                    mount(oldVNode, container)
                    isMounted = true
                } else {
                    const newVNode = rootComponent.render()
                    patch(oldVNode, newVNode)
                    oldVNode = newVNode
                }
            })
        }
    }
}

export {createApp}