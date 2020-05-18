'use strict';

const Service = require('egg').Service;
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const keys = require('../../config/keys');

const VERIFY_URL = 'https://www.recaptcha.net/recaptcha/api/siteverify';

class RecaptchaService extends Service {
    async verify(token) {
        if (!token) {
            return false;
        }
        const params = new URLSearchParams();
        params.append('secret', keys.recaptcha);
        params.append('response', token);
        const response = await fetch(VERIFY_URL, {
            method: 'POST',
            body: params,
        });
        const result = await response.json();
        if (!result.success) {
            return false;
        }
        if (result.score < 0.8) {
            return false;
        }
        return true;
    }
}

module.exports = RecaptchaService;