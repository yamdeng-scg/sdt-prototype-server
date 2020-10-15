const ReactUtil = {
  convertEnterStringToBrTag(value) {
    // 개행 분자를 <br/> 태그로 변환
    return value.replace(/\n/g, '<br/>');
  }
};

export default ReactUtil;
