'use strict';

const express = require('express');
const router = express.Router();
const AppError = require('../error/AppError');
const moment = require('moment');

let employeeList = [
  {
    id: 'csmaster1',
    companyName: 'SCG솔루션즈(주)',
    name: '이세임',
    deptCode: '200552',
    deptName: '경기1직영',
    posName: '사원',
    userStatus: 'Y',
    telephone: '02-552-7777',
    handphone: '010-1111-4062',
    innerTelephone: '02-3660-1111'
  },
  {
    id: 'yamdeng1',
    companyName: 'SCG솔루션즈(주)',
    name: '안용성',
    deptCode: '200552',
    deptName: '경기1직영',
    posName: '사원',
    userStatus: 'Y',
    telephone: '02-552-7777',
    handphone: '010-1111-4062',
    innerTelephone: '02-3660-1111'
  }
];

let contractInfo = {
  contractInfo: {
    useContractNum: '6000000486',
    customerName: '김태수',
    centerCode: '32',
    centerName: '강북2고객센터',
    centerPhone: '02-701-0337',
    meterNum: '300000486',
    gmtrBaseDay: '26',
    billSendMethod: '모바일',
    paymentType: '은행이체',
    contractStatus: '정상',
    productName: '업무난방용',
    handphone: '010-9702-6654',
    meterReplaceDate: '2017-03-20',
    address: {
      address2: '851, 제7789부대 방패기계실 (남현동)',
      address1: '서울특별시 관악구 과천대로'
    },
    maskingAddress: {
      address2: '****, 제7789부대 방패기계실 (***)',
      address1: '서울특별시 관악구 ****'
    },
    safeCheck: {
      sendDate: '2020-08-07',
      checkResult: '적합',
      notPassDetail: null
    }
  },
  history: [
    {
      requestYm: '2019-12',
      deadlineFlag: '20'
    },
    {
      requestYm: '2019-11',
      deadlineFlag: '20'
    }
  ]
};

let payInfo = {
  useContractNum: '6000000486',
  requestYm: '201911',
  deadlineFlag: '20',
  paymentDeadline: '20191120',
  basicRate: 0.0,
  useRate: 0.0,
  discountAmt: 0.0,
  replacementCost: 0.0,
  vat: 0.0,
  adjustmentAmt: 0.0,
  cutAmt: 0.0,
  chargeAmt: 0.0,
  usageQty: 0,
  unpayAmt: 0.0,
  allUnpayAmounts: 0.0,
  allPayAmounts: 0.0,
  previousUnpayAmounts: 0.0,
  payMethod: '자동이체(은행)',
  virtualAccount: {
    accountName: '이원준',
    accounts: [
      {
        bankCode: '020',
        name: '우리은행(은행)',
        account: '29800105-218194'
      },
      {
        bankCode: '003',
        name: '기업은행(은행)',
        account: '59503752-997969'
      }
    ]
  },
  previousUnpayInfos: [
    {
      requestYm: '201709',
      unpayAmtAll: 2700
    }
  ]
};

let contracts = [
  {
    useContractNum: '6000000486',
    main: 1,
    alias: '우리집',
    address: {
      address2: '851, 제7789부대 방패기계실 (남현동)',
      address1: '서울특별시 관악구 과천대로'
    },
    maskingAddress: {
      address2: '****, 제7789부대 방패기계실 (***)',
      address1: '서울특별시 관악구 ****'
    }
  },
  {
    useContractNum: '6000000502',
    main: 0,
    alias: '장모님',
    address: {
      address2: '851, 제7789부대 방패기계실 (남현동)',
      address1: '서울특별시 관악구 과천대로'
    },
    maskingAddress: {
      address2: '****, 제7789부대 방패기계실 (***)',
      address1: '서울특별시 관악구 ****'
    }
  }
];

// 로그인
router.post('/employees/login', function (req, res) {
  let paramObject = req.paramObject;
  let { id, password } = paramObject;
  console.log('id : ' + id + ' @ password : ' + password);
  if (id === 'yamdeng21') {
    throw new AppError('존재하지 않는 사번입니다.', [], 421);
  } else if (id === 'yamdeng22') {
    throw new AppError('존재하지 않는 사번입니다.', [], 422);
  } else if (id === 'yamdeng50') {
    throw new AppError('존재하지 않는 사번입니다.', [], 500);
  } else {
    res.send({ success: true });
  }
});

// 직원 목록
router.get('/employees', function (req, res) {
  res.send(employeeList);
});

// 직원 개별 정보
router.get('/employees/:id', function (req, res) {
  let id = req.params.id;
  console.log('id : ' + id);
  res.send({
    id: id,
    companyName: 'SCG솔루션즈(주)',
    name: '이세임',
    deptCode: '200552',
    deptName: '경기1직영',
    posName: '사원',
    userStatus: 'Y',
    telephone: '02-552-7777',
    handphone: '010-1111-4062',
    innerTelephone: '02-3660-1111'
  });
});

// 민원 등록
router.post('/minwon', function (req, res) {
  let body = req.body;
  console.log('minwon : ' + JSON.stringify(body));
  res.send({ id: '10' });
});

// 사용계약정보 상세
router.get('/contract/:useContractNum', function (req, res) {
  let useContractNum = req.params.useContractNum;
  console.log('useContractNum : ' + useContractNum);
  res.send(contractInfo);
});

// 사용계약번호 결제 상세 정보
router.get('/contract/:useContractNum/bill', function (req, res) {
  let paramObject = req.paramObject;
  let useContractNum = req.params.useContractNum;
  let { requestYm, deadlineFlag } = paramObject;
  console.log(
    'useContractNum : ' +
      useContractNum +
      ' @ requestYm : ' +
      requestYm +
      ' @ deadlineFlag : ' +
      deadlineFlag
  );
  res.send(payInfo);
});

// 휴일 여부 체크
router.get('/isHoliday', function (req, res) {
  let paramObject = req.paramObject;
  let { date } = paramObject;
  console.log('date : ' + date);
  let day = moment(date, 'YYYY-MM-DD').format('d');
  let isHoliday = false;
  if (day === '6' || day === '0') {
    isHoliday = true;
  }
  res.send({ isHoliday: isHoliday });
});

// 고객의 계약정보 목록
router.get('/contracts', function (req, res) {
  let paramObject = req.paramObject;
  let { member } = paramObject;
  console.log('member : ' + member);
  res.send(contracts);
});

// 고객의 프로필 정보
router.get('/profile', function (req, res) {
  let paramObject = req.paramObject;
  let { member } = paramObject;
  console.log('member : ' + member);
  res.send({
    name: '이유진',
    handphone: '01044588856',
    cash: 5000
  });
});

// 푸쉬 전송
router.post('/push', function (req, res) {
  let paramObject = req.paramObject;
  let { member, message } = paramObject;
  console.log('member : ' + member + ' @ message : ' + message);
  res.send({
    success: true
  });
});

module.exports = router;
