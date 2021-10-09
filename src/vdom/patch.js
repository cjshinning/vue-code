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

export function createElm(vnode) {
    let{tag, data, children, text, vm} = vnode;
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


