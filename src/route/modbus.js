'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const errorRouteHandler = require('../errors/routeHandler');
const modbusService = require('../services/modbus');

// modbus 한건 얻어오기
router.get('/:logical_identifier/:function_code/:address', function (req, res, next) {
    modbusService.getAddress(req.params.logical_identifier, req.params.function_code, req.params.address)
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// modbus 멀티 얻어오기
router.get('/:logical_identifier/:function_code/:address/:quantity', function (req, res, next) {
    modbusService.getAddress(req.params.logical_identifier, req.params.function_code, req.params.address, req.params.quantity)
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// 오실로스코프 차트 정보
router.get('/:logical_identifier/chart/realwave', function (req, res, next) {
    modbusService.getRealwave(req.params.logical_identifier)
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

// 하모니 차트 정보
router.get('/:logical_identifier/chart/hamonic', function (req, res, next) {
    modbusService.getHamonic(req.params.logical_identifier)
        .then((result) => {
            res.send(result);
        }).catch(errorRouteHandler(next));
});

module.exports = router;