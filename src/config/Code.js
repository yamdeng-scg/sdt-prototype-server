import Constant from './Constant';
import _ from 'lodash';

const Code = {};

// 룸 목록 조회 키워드 유형
Code.roomListSearcTypeCodeList = [
  { name: '고객명', value: 'customerName' },
  { name: '대화내용', value: 'messageText' },
  { name: '상담사', value: 'empName' }
];

// state: 회원 상태
//  -0 : 정상
//  -1 : 휴식
//  -2 : 회의
//  -3 : 콜집중
//  -5 : 퇴근
//  -9 : 기타

Code.memberStateCodeList = [
  { name: '상담중', value: 0 },
  { name: '휴식중', value: 1 },
  { name: '회의중', value: 2 },
  { name: '콜집중', value: 3 },
  { name: '퇴근', value: 5 },
  { name: '기타', value: 9 }
];

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
