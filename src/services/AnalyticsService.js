/* global gtag */
import Config from '../config/Config';
import NativeInterfaceService from './NativeInterfaceService';
import rootStore from '../stores/RootStore';

class AnalyticsService {
  // 현재 사용 X
  sendGA(gaInfo) {
    gtag('config', Config.AnalysticId, {
      page_title: gaInfo.page_title,
      page_path: '/' + gaInfo.page_path
    });
  }

  // 페이지 트래킹
  sendPageInfo(pageInfo) {
    companyCode = rootStore.companyStore.company || '';
  }

  // 이벤트 트래킹 : 사용 X
  sendEventInfo(eventInfo) {
    companyCode = rootStore.companyStore.company || '';
  }

  // 버튼 이벤트 트래킹
  sendButtonEventInfo(eventInfo) {
    company = rootStore.appStore.company;
    eventInfo.eventName = eventInfo.eventName + 'B';
    this.sendEventInfo(eventInfo, company);
  }

  // 탭 이벤트 트래킹
  sendTabEventInfo(eventInfo) {
    company = rootStore.apppStore.company || '';
    eventInfo.eventName = eventInfo.eventName + 'T';
    this.sendEventInfo(eventInfo, company);
  }
}

export default new AnalyticsService();
