'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
const logger = require('../util/logger');
const queryIdPrefix = 'stats.';

// 통계 : 회원 전체 기준
router.get('/member', function (req, res, next) {
  let paramObject = req.paramObject;
  dbService
    .selectQueryById(queryIdPrefix + 'member', {
      companyId: paramObject.companyId
    })
    .then((result) => {
      res.send(result[0]);
    })
    .catch(errorRouteHandler(next));
});

// -신규 접수(newCount) : room 이 오늘 생성됬고 내가 담당자인 경우
// -대기중(readyCount) : 그냥 기본으로 0건(전체 대기건)
// -진행중(ingCount) : room의 담당이 나이고 state가 종료가 아닌 경우
// -종료건(closeCount) : 히스토리 테이블에서 종료일이 오늘이고 담당이 나인 경우
// -이탈건(outCount) : 그냥 기본으로 0건(전체 이탈건)
// -최장 고객 대기 시간(maxReadyMinute) :
// 방의 담당이 나이고 join 메시지 시작일시가 오늘 이고 조인 메시지보다 큰 것 중 시스템 메시지가 아니고 상담사가 작성한 메시지의 시간 - 조인 메시지의 시작일시 중 가장 큰 시간
// -최장 상담시간(maxSpeakMinute) : 히스토리의 종료시간과 조인 메시지의 시작일을 뺀 시간
// -평균 고객 대기 시간(avgReadyMinute) : 최장 고객 대기 시간의 함수를 avg로 바꿈
// -평균 상담시간(avgSpeakMinute)
// 통계 : 오늘의 나의 통계정보
router.get('/myToday', function (req, res) {
  let paramObject = req.paramObject;
  logger.info('myToday call : ' + paramObject);
  res.send({
    companyId: '1',
    newCount: 10,
    readyCount: 5,
    ingCount: 3,
    closeCount: 10,
    outCount: 0,
    maxReadyMinute: 125,
    maxSpeakMinute: 1,
    avgReadyMinute: 20,
    avgSpeakMinute: 5
  });
});

// 챗봇 이용 고객(chatbotUseCount)
// 채팅상담시스템 인입 고객(talkSystemEnterCount)
// 신규 접수(newCount)
// 대기중(readyCount)
// -진행중(ingCount)
// -종료건(closeCount)
// -이탈건(outCount)
// -총 상담건수(speakCount)
// -종료상담 건수(closeCount)
// -최장 고객 대기시간(maxReadyMinute)
// -최장 상담시간(maxSpeakMinute)
// -평균 고객 대기시간(avgReadyMinute)
// -평균 상담시간(avgSpeakMinute)
// -상담원 평균 응대 건수(avgMemberSpeakCount)
// -전일 대비 상담 증감(beforeDayPlusCount)
// 통계 : 기간 검색
router.get('/search', function (req, res) {
  // startDate, endDate
  let paramObject = req.paramObject;
  let startDate = paramObject.startDate;
  let endDate = paramObject.endDate;
  logger.info('search call : ' + paramObject);
  logger.info('startDate : ' + startDate);
  logger.info('endDate : ' + endDate);
  res.send({
    companyId: '1',
    chatbotUseCount: 0,
    talkSystemEnterCount: 10,
    newCount: 10,
    readyCount: 5,
    ingCount: 3,
    closeCount: 10,
    outCount: 0,
    speakCount: 10,
    maxReadyMinute: 125,
    maxSpeakMinute: 1,
    avgReadyMinute: 20,
    avgSpeakMinute: 5,
    avgMemberSpeakCount: 2,
    beforeDayPlusCount: 3
  });
});

// 신규 접수(newCount)
// -진행중(ingCount)
// -종료건(closeCount)
// -이탈건(outCount)
// -총 상담건수(speakCount)
// -종료상담 건수(closeCount)
// -최장 고객 대기시간(maxReadyMinute)
// -최장 상담시간(maxSpeakMinute)
// -평균 고객 대기시간(avgReadyMinute)
// -평균 상담시간(avgSpeakMinute)
// -상담원 평균 응대 건수(avgMemberSpeakCount)
// -전일 대비 상담 증감(beforeDayPlusCount)
// 통계 : 상담사별 분석
router.get('/customer-analysis', function (req, res) {
  // sort : todayClose, recentClose
  let paramObject = req.paramObject;
  let sort = paramObject.sort;
  logger.info('search call : ' + paramObject);
  logger.info('sort : ' + sort);
  res.send([
    {
      companyId: '1',
      memberId: 1,
      state: 1,
      memberName: '안용성',
      saveDate: '2020-11-01',
      newCount: 10,
      ingCount: 3,
      closeCount: 10,
      speakCount: 10,
      maxReadyMinute: 125,
      maxSpeakMinute: 1,
      avgReadyMinute: 20,
      avgSpeakMinute: 5,
      beforeDayPlusCount: 3,
      recentCloseCount: 10
    },
    {
      companyId: '1',
      memberId: 1,
      state: 1,
      memberName: '안용성2',
      saveDate: '2020-11-01',
      newCount: 10,
      ingCount: 3,
      closeCount: 10,
      speakCount: 10,
      maxReadyMinute: 125,
      maxSpeakMinute: 1,
      avgReadyMinute: 20,
      avgSpeakMinute: 5,
      beforeDayPlusCount: 3,
      recentCloseCount: 10
    }
  ]);
});

// 챗봇 이용 고객(chatbotUseCount)
// 채팅상담시스템 인입 고객(talkSystemEnterCount)
// 신규 접수(newCount)
// 대기중(readyCount)
// -진행중(ingCount)
// -종료건(closeCount)
// -이탈건(outCount)
// -총 상담건수(speakCount)
// -종료상담 건수(closeCount)
// -최장 고객 대기시간(maxReadyMinute)
// -최장 상담시간(maxSpeakMinute)
// -평균 고객 대기시간(avgReadyMinute)
// -평균 상담시간(avgSpeakMinute)
// -상담원 평균 응대 건수(avgMemberSpeakCount)
// 통계 : 상담 사용 추이
router.get('/use-history', function (req, res) {
  // type : day, month, year
  let paramObject = req.paramObject;
  let type = paramObject.type;
  logger.info('search call : ' + paramObject);
  logger.info('type : ' + type);
  res.send([
    {
      companyId: '1',
      saveDate: '2020-11-01',
      month: '2020-11',
      chatbotUseCount: 0,
      talkSystemEnterCount: 10,
      newCount: 10,
      readyCount: 5,
      ingCount: 3,
      closeCount: 10,
      outCount: 0,
      speakCount: 10,
      maxReadyMinute: 125,
      maxSpeakMinute: 1,
      avgReadyMinute: 20,
      avgSpeakMinute: 5,
      avgMemberSpeakCount: 2
    },
    {
      companyId: '1',
      saveDate: '2020-11-02',
      month: '2020-11',
      chatbotUseCount: 0,
      talkSystemEnterCount: 10,
      newCount: 10,
      readyCount: 5,
      ingCount: 3,
      closeCount: 10,
      outCount: 0,
      speakCount: 10,
      maxReadyMinute: 125,
      maxSpeakMinute: 1,
      avgReadyMinute: 20,
      avgSpeakMinute: 5,
      avgMemberSpeakCount: 2
    }
  ]);
});

// 통계 : 문의 유형별 통계
router.get('/hashtag', function (req, res) {
  // searchDate
  let paramObject = req.paramObject;
  let searchDate = paramObject.searchDate;
  logger.info('search call : ' + paramObject);
  logger.info('type : ' + searchDate);
  res.send([
    {
      companyId: '1',
      rank: 1,
      name: '요금',
      isNew: 0,
      beforeDayPlusCount: 5,
      beforeRank: 2
    },
    {
      companyId: '1',
      rank: 2,
      name: '납부',
      isNew: 1,
      beforeDayPlusCount: 5,
      beforeRank: 1
    }
  ]);
});

module.exports = router;
