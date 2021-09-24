export function compileToFunction(template) {
    // 1、将模板变成AST语法树
    let ast = parseHTML(template);
    // 2、使用AST生成render函数
    let code = generate(ast);
}

function parseHTML(template) {
    console.log('parserHTML-template :' + template);
}

function generate(ast) {
    console.log('parserHTML-ast :' + ast);
}