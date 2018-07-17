const Router = require('koa-router');
const router = new Router();

const controllers = require('../controllers');

router.get('/', async (ctx) => {
    const answer = await controllers.createHTML();
    ctx.response.status = answer.status;
    ctx.response.message = answer.message;
    ctx.body = answer.body;
});

router.post('/members', async (ctx) => {
    const answer = await controllers.membersToDB(ctx.request.body);
    ctx.response.status = answer.status;
    ctx.response.message = answer.message;
});

router.post('/alts', async (ctx) => {
    const answer = await controllers.altsToDB(ctx.request.body);
    ctx.response.status = answer.status;
    ctx.response.message = answer.message;
});

router.put('/:id/:column/:data', async (ctx) => {
    const answer = await controllers.updateMisc(ctx.params);
    ctx.response.status = answer.status;
    ctx.response.message = answer.message;
});

module.exports = router;