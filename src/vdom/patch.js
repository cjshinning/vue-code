/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(el, vnode){
    console.log(el, vnode);
    // 根据虚拟节点创造真实节点,替换为真实元素并返回
    const elm = createElm(vnode);
    return elm;
}

function createElm(vnode) {
    let {tag, data, children, text, vm} = vnode;
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag)
        // 处理 data 属性
        updateProperties(vnode.el, data)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        });
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el;
  }
  
// 循环 data 添加到 el 的属性上
function updateProperties(el, props = {} ) {
    // todo 当前实现没有考虑样式属性
    for(let key in props){
        el.setAttribute(key, props[key])
    }
}
