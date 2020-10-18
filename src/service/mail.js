'use strict';

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config/config');
const service = {};
const mailConfig = config.MAIL_INFO;

let smtpOption = {
  host: mailConfig.smtpHost,
  port: mailConfig.smtpPort,
  auth: {
    user: mailConfig.smtpLoginId,
    pass: mailConfig.smtpLoginPassword
  }
};

let transporter = nodemailer.createTransport(smtpTransport(smtpOption));

service.sendMail = function (mailOption) {
  return new Promise((resolve, reject) => {
    if (config.useMail) {
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
