import { parserHTML } from "./parser";
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 将 attrs 数组格式化为：{key=val,key=val,}
function genProps(attrs){
    let str = '';
    for(let i = 0;i < attrs.length;i++){
        let attr = attrs[i];
        // 将样式处理为对象 {name:id, value:'app'}
        if(attr.name == 'style'){
            let styles = {};
            attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
                styles[arguments[1]] = arguments[2];
            }) 
            attr.value = styles;
        }
        // 使用 JSON.stringify 将 value 转为 string 类型
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`;    //// 去掉最后一位多余的逗号，再在外边套上{}
}

function gen(el){
    console.log("===== gen ===== el = ",el);
    if(el.type == 1){
        console.log("元素标签 tag = "+el.tag+"，generate继续递归处理");
        return generate(el);    //递归处理当前元素
    }else{
        let text = el.text
    console.log("文本类型,text = " + text)
    if(!defaultTagRE.test(text)){
      return `_v('${text}')`  // 普通文本，包装_v
    }else{
        // 存在{{}}表达式，需进行表达式 和 普通值的拼接 
        // 目标：['aaa',_s(name),'bbb'].join('+') ==> _v('aaa' + s_(name) + 'bbb')
        let lastIndex = defaultTagRE.lastIndex = 0;
        let tokens = []; // <div>aaa {{name}} bbb</div>
        let match
        while(match = defaultTagRE.exec(text)){
            console.log("匹配内容" + text)
            let index = match.index;// match.index：指当前捕获到的位置
            console.log("当前的 lastIndex = " + lastIndex)
            console.log("匹配的 match.index = " + index)
            if(index > lastIndex){  // 将前一段 ’<div>aaa '中的 aaa 放入 tokens 中
            let preText = text.slice(lastIndex, index)
            console.log("匹配到表达式-找到表达式开始前的部分：" + preText)
            tokens.push(JSON.stringify(preText))// 利用 JSON.stringify 加双引号
            }

            console.log("匹配到表达式：" + match[1].trim())
            // 放入 match 到的表达式，如{{ name  }}（match[1]是花括号中间的部分，并处理可能存在的换行或回车）
            tokens.push(`_s(${match[1].trim()})`)
            // 更新 lastIndex 长度到'<div>aaa {{name}}'
            lastIndex = index + match[0].length;  // 更新 lastIndex 长度到'<div>aaa {{name}}'
        }

        // while 循环后可能还剩余一段，如：’ bbb</div>’，需要将 bbb 放到 tokens 中
        if(lastIndex < text.length){
            let lastText = text.slice(lastIndex);
            console.log("表达式处理完成后，还有内容需要继续处理："+lastText)
            tokens.push(JSON.stringify(lastText))// 从 lastIndex 到最后
        }
        
        return `_v(${tokens.join('+')})`
        }
    }
}

function genChildren(el){
    console.log("===== genChildren =====");
    let children = el.children;
    if(children){
        console.log("存在 children, 开始遍历处理子节点．．．", children);
        let result = children.map(item => gen(item)).join(',');
        console.log("子节点处理完成，result = " + JSON.stringify(result))
        return result;
    }
    console.log("不存在 children, 直接返回 false");
    return false;
}

function generate(ast) {
    let children = genChildren(ast);
    let code = `_c('${ast.tag}',${
        ast.attrs.length ? genProps(ast.attrs) : 'undefined'
    }${
        ast.children ? `,${children}` : ''
    })`;
    return code;
}

export function compileToFunction(template) {
    // 1、将模板变成AST语法树
    let ast = parserHTML(template);
    // debugger;
    // 2、使用AST生成render函数
    let code = generate(ast);
    console.log(code);
}
