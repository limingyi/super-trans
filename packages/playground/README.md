# @super-trans/playground

## 简介
功能演示工程，提供Web界面验证转换流程，支持输入Swagger JSON或TS代码并实时预览转换结果（如Swagger转表单配置、TS声明转Markdown文档）。

## 功能特性
- 多转换器切换：支持`@super-trans/trans-swagger`和`@super-trans/trans-ts2md`
- 实时预览：输入源数据后立即展示转换结果
- 交互友好：提供输入编辑框、结果对比视图和转换器切换按钮

## 启动开发环境
```bash
cd packages/playground
npm run dev
```

## 使用说明
1. 启动服务后访问`http://localhost:5173`
2. 选择目标转换器（Swagger转表单/TS转Markdown）
3. 在输入框中粘贴Swagger JSON或TS代码
4. 实时查看右侧转换结果预览
5. 支持导出结果到本地文件

## 示例截图
![预览界面](https://via.placeholder.com/800x400?text=Playground+Preview+Interface)

（注：实际项目中应替换为真实截图路径）