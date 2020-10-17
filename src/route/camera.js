'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../services/db');
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);
const errorRouteHandler = require('../errors/routeHandler');

// 월 차트 정보
router.get('/:channel_number/monthChart', function (req, res, next) {
    const start = req.query.start;
    const end = req.query.end;
    dbService.selectQueryById('cameraMonthChart', [start, end, req.params.channel_number])
        .then((data) => {
            res.send(data);
        }).catch(errorRouteHandler(next));
});

// 주 차트 정보
router.get('/:channel_number/weekChart', function (req, res, next) {
    const start = req.query.start;
    const end = req.query.end;
    dbService.selectQueryById('cameraWeekChart', [start, end, req.params.channel_number])
        .then((data) => {
            res.send(data);
        }).catch(errorRouteHandler(next));
});

// 일 차트 정보
router.get('/:channel_number/dayChart', function (req, res, next) {
    const start = req.query.start;
    const end = req.query.end;
    dbService.selectQueryById('cameraDayChart', [start, end, req.params.channel_number])
        .then((data) => {
            res.send(data);
        }).catch(errorRouteHandler(next));
});

module.exports = router;