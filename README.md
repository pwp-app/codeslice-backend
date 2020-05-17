<div align="center">
<img src="https://github.com/pwp-app/codeslice-frontend/blob/master/assets/codeslice.png?raw=true" width="96">
<h1>CodeSlice</h1>
</div>

# codeslice-server

该项目是CodeSlice的后端，基于egg.js编写。

后端没有接关系数据库，出于性能方面的考虑采用了一个比较暴力的方式，把所有的数据都堆放在Redis里面。

如果后续访问量比较大的话，会考虑加入一些类似于流控或者转移一部分数据到磁盘上的KV数据库。

## 命令

### 开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7701/
```

### 部署

```bash
$ npm start
$ npm stop
```

## 许可证

MIT