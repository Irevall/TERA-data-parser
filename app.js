const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Serve = require('koa-static');
const router = require('./router/');

const app = new Koa();

app.use(bodyParser());
app.use(Serve('./public'));
app.use(router.routes());

app.listen(8999, () => {
    console.log('Server running on https://localhost:8999')
});