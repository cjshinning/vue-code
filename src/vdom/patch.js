/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(el, vnode){
    // console.log(el, vnode);
    // 1，根据虚拟节点创建真实节点
    const elm = createElm(vnode);
    // console.log("createElm", elm);

    // 2，使用真实节点替换掉老节点
    // 找到元素的父亲节点
    const parentNode = el.parentNode;
    // 找到老节点的下一个兄弟节点（nextSibling 若不存在将返回 null）
    const nextSibling = el.nextSibling;
    // 将新节点elm插入到老节点el的下一个兄弟节点nextSibling的前面
    // 备注：若nextSibling为 null，insertBefore 等价与 appendChild
    parentNode.insertBefore(elm, nextSibling);
    // 删除老节点 el
    parentNode.removeChild(el);

    return elm;
}

function createElm(vnode) {
    let {tag, data, children, text, vm} = vnode;
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag);
        // 处理 data 属性
        updateProperties(vnode.el, data);
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
