const Router = require('koa-router');
const router = new Router();

const controllers = require('../controllers');

router.get('/', async (ctx) => {
    ctx.body = await controllers.createHTML();
});

router.post('/members', async (ctx) => {
    controllers.membersToDB(ctx.request.body);
});

router.post('/alts', async (ctx) => {
    controllers.altsToDB(ctx.request.body);
});

router.put('/:id/:column/:data', async (ctx) => {
    const answer = await controllers.updateMisc(ctx.params);
    ctx.response.status = answer.status;
    ctx.response.message = answer.message;
});

module.exports = router;