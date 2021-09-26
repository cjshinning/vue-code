// 标签名 a-aaa
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 命名空间标签 aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function compileToFunction(template) {
    // 1、将模板变成AST语法树
    let ast = parseHTML(template);
    // 2、使用AST生成render函数
    let code = generate(ast);
}

function parseHTML(html) {
    function advance(len) {
        html = html.substring(len);
    }

    // 开始标签
    function start(tagName, attrs) {
        console.log("start", tagName, attrs)
    }
    // 结束标签
    function end(tagName) {
        console.log("end", tagName)
    }
    // 文本标签
    function text(chars) {
        console.log("text", chars)
    }

    /**
     * 匹配开始标签,返回匹配结果
     */
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let end;
            let attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false;
    }

    while (html) {
        let index = html.indexOf('<');
        if (index == 0) {
            console.log("解析 html：" + html + ",结果：是标签")
            // 如果是标签，继续解析开始标签和属性
            const startTagMatch = parseStartTag();
            console.log("开始标签的匹配结果 startTagMatch = " + JSON.stringify(startTagMatch))

            if (startTagMatch) {
                // 匹配到开始标签，调用start方法，传递标签名和属性
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue; // 如果是开始标签，不需要继续向下走了，继续 while 解析后面的部分
            }

            // 如果开始标签没有匹配到，有可能是结束标签 </div>
            let endTagMatch;
            if (endTagMatch = html.match(endTag)) { // 匹配到了，说明是结束标签
                // 匹配到开始标签，调用start方法，传递标签名和属性
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue; // 如果是结束标签，不需要继续向下走了，继续 while 解析后面的部分
            }
        }

        if (index > 0) { // 文本
            // 将文本取出来并发射出去,再从 html 中拿掉
            let chars = html.substring(0, index) // hello</div>
            text(chars);
            advance(chars.length)
        }
    }
}

function generate(ast) {
    // console.log('parserHTML-ast :' + ast);
}