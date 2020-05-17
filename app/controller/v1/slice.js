'use strict';

const Controller = require('egg').Controller;
const SuccessResponse = require('../../../utils/common/success_response');
const ErrorResponse = require('../../../utils/common/error_response');
const crypto = require('crypto');

class SliceController extends Controller {
    async submit() {
        const { ctx } = this;
        // 数据校验
        ctx.validate({ content: 'string', expires: 'number', poster: 'string?' });
        const poster = ctx.request.body.author;
        if (poster && poster.length > 30) {
            return ErrorResponse(ctx, 422, '署名不得超过30个字符');
        }
        const expires = ctx.request.body.expires;
        if (expires < 300 || expires > 86400) {
            return ErrorResponse(ctx, 422, '过期时间不属于合法范围');
        }
        const content = ctx.request.body.content.trim();
        if (content.length < 1 || content.length > 30000) {
            return ErrorResponse(ctx, 422, '内容长度不属于合法范围');
        }
        const sha1 = crypto.createHmac('sha1', 'CodeSlice');
        const key = sha1.update(`${Math.random()}_${new Date().getTime()}_${content}`).digest('hex');
        // 提交至redis
        if (await this.service.redis.set(`slice-${key}`, {
            poster: poster ? poster : null,
            createTime: new Date().getTime(),
            expires,
            content,
        })) {
            SuccessResponse(ctx, '分享成功', key);
        } else {
            ErrorResponse(ctx, 500, '分享失败');
        }
    }
    async get() {
        const { ctx } = this;
        ctx.validate({ key: 'string' });
        const key = ctx.query.key.trim();
        if (key.length !== 40) {
            return ErrorResponse(ctx, 422, '参数不合法');
        }
        // 检查存在
        if (!await this.service.redis.has(key)) {
            return ErrorResponse(ctx, 404, '内容不存在');
        }
        // 获取内容
        const slice = await this.service.redis.get(`slice-${key}`);
        if (!slice) {
            return ErrorResponse(ctx, 500, '获取失败');
        }
        SuccessResponse(ctx, '获取成功', slice);
    }
}

module.exports = SliceController;