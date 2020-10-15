import rootStore from '../stores/RootStore';

function show() {
  rootStore.uiStore.showLoadingBar();
}

function hide() {
  rootStore.uiStore.hideLoadingBar();
}

const LoadingBar = {
  show: show,
  hide: hide
};

export default LoadingBar;
