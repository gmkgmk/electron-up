//server相关
const Koa = require("koa");
const app = new Koa();
const koaStatic = require("koa-static");
const path = require("path");
const fs = require("fs");
const PORT = 80;
let getBaseUrl = "http://localhost:8080";
app.use(koaStatic(path.join(__dirname, "dist")));

const init = async ctx => {

};

app.use(init);
app.listen(PORT, () => console.log("running on port " + PORT));
