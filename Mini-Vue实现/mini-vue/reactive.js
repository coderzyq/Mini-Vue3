class  Depend {
    constructor() {
        this.subscribers = new Set()
    }

    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect)
        }
    }

    notify() {
        this.subscribers.forEach(effect => {
            effect()
        })
    }
}

let activeEffect = null
function watchEffect(effect) {
    activeEffect = effect
    effect()   
    activeEffect = null
}

//Map({key, value}): key是一个字符串
//WeakMap({key, value}): key是一个对象，弱引用
const targetMap = new WeakMap()
function getDep(target, key) {
    //1.根据对象(target)取出对应的Map对象
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    //2.取出具体的dep对象
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Depend()
        depsMap.set(key, dep)
    }
    return dep
}

//vue3对raw进行数据劫持
function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const dep = getDep(target, key)
            dep.depend()
            return target[key]
        },
        set(target, key, newValue) {
            const dep = getDep(target, key)
            target[key] = newValue
            dep.notify()
            //当报Uncaught TypeError: 'set' on proxy: trap returned falsish for property 'xx'错误时，set返回true即可解决
            return true
        }
    })
}

export {watchEffect, reactive}