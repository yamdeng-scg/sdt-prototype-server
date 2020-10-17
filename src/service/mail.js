'use strict';

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const CONFIG = require('../config');
const service = {};
const mailConfig = CONFIG.MAIL_INFO;

let smtpOption = {
    host: mailConfig.smtpHost,
    port: mailConfig.smtpPort,
    auth: {
        user: mailConfig.smtpLoginId,
        pass: mailConfig.smtpLoginPassword
    }
};

let transporter = nodemailer.createTransport(smtpTransport(smtpOption));

service.sendMail = function(mailOption) {
    return new Promise((resolve, reject) => {
        if(CONFIG.USE_MAIL) {
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        } else {
            resolve(true);
        }
    });
};

module.exports = service;