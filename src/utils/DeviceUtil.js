/* global navigator */

let isMobile = /Mobile|iPhone|iPad|iPod|Android|IEMobile/i.test(
  navigator.userAgent
);

let checkDevice = {
  isAndroid: function() {
    return navigator.userAgent.match(/Android/i) ? true : false;
  },
  isIOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
  }
};

const DeviceUtil = {
  isMobile: isMobile,
  isAndroid: checkDevice.isAndroid(),
  isIOS: checkDevice.isIOS()
};

export default DeviceUtil;
