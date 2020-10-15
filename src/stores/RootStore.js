import AppStore from './AppStore';
import UiStore from './UiStore';
import ChatStore from './ChatStore';
import LoginStore from './LoginStore';
import PdfManualStore from './PdfManualStore';
import TemplateStore from './TemplateStore';
import AutoMessageStore from './manager/AutoMessageStore';
import BlackCustomerStore from './manager/BlackCustomerStore';
import CategoryStore from './manager/CategoryStore';
import EmpStore from './manager/EmpStore';
import StatsStore from './manager/StatsStore';

class RootStore {
  constructor() {
    this.appStore = new AppStore(this);
    this.uiStore = new UiStore(this);
    this.chatStore = new ChatStore(this);
    this.loginStore = new LoginStore(this);
    this.pdfManualStore = new PdfManualStore(this);
    this.templateStore = new TemplateStore(this);
    this.autoMessageStore = new AutoMessageStore(this);
    this.blackCustomerStore = new BlackCustomerStore(this);
    this.categoryStore = new CategoryStore(this);
    this.empStore = new EmpStore(this);
    this.statsStore = new StatsStore(this);
  }
}

export default new RootStore();
