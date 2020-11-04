'use strict';

const express = require('express');
const router = express.Router();
const dbService = require('../service/db');
const errorRouteHandler = require('../error/routeHandler');
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

// 나의 통계정보 오늘 /stats/myToday

// 기간 통계 /stats/search : startDate, endDate

// 상담사별 분석 /stats/customer-analysis : sort(todayClose, recentClose)

// 상담 사용 추이 : /stats/use-history : type(day, month, year)

// 문의 유형별 통계 : /stats/hashtag : searchDate

// #.나의 통계정보 오늘 : /stats/myToday
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

// #.기간 통계 : /stats/search : startDate, endDate
// -챗봇 이용 고객(chatbotUseCount)
// -채팅상담시스템 인입 고객(talkSystemEnterCount)

// -신규 접수(newCount)
// -대기중(readyCount)
// -진행중(ingCount)
// -종료건(closeCount)
// -이탈건(outCount)

// -총 상담건수(speakCount)
// -종료상담 건수(closeCount)
// -상담원 평균 응대 건수(avgMemberSpeakCount)
// -전일 대비 상담 증감(beforeDayPlusCount)

// -최장 고객 대기시간(maxReadyMinute)
// -최장 상담시간(maxSpeakMinute)
// -평균 고객 대기시간(avgReadyMinute)
// -평균 상담시간(avgSpeakMinute)

// #.상담사별 분석 : /stats/customer-analysis : sort(todayClose, recentClose)
// -회원 id, 이름, 상태, 진행중, 종료건, 전일 대비 증감, 최근 7일 종료건
// -member_id, name, state, ingCount, closeCount, beforeDayPlusCount, recentCloseCount

// #.상담 사용 추이 : /stats/use-history : type(day, month, year)
// -일, 월, 년(년일 경우 월 변경으로 분류) : 오늘 날짜 기준으로 7일, 한달, 1년(day, month, year)
// -일단위, 월단위(평균)
// -[
//  {date, newCount, closeCount, outCount}
// ]

// #.문의 유형별 통계 : /stats/hashtag : searchDate
// -순위, 이름, 신규, 전일 대비 건수
// -rank, name, isNew, beforeDayPlusCount

module.exports = router;
