'use strict';

const dbService = require('../services/db');
const AppError = require('../errors/AppError');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const errorRouteHandler = require('../errors/routeHandler');
const convertUtil = require('../utils/convert');
const _ = require('lodash');

// address 한건 얻어오기
router.get('/:logical_identifier/:function_code/:address', function (req, res, next) {
    let selectQueryStr = 'select * from fast_db_' + req.params.logical_identifier + ' where address = ? and function_code = ?';
    dbService.selectQueryByStr(selectQueryStr, [req.params.address, req.params.function_code])
        .then((result) => {
            if(result.length > 0) {
                let addressInfo = result[0];
                addressInfo.value = convertUtil.bitStringtoInt(convertUtil.intToBitString(addressInfo.data_hi, 8) + convertUtil.intToBitString(addressInfo.data_lo, 8));
                res.send([addressInfo.value]);
            } else {
                return Promise.reject(new AppError('not found', [], 404));
            }
        }).catch(errorRouteHandler(next));
});

// address 멀티 얻어오기
router.get('/:logical_identifier/:function_code/:address/:quantity', function (req, res, next) {
    let selectQueryStr = 'select * from fast_db_' + req.params.logical_identifier + ' where function_code = ? and (address >= ? and address <= ?) order by address asc';
    // 종료 주소 그대로 사용할 경우 quantity 그대로, 갯수 일 경우에는 address + ququantity
    // let limitAddress = req.params.address + req.params.ququantity;
    // let limitAddress = req.params.quantity;
    let limitAddress = Number(req.params.address) + Number(req.params.quantity) - 1;
    dbService.selectQueryByStr(selectQueryStr, [req.params.function_code, req.params.address, limitAddress])
        .then((result) => {
            if(result.length > 0) {
                result.forEach(addressInfo => {
                    addressInfo.value = convertUtil.bitStringtoInt(convertUtil.intToBitString(addressInfo.data_hi, 8) + convertUtil.intToBitString(addressInfo.data_lo, 8));
                });
                res.send(_.map(result, 'value'));
            } else {
                return Promise.reject(new AppError('not found', [], 404));
            }
        }).catch(errorRouteHandler(next));
});

module.exports = router;