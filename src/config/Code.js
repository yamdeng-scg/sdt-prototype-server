import Constant from './Constant';
import _ from 'lodash';

const Code = {};

// 룸 목록 조회 키워드 유형
Code.roomListSearcTypeCodeList = [
  { name: '고객명', value: 'customerName' },
  { name: '대화내용', value: 'messageText' },
  { name: '상담사', value: 'empName' }
];

Code.deleteBillSendMethodCodeList = [
  { name: '종이 청구서', value: '10' },
  { name: '이메일 청구서', value: '40' },
  { name: 'LMS 청구서', value: '70' }
];

Code.billSendMethodCodeList = [
  { name: '모바일 청구서 (추천)', value: '80' },
  { name: '종이 청구서', value: '10' },
  { name: '이메일 청구서', value: '40' },
  { name: 'LMS 청구서', value: '70' }
];

// 관계 select 정보 : 본인(default) / 배우자 / 부모 / 친적 / / 자녀 / 직장동료 / 기타 / 납부자 / 집주인 / 관리인 / 부동산 / 형제 / 자매 / 모니터링요원 / 관계없음
Code.relationSelectList = [
  { name: '본인', value: '10' },
  { name: '배우자', value: '11' },
  { name: '부모', value: '12' },
  { name: '자녀', value: '13' },
  { name: '친척', value: '14' },
  { name: '직장동료', value: '15' },
  { name: '기타', value: '16' },
  { name: '납부자', value: '17' },
  { name: '집주인', value: '18' },
  { name: '관리인', value: '19' },
  { name: '부동산', value: '20' },
  { name: '형제', value: '21' },
  { name: '자매', value: '22' },
  { name: '모니터링요원', value: '23' },
  { name: '관계없음', value: '99' }
];

// 이사로 인한 탈퇴 / 서비스사용 불편 / 기타
Code.leaveReasonSelectList = [
  { name: '이사로 인한 탈퇴' },
  { name: '서비스사용 불편' },
  { name: '기타' }
];

// 이메일 목록
Code.emailDomainList = [
  { name: 'naver.com', value: 'naver.com' },
  { name: 'hanmail.net', value: 'hanmail.com' },
  { name: 'nate.com', value: 'nate.com' },
  { name: 'gmail.com', value: 'gmail.com' },
  { name: 'lycos.co.kr', value: 'lycos.co.kr' },
  { name: 'yahoo.co.kr', value: 'yahoo.co.kr' },
  { name: 'yahoo.com', value: 'yahoo.com' },
  { name: 'empal.com', value: 'empal.com' },
  { name: 'dreamwiz.com', value: 'dreamwiz.com' },
  { name: 'paran.com', value: 'paran.com' },
  { name: 'korea.com', value: 'korea.com' },
  { name: 'chol.com', value: 'chol.com' },
  { name: 'hanmir.com', value: 'hanmir.com' },
  { name: 'hanafos.com', value: 'hanafos.com' },
  { name: 'freechal.com', value: 'freechal.com' },
  { name: 'hotmail.com', value: 'hotmail.com' },
  { name: 'netian.com', value: 'netian.com' },
  { name: '직접입력', value: '직접입력' }
];

//  [해지 이유(1:고객요청,2:계약해지,3:명의변경,4:전출요금계산)]
Code.cancelWhyCodeList = [
  { name: '고객요청', value: '1' },
  { name: '계약해지', value: '2' },
  { name: '명의변경', value: '3' },
  { name: '전출요금계산', value: '4' }
];

// TRANSFER_REMOVE	070301	가스사용기기 철거
// TRANSFER_CHANGE	070201	가스사용기기 교체
Code.transferDetailCodeList = [
  { name: '가스사용기기 철거', value: 'TRANSFER_REMOVE' },
  { name: '가스사용기기 교체', value: 'TRANSFER_CHANGE' }
];

// STOP_REBUILD	060203	공급중지 - 재건축
// STOP_REDEVELOP	060203	공급중지 - 재개발
// STOP_ETC	060301	공급중지 - 기타
Code.stopDetailCodeList = [
  { name: '재건축', value: 'STOP_REBUILD' },
  { name: '재개발', value: 'STOP_REDEVELOP' },
  { name: '기타', value: 'STOP_ETC' }
];

// 은행, 계좌번호 클립보드 복사 관련 code 목록
Code.bankAndAccountClipboardCodeList = [
  { name: '계좌번호 복사하기', value: '1' },
  { name: '은행이름 + 계좌번호 복사하기', value: '2' }
];

// 경감요청 신청 구분 code 목록
Code.weakDiscountCodeList = [
  { name: '생계급여', value: 'A0002' },
  { name: '의료급여', value: 'A0003' },
  { name: '주거급여', value: 'A0004' },
  { name: '교육급여', value: 'A0005' },
  { name: '장애인', value: 'B0001' }, //
  { name: '자활사업참여자', value: 'E0001' },
  { name: '본인부담경감자', value: 'E0002' },
  { name: '차상위장애인', value: 'E0003' },
  { name: '국가유공자', value: 'C0001' },
  { name: '5.18유공자', value: 'C0002' },
  { name: '독립유공자', value: 'D0001' },
  { name: '한부모가족', value: 'E0004' },
  { name: '차상위계층확인서 발급대상', value: 'E0005' },
  { name: '다자녀가구', value: 'F0001' }
];

// 국가 유공자 등급 code 목록
Code.troubleGradeCodeList = [
  { name: '1급', value: '001' },
  { name: '2급', value: '002' },
  { name: '3급', value: '003' }
];

// 디바이스 이미지 선택 방법
Code.deviceImageChoiceCodeList = [
  { name: '사진촬영', value: Constant.DEVICE_IMAGE_CHOICE_CAMERA },
  { name: '앨범', value: Constant.DEVICE_IMAGE_CHOICE_GALLREY }
];

// 소셜 유형 방법 선택
Code.socialTypeCodeList = [
  { name: '생년월일', value: Constant.SOCIAL_TYPE_BIRTHDATE },
  { name: '사업자번호', value: Constant.SOCIAL_TYPE_BUSINESS_NUMBER }
];

// 캐시아웃 인출 금액 선택
Code.cashOutMoneyCodeList = [
  {
    name: '10,000 원',
    value: 10000
  },
  {
    name: '20,000 원',
    value: 20000
  },
  {
    name: '30,000 원',
    value: 30000
  },
  {
    name: '40,000 원',
    value: 40000
  },
  {
    name: '50,000 원',
    value: 50000
  }
];

// 도시가스 계약번호 목록 필터 Code
Code.contractFilterCode = [
  { name: '전체', value: '' },
  { name: '주계약자', value: Constant.CONTRACT_FILTER_MAIN },
  { name: '패밀리', value: Constant.CONTRACT_FILTER_FAMILY }
];

// 계약번호 승인 거절 Code
Code.unapprovedReasonCode = [
  { name: '모르는 사람', value: '20' },
  { name: '기타', value: '40' }
];

// 번호 복사하기 code 목록
Code.normalPasteCodeList = [{ name: '복사하기', value: '1' }];

Code.getCodeNameByValue = function(codeCategory, codeValue) {
  let codeName = null;
  let codeList = Code[codeCategory] || [];
  let searchIndex = _.findIndex(codeList, codeInfo => {
    if (codeValue === codeInfo.value) {
      return true;
    } else {
      return false;
    }
  });
  if (searchIndex !== -1) {
    let findCodeInfo = codeList[searchIndex];
    codeName = findCodeInfo.name;
  }
  return codeName;
};

export default Code;
