## 核心
webpack5 源码阅读
插件 loader ast ....===》webpack 打包流程
1. webpack 打包流程（）
2. compiler 与 compilation 区别和联系
3. 手写简易版的打包器（ast）
4. loader(ast)
5. plugin

### webpack 入口
1. 执行 npm run build / npm run server --->最找找到了 webpack/bin/webpack.js
2. 上述的文件里其实就是判断 webpack-cli 是否安装，如果安装了则加载 webpack-cli/bin/cli.js 

### 启动编译
1. Compiler 和 Compilation都继承自Tapable
2. Compiler是每个Webpack配置对应一个Compiler对象，记录着Webpack的生命周期
3. 在构建过程中，每次构建都会产生一个Compilation，是构建周期的产物
4. Compiler模块是Webpack最核心的模块
5. 每次执行构建的时候，都会先实例化一个Compiler对象，然后调用它的 run 方法来开启一次完整的编译

### Stats 对象
1. 在Webpack的回调函数中会得到stats对象
<!-- npx webpack --profile --json > stats.json 命令生成stats对象的内容 -->
2. 实际来源于Compilation.getStats(), 返回内容主要包含 modules(记录了所有解析后的模块) chunks(记录了所有chunk) 和 assets(记录了所有要生成的文件,webpack-bundle-analyzer(性能)插件就居于这个对象生成)三个属性值的对象
3. Stats对象本质上来自于lib/Stats.js的类实例

### 概念
### modules
会更加以来关系生成chunk
1. 每个入库文件天然就是一个chunk,此入库文件和以来的模块生成一个春困
2. 如果说某个模块里有动态引入预计import语句,会有import单独生成一个新的代码块,这个代码块里放置这个动态引入的模块以及这个动态引入的模块依赖的模块
3. splitchunks,实现同步的代码分割,把多个代码里共同的模块提取成一个单独的代码块,还可以把某些模块,比如说node_modules里的模块单独提出来成立一个代码块.

### 主要工作流程
Webpack的运行流程是一个串行的过程，从启动到结束会一次执行以下流程：
1. 初始化参数：从配置文件和shell语句中读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的润方法开始执行便有；确定入口：根据配置中的entry找出所有的入口文件
3. 编译模块：从入口文件出发，调用所有配置的Loader对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
4. 完成模块编译：经过第4步使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
5. 输出资源：根据入口和模块之间的依赖关系，组装完成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
6. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
7. 在以上过程中，Webpack会在特定的时间点广播出特定事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变Webpack的运行结果