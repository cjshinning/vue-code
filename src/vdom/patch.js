import { isSameVnode } from './index';

/**
 * 将虚拟节点转为真实节点后插入到元素中
 * @param {*} el    当前真实元素 id#app
 * @param {*} vnode vnode 虚拟节点
 * @returns         新的真实元素
 */
export function patch(el, oldVnode, vnode){
    const isRealElement = oldVnode.nodeType;
    if(isRealElement){// 真实节点，走老逻辑
        const elm = createElm(vnode);
        const parentNode = oldVnode.parentNode;;
        parentNode.insertBefore(elm, oldVnode.nextSibling); 
        parentNode.removeChild(oldVnode);
        return elm;
    }else{// 虚拟节点：做 diff 算法，新老节点比对
        // console.log(oldVnode, vnode);
        if(!isSameVnode(oldVnode, vnode)){
            return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
        }else{
            // 文本的处理：文本可以直接更新，因为文本没有儿子
            // 组件中 Vue.component（‘xxx’）；xxx 就是组件的 tag
            let el = vnode.el = oldVnode.el;  // 节点复用：将老节点 el 赋值给新节点 el
            if(!oldVnode.tag){// 文本：没有标签名
                if(oldVnode.text !== vnode.text){// 内容变更：更新文本内容
                    return el.textContent = vnode.text;// 新内容替换老内容
                } else{
                    return; 
                }
            }
        }
        updateProperties(vnode, oldVnode.data);

        // 比较儿子节点
        let oldChildren = oldVnode.children || {};
        let newChildren = vnode.children || {};

        // 情况 1：老的有儿子，新的没有儿子；直接将对于的老 dom 元素干掉即可;
        if(oldChildren.length > 0 && newChildren.length == 0){
            el.innerHTML = '';
        // 情况 2：老的没有儿子，新的有儿子；直接将新的儿子节点放入对应的老节点中即可
        }else if(oldChildren.length == 0 && newChildren.length > 0){
            newChildren.forEach((child)=>{
                let childElm = createElm(child);
                el.appendChild(childElm);
            })
        // 情况 3：新老都有儿子
        }else{
            // diff 比对的核心逻辑
            updateChildren(el, oldChildren, newChildren); 
        }
    }
}

/**
 * 新老都有儿子时做比对，即 diff 算法核心逻辑
 * 备注：采用头尾双指针的方式；优化头头、尾尾、头尾、尾头的特殊情况；
 * @param {*} el 
 * @param {*} oldChildren 老的儿子节点
 * @param {*} newChildren 新的儿子节点
 */
function updateChildren(el, oldChildren, newChildren){
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];

    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        }else if(isSameVnode(oldEndVnode, newEndVnode)){
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
            // 头尾比较：老的头节点和新的尾节点做对比
        }else if(isSameVnode(oldStartVnode, newEndVnode)){
            // patch方法只会duff比较并更新属性，但元素的位置不会变化
            patch(oldStartVnode, newEndVnode);// diff:包括递归比儿子
            // 移动节点：将当前的节点插入到最后一个节点的下一个节点的前面去
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
            // 移动指针
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        }
    }
    
    // 1，新的多（以新指针为参照）插入新增
    if (newStartIndex <= newEndIndex) {
        // 新的开始指针和新的结束指针之间的节点
        for (let i = newStartIndex; i <= newEndIndex; i++) {
        // 判断当前尾节点的下一个元素是否存在：
        //  1，如果存在：则插入到下一个元素的前面
        //  2，如果不存在（下一个是 null） ：就是 appendChild
        // 取参考节点 anchor:决定新节点放到前边还是后边
        //  逻辑：取去newChildren的尾部+1,判断是否为 null
        //  解释：如果有值说明是向前移动的，取出此虚拟元素的真实节点el，将新节点添加到此真实节点前即可
        let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
        // 获取对应的虚拟节点，并生成真实节点，添加到 dom 中
        // el.appendChild(createElm(newChildren[i]))
        // 逻辑合并:将 appendChild 改为 insertBefore
        //  效果：既有appendChild又有insertBefore的功能，直接将参考节点放进来即可;
        //  解释：对于insertBefore方法,如果anchor为null，等同于appendChild;如果有值，则是insertBefore;
        el.insertBefore(createElm(newChildren[i]),anchor)
        }
    }

    // 2，老儿子比新儿子多，（以旧指针为参照）删除多余的真实节点
    if(oldStartIndex <= oldEndIndex){
        for(let i = oldStartIndex; i <= oldEndIndex; i++){
        let child = oldChildren[i];
        el.removeChild(child.el);
        }
    }

}

export function createElm(vnode) {
    let {tag, data, children, text, vm} = vnode;
    if(typeof tag === 'string'){
      vnode.el = document.createElement(tag)
      updateProperties(vnode, data) // 修改。。。
      children.forEach(child => {
        vnode.el.appendChild(createElm(child))
      });
    } else {
      vnode.el = document.createTextNode(text)
    }
    return vnode.el;
}
  
function updateProperties(vnode, oldProps = {} ) {
    let el = vnode.el;
    let newProps = vnode.data || {};

    let newStyly = newProps.style || {};  // 新样式对象
    let oldStyly = oldProps.style || {};  // 老样式对象

    // 老样式对象中有，新样式对象中没有，删掉多余样式
    for(let key in oldStyly){
        if(!newStyly[key]){
            el.style[key] = ''
        }
    }

    // 新样式对象中有，覆盖到老样式对象中
    for(let key in newProps){
        if(key == 'style'){ // 处理style样式
        for(let key in newStyly){
            el.style[key] = newStyly[key]
        }
        }else{
            el.setAttribute(key, newProps[key])
        }
    }

    for(let key in oldProps){
        if(!newProps[key]){
            el.removeAttribute(key)
        }
    }
}


