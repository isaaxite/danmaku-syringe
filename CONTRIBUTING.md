Commit 规范

使用 Angular 规范。

## Angular 规范

Angular 规范要求每个 commit message 都包含三个部分：Header、Body 和 Footer。其中，Header 包含一个必填字段和一个可选字段，必填字段为 Type，可选字段为 Scope。Body 和 Footer 都是可选的，用于提供更详细的信息。

**Type 字段包含以下值：**

- `feat`：新功能
- `fix`：修复问题
- `docs`：文档修改
- `style`：代码格式修改，不影响代码逻辑
- `refactor`：重构代码，既不修复错误也不添加功能
- `perf`：性能优化
- `test`：添加或修改测试代码
- `build`：构建系统或外部依赖项修改
- `ci`：持续集成修改
- `chore`：其他修改，如修改构建流程或辅助工具等
- `revert`：回滚到之前的提交

**Angular 规范的格式为：**

```shell
<type>[(scope)]: <subject>

[body]

[footer]

# e.g.
# slim
feat: add user management module

# fully
feat(users): add user management module

This commit adds the user management module to the project.

Closes #123
```
其中，`<type>` 表示 commit 的类型，`[scope]` 表示 commit 的影响范围，`<subject>` 表示 commit 的简短描述，`[body]` 表示 commit 的详细描述，`<footer>` 表示 commit 的元信息，如关闭 issue、引入变更等。