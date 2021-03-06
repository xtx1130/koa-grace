'use strict';

import http from 'http'
import Koa from 'koa'
import proxy from '../../proxy/index'
import secure from '../index'

const app = new Koa()

app.use(proxy(app, {
  test: 'http://127.0.0.1:3001/'
}))

app.use(secure())

app.use(async(ctx, next) => {
  if (ctx.path !== '/post') {
    await ctx.proxy('test:post:/post?grace_token=' + ctx.cookies.get('grace_token'));
  } else {
    ctx.body = 'hello world!'
  }

  await next();
});

module.exports = http.createServer(app.callback());
