'use strict';

const Controller = require('egg').Controller;
const SuccessResponse = require('../../../utils/common/success_response');
const ErrorResponse = require('../../../utils/common/error_response');
const crc = require('node-crc');

class SliceController extends Controller {
    async submit() {
        const { ctx } = this;
        // 数据校验
        ctx.validate({ content: 'string', expires: 'number', token: 'string', poster: 'string?' });
        const poster = ctx.request.body.poster;
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
        // 验证码
        const verification = await this.service.recaptcha.verify(ctx.request.body.token);
        if (!verification) {
            return ErrorResponse(ctx, 400, '系统检测到您可能为机器人，提交失败');
        }
        // 计算内容Hash
        const key = crc.crc64(Buffer.from(`${content}_${new Date().getTime()}`, 'utf-8')).toString('hex');
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
        ctx.validate({ key: 'string' }, ctx.query);
        const key = ctx.query.key.trim();
        if (key.length !== 16) {
            return ErrorResponse(ctx, 422, '参数不合法');
        }
        // 检查存在
        const slice = await this.service.redis.get(`slice-${key}`);
        if (!slice) {
            return ErrorResponse(ctx, 404, '内容不存在或已过期');
        }
        SuccessResponse(ctx, '获取成功', slice);
    }
}

module.exports = SliceController;