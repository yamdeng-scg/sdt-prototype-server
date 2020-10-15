import { observable, action, toJS } from 'mobx';
import update from 'immutability-helper';
import ApiService from '../services/ApiService';
import Constant from '../config/Constant';
import Config from '../config/Config';
import Helper from '../utils/Helper';
import _ from 'lodash';
import ModalService from '../services/ModalService';

/*


  formData.memberId = {
    inputName: 'memberId',
    touched: false,
    isRequired: true,
    isValid: true,
    errorMessage: '',
    value: '',
    byPassValid : false,
    notRequiredMessage: '',
    notPatternMessage: '',w
    isNumber: true,
    maxLength: 10,
    minLength: 5,
    max: 1000,
    min: 10,
    pattern: '',
    apiParamExpect: true,
    isKeyCheck: true,
    keyName: 'clubCode'
    checkSameFiled: 'password',
    notSameMessage: '입력한 비밀번호가 서로 틀립니다'
  }


*/

// 공통 store
class CommonStore {
  // 검색 데이터
  @observable list = [];

  // 현재 페이지
  @observable
  currentPage = 1;

  // 목록의 총 갯수
  @observable
  totalCount = '';

  // 이전 페이지(그룹)
  @observable
  prevPage = null;

  // 다음 페이지(그룹)
  @observable
  nextPage = null;

  // 페이지 정보
  @observable
  displayPageInfos = [];

  // 목록 정렬정보
  @observable
  sortInfo = null;

  // page 사이즈
  @observable
  pageSize = Config.defaultPageSize;

  // 폼 data
  @observable formData = null;

  // 폼 유형 : add / edit
  @observable formType = Constant.FORM_TYPE_NEW;

  // detailId
  @observable detailId = null;

  // 검색 input 키워드
  @observable
  keyword = '';

  // 선택된 정렬 정보
  @observable
  sort = '';

  // 검색 유형
  @observable
  searchKind = '';

  // 상세 정보
  @observable
  detailInfo = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  // form 유형 변경
  @action
  changeFormType(formType) {
    this.formType = formType;
  }

  // 상세 id 변경 : 수정 form 전송시 사용
  @action
  changeDetailId(detailId) {
    this.detailId = detailId;
  }

  // 목록 페이징 사이즈 변경
  @action
  changePageSize(pageSize) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.search(true);
  }

  // 현재 페이지 변경
  @action
  changeCurrentPage(currentPage) {
    this.currentPage = currentPage;
    this.search(false);
    Helper.scrollTopByWindow(100);
  }

  // 목록 첫페이지로 이동
  @action
  goFirstPage() {
    if (this.prevPage) {
      this.changeCurrentPage(1);
    }
  }

  // 목록 마지막 페이지로 이동
  @action
  goLastPage() {
    if (this.nextPage) {
      this.changeCurrentPage(Math.ceil(this.totalCount / this.pageSize));
    }
  }

  // byPassValid 값 변경
  @action
  changeByPassValid(inputName, byPassValid) {
    let beforeFormData = toJS(this.formData);
    let inputData = beforeFormData[inputName];
    let updateInputData = update(inputData, {
      $merge: {
        isValid: true,
        byPassValid: byPassValid
      }
    });
    let updateFormData = update(beforeFormData, {
      $merge: {
        [inputName]: updateInputData
      }
    });
    this.formData = updateFormData;
  }

  // valide success로 변경
  @action
  successValid(inputName) {
    let beforeFormData = toJS(this.formData);
    let inputData = beforeFormData[inputName];
    let updateInputData = update(inputData, {
      $merge: {
        isValid: true
      }
    });
    let updateFormData = update(beforeFormData, {
      $merge: {
        [inputName]: updateInputData
      }
    });
    this.formData = updateFormData;
  }

  // errorMessage 수동적으로 반영(멀티)
  @action
  changeInputErrorMessageArray(
    errorInfoArray,
    beforeValidateSuccess,
    scrollTopElementId
  ) {
    let updateFormData = toJS(this.formData);
    if (errorInfoArray.length) {
      let firstErrorInputData = null;
      errorInfoArray.forEach((errorInfo) => {
        let inputName = errorInfo.name;
        let errorMessage = errorInfo.errorMessage;
        let inputData = updateFormData[inputName];
        let updateInputData = update(inputData, {
          $merge: {
            errorMessage: errorMessage,
            isValid: false,
            byPassValid: false
          }
        });
        if (!firstErrorInputData) {
          firstErrorInputData = updateInputData;
        }
        updateFormData = update(updateFormData, {
          $merge: {
            [inputName]: updateInputData
          }
        });
      });
      if (firstErrorInputData) {
        try {
          if (beforeValidateSuccess && $('#' + firstErrorInputData.inputName)) {
            $('#' + firstErrorInputData.inputName).focus();
          }
        } catch (e) {
          alert('changeInputErrorMessageArray : focus error');
        }
      }
    }
    this.formData = updateFormData;
  }

  // errorMessage 수동적으로 반영
  @action
  changeInputErrorMessage(inputName, errorMessage) {
    let beforeFormData = toJS(this.formData);
    let inputData = beforeFormData[inputName];
    let updateInputData = update(inputData, {
      $merge: {
        errorMessage: errorMessage,
        isValid: false,
        byPassValid: false
      }
    });
    let updateFormData = update(beforeFormData, {
      $merge: {
        [inputName]: updateInputData
      }
    });
    this.formData = updateFormData;
  }

  // input focus 벗어났을때
  onBlur(inputName) {
    let beforeFormData = toJS(this.formData);
    let inputData = beforeFormData[inputName];
    inputData.touched = true;
    let validResult = Helper.checkValidation(inputData, '', beforeFormData);
    let updateInputData = update(inputData, {
      $merge: {
        touched: true,
        errorMessage: validResult.errorMessage,
        isValid: validResult.isValid,
        byPassValid: false
      }
    });
    let updateFormData = update(beforeFormData, {
      $merge: {
        [inputName]: updateInputData
      }
    });
    this.changeFormData(updateFormData);
  }

  // input 정보 반영(멀티)
  @action
  changeInputArray(inputInfoArray) {
    let updateFormData = toJS(this.formData);
    if (inputInfoArray.length) {
      inputInfoArray.forEach((inputInfo) => {
        let inputName = inputInfo.name;
        let inputValue = inputInfo.value;
        let inputData = updateFormData[inputName];
        inputData.value = inputValue;
        let validResult = Helper.checkValidation(inputData, '', updateFormData);
        let updateInputData = update(inputData, {
          $merge: {
            touched: true,
            errorMessage: validResult.errorMessage,
            isValid: validResult.isValid,
            value: inputValue,
            byPassValid: false
          }
        });
        updateFormData = update(updateFormData, {
          $merge: {
            [inputName]: updateInputData
          }
        });
      });
    }
    this.formData = updateFormData;
  }

  // input 정보 반영
  @action
  changeInput(inputName, inputValue) {
    let beforeFormData = toJS(this.formData);
    let inputData = beforeFormData[inputName];
    if (inputData.trueValue) {
      inputValue = inputValue ? inputData.trueValue : inputData.falseValue;
    }
    inputData.value = inputValue;
    let validResult = Helper.checkValidation(inputData, '', beforeFormData);
    let updateInputData = update(inputData, {
      $merge: {
        touched: true,
        errorMessage: validResult.errorMessage,
        isValid: validResult.isValid,
        value: inputValue,
        byPassValid: false
      }
    });
    let updateFormData = update(beforeFormData, {
      $merge: {
        [inputName]: updateInputData
      }
    });
    this.formData = updateFormData;
  }

  // formData 수정
  @action
  changeFormData(formData) {
    this.formData = formData;
  }

  // formData 맵핑시키기
  @action
  setFormData(detailInfo) {
    this.detailInfo = detailInfo;
    this.formType = Constant.FORM_TYPE_EDIT;
    let formData = toJS(this.formData);
    let formDataKeys = _.keys(formData);
    formDataKeys.forEach((inputKey) => {
      let inputData = formData[inputKey];
      if (inputData.isArray) {
        inputData.value = detailInfo[inputKey] || [];
      } else {
        inputData.value = detailInfo[inputKey];
      }
    });
    this.formData = formData;
  }

  // formData 전체 validate
  @action
  validate() {
    let validationFormData = toJS(this.formData);
    let firstErrorInputData = null;
    let successValidation = true;
    let inputKeys = _.keys(validationFormData);
    inputKeys.forEach((inputName) => {
      let inputData = validationFormData[inputName];
      inputData.touched = true;
      let validResult = Helper.checkValidation(
        inputData,
        '',
        validationFormData
      );
      inputData.errorMessage = validResult.errorMessage;
      inputData.isValid = validResult.isValid;
      if (!firstErrorInputData && !inputData.isValid) {
        firstErrorInputData = inputData;
        successValidation = false;
      }
    });
    if (firstErrorInputData) {
      try {
        if ($('#' + firstErrorInputData.inputName)) {
          $('#' + firstErrorInputData.inputName).focus();
        }
      } catch (e) {
        alert('validate input 포커스 에러');
      }
    }
    this.changeFormData(validationFormData);
    return successValidation;
  }

  // formData 기준으로 api param 추출하기
  @action
  getApiParam() {
    let formData = this.formData;
    let inputKeys = _.keys(formData);
    let apiParam = {};
    inputKeys.forEach((key) => {
      let inputData = formData[key];
      if (!inputData.apiParamExpect) {
        if (inputData.isKeyCheck) {
          if (inputData.value) {
            apiParam[key] = inputData.value[inputData.keyName];
          } else {
            apiParam[key] = null;
          }
        } else if (inputData.isObject) {
          let objectValueKeys = _.keys(inputData.value);
          objectValueKeys.forEach((objectKey) => {
            apiParam[objectKey] = inputData.value[objectKey];
          });
        } else if (inputData.isArray) {
          if (inputData.value.length) {
            apiParam[key] = toJS(inputData.value);
          }
        } else {
          apiParam[key] = inputData.value;
        }
      }
    });
    return apiParam;
  }

  // 저장
  @action
  save(formType, detailId) {
    if (!this.validate()) {
      return;
    }
    let formData = this.formData;
    let inputKeys = _.keys(formData);
    let apiParam = {};
    inputKeys.forEach((key) => {
      let inputData = formData[key];
      if (!inputData.apiParamExpect) {
        apiParam[key] = inputData.value;
      }
    });
    if (formType === Constant.FORM_TYPE_EDIT) {
      return ApiService.put(this.apiUrl + '/' + detailId, apiParam);
    } else {
      return ApiService.post(this.apiUrl, apiParam);
    }
  }

  // 검색정보 : list, pageable 추출
  @action
  changePageInfo(searchData, listName) {
    // let pageable = searchData.pageable;
    let list = searchData.content;
    // 총 카운트
    let totalCount = searchData.totalElements;
    // 토탈 페이지 사이즈 : 총 카운트 / pageSize
    let totalPageSize = Math.ceil(totalCount / this.pageSize);
    // 현재 페이지 스텝 : 현재 페이지 / display되는 목록 수 해서 버림
    let currentPageStep = Math.floor(
      this.currentPage / Config.displayMaxPageCount
    );
    // 현재 페이지 % display되는 목록 수 나눈 나머지가 0이 아니면 현재 페이지 스텝 + 1
    if (this.currentPage % Config.displayMaxPageCount !== 0) {
      currentPageStep = currentPageStep + 1;
    }

    // 현재 step * display되는 목록 수 - (display되는 목록 수 -1)
    let pageInfoStartIndex =
      currentPageStep * Config.displayMaxPageCount -
      (Config.displayMaxPageCount - 1);

    // 현재 step * display되는 목록 수가 토탈 페이지보다 작거나 같으면 현재 step * display되는 목록 수 or totalPageSize
    let pageInfoLastIndex =
      currentPageStep * Config.displayMaxPageCount <= totalPageSize
        ? currentPageStep * Config.displayMaxPageCount
        : totalPageSize;
    let displayPageInfos = [];
    for (
      let pageInfoIndex = pageInfoStartIndex;
      pageInfoIndex <= pageInfoLastIndex;
      pageInfoIndex++
    ) {
      displayPageInfos.push(pageInfoIndex);
    }
    // 토탈 페이지 / display되는 목록 수 (올림)
    let lastPageStep = Math.ceil(totalPageSize / Config.displayMaxPageCount);

    // 현재 페이지 step이 마지막 페이지 스텝 보다 작으면
    let isNextPageStep = currentPageStep < lastPageStep;

    // 현재 페이지 스텝 * display되는 목록 수 + 1
    let nextPage = isNextPageStep
      ? currentPageStep * Config.displayMaxPageCount + 1
      : null;

    // 이전 페이지 여부는 현재 페이지 스텝이 1 보다 큰 경우만
    let isPrevPageStep = currentPageStep > 1;

    // 이전 페이지는 (현재 스텝 - 2) * display되는 목록 수 + 1
    let prevPage = isPrevPageStep
      ? (currentPageStep - 2) * Config.displayMaxPageCount + 1
      : null;
    if (listName) {
      this[listName] = list;
    } else {
      this.list = list;
    }
    this.totalCount = totalCount;
    this.displayPageInfos = displayPageInfos;
    this.prevPage = prevPage;
    this.nextPage = nextPage;
  }

  // 목록 정렬 정보 변경
  @action
  changeSort(sort) {
    this.sort = sort;
    this.currentPage = 1;
    this.search(true);
  }

  // 검색 키워드 변경
  @action
  changeKeyword(keyword) {
    this.keyword = keyword;
  }

  // 검색 유형 변경
  @action
  changeSearchKind(searchKind) {
    this.searchKind = searchKind;
  }

  // 이미지 파일 업로드
  @action
  uploadFile(fileObject, fileLocation, fileMaxSize, inputName, maxLength) {
    if (!Helper.checkImageFileUploadExtension(fileObject)) {
      ModalService.alert({ body: '이미지만 첨부 가능합니다.' });
      return;
    }
    if (
      !Helper.checkFileUploadMaxSize(
        fileObject,
        fileMaxSize || Config.defaultFileUploadSize
      )
    ) {
      ModalService.alert({ body: '용량을 확인해주세요(5MB 이하).' });
      return;
    }
    let formData = toJS(this.formData);
    inputName = inputName || 'imageList';
    let imageList = formData[inputName].value;
    maxLength = maxLength || 10;
    if (imageList.length >= maxLength) {
      ModalService.alert({
        body: '사진은 ' + maxLength + '개까지만 첨부 가능합니다.'
      });
      return;
    }
    let fileFormData = new FormData();
    fileFormData.append('upload_file', fileObject);
    fileFormData.append('fileType', Constant.FILE_UPLOAD_TYPE_IMAGE);
    fileFormData.append('fileLocation', fileLocation);
    ApiService.post('common/uploadFile', fileFormData, {}).then((response) => {
      let data = response.data;
      imageList.push({
        status: Constant.FILE_UPLOAD_STATUS_NEW,
        fileName: data.fileName,
        fileThumbnail: data.thumb,
        fileSeq: data.tempFileSeq,
        fileUrl: data.fileUrl
      });
      this.changeInput(inputName, imageList);
    });
  }

  // 파일 삭제
  @action
  removeImage(arrayIndex, fileSeq, inputName, notApplyRepresentImage) {
    let formData = toJS(this.formData);
    let imageListInputName = inputName || 'imageList';
    let imageList = formData[imageListInputName].value;
    let representImage = null;
    if (formData.representImage) {
      representImage = formData.representImage.value;
    }
    if (formData.representImage && !notApplyRepresentImage) {
      if (Number(representImage) === Number(fileSeq)) {
        this.changeInput('representImage', '');
      }
    }
    const newImageList = update(imageList, {
      $splice: [[arrayIndex, 1]]
    });
    this.changeInput(imageListInputName, newImageList);
  }

  // 이미지 파일 업로드
  @action
  uploadFileObject(
    fileObject,
    fileInputName,
    fileLocation,
    fileMaxSize,
    byPassLogin
  ) {
    if (!Helper.checkImageFileUploadExtension(fileObject)) {
      ModalService.alert({
        body: '이미지만 첨부 가능합니다.'
      });
      return;
    }
    if (
      !Helper.checkFileUploadMaxSize(
        fileObject,
        fileMaxSize || Config.defaultFileUploadSize
      )
    ) {
      ModalService.alert({ body: '용량을 확인해주세요(5MB 미만).' });
      return;
    }
    let fileFormData = new FormData();
    fileFormData.append('upload_file', fileObject);
    fileFormData.append('fileType', Constant.FILE_UPLOAD_TYPE_IMAGE);
    fileFormData.append('fileLocation', fileLocation);
    let apiUrl = 'common/uploadFile';
    if (byPassLogin) {
      apiUrl = 'common/uploadFileWithoutLogin';
    }
    ApiService.post(apiUrl, fileFormData, {}).then((response) => {
      let data = response.data;
      this.changeInput(fileInputName, {
        status: Constant.FILE_UPLOAD_STATUS_NEW,
        fileName: data.fileName,
        fileThumbnail: data.thumb,
        fileSeq: data.tempFileSeq,
        fileUrl: data.fileUrl
      });
    });
  }

  // 정보 clear
  @action
  clear() {
    this.list = [];
    this.currentPage = 1;
    this.totalCount = '';
    this.prevPage = null;
    this.nextPage = null;
    this.displayPageInfos = [];
    this.pageSize = Config.defaultPageSize;
    this.formData = null;
    this.formType = Constant.FORM_TYPE_NEW;
    this.detailId = null;
    this.keyword = '';
    this.sort = '';
    this.searchKind = '';
    this.detailInfo = null;
  }
}

export default CommonStore;
