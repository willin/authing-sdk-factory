# 开发指引

1. 安装依赖：`yarn`
2. build 产物：`yarn generate`
3. 调试：`node generate-sdk.js`

> 可以在 vscode 里面打断点，进行调试

```javascript
const { generate } = require('./dist');

const main = async () => {
    await generate({
        input: 'http://localhost:3888/openapi-json',
        output: './example',
    });
};

main().then(console.log).catch(console.error);
```
