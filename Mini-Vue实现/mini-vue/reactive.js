let activeReactiveFn = null;
class Depend {
  constructor() {
    this.reactiveFns = new Set();
  }
  //往依赖数据中添加响应式函数
  depend() {
    if (activeReactiveFn) {
      this.reactiveFns.add(activeReactiveFn);
    }
  }
  //执行依赖响应函数
  notify() {
    this.reactiveFns.forEach((fn) => {
      fn();
    });
  }
}
//设置响应函数
function watchFn(fn) {
  activeReactiveFn = fn;
  fn();
  activeReactiveFn - null;
}
//设置获取依赖项对象的函数
const targetMap = new WeakMap();
function getDepend(target, key) {
  //根据target获取map的过程
  let map = targetMap.get(target);
  if (!map) {
    map = new Map();
    targetMap.set(target, map);
  }
  //根据key获取依赖项depend
  let depend = map.get(key);
  if (!depend) {
    depend = new Depend();
    map.set(key, depend);
  }
  return depend;
}
//设置响应式函数
function reactive(obj) {
  //自动收集响应项， 进行数据劫持
  return new Proxy(obj, {
    get: function (target, key, receiver) {
      //根据target.key获取对应的depend
      const depend = getDepend(target, key);
      //给depend对象添加响应式函数
      depend.depend();
      return Reflect.get(target, key, receiver);
    },
    set: function (target, key, newValue, receiver) {
      Reflect.set(target, key, newValue, receiver);
      //获取依赖项
      const depend = getDepend(target, key);
      depend.notify();
      return true
    },
  });
}
 export {watchFn, reactive}