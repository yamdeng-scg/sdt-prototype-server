import ModalService from './ModalService';
import Config from '../config/Config';

class GpsService {
  latitude = null;
  longitude = null;

  getGps() {
    if (this.latitude) {
      return Promise.resolve({
        latitude: this.latitude,
        longitude: this.longitude
      });
    } else {
      return this.loadGps();
    }
  }

  loadGps() {
    if ('geolocation' in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          errorInfo => {
            // reject(errorInfo);
            resolve({
              latitude: Config.defaultLatitude,
              longitude: Config.defaultLongitude
            });
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      });
    } else {
      ModalService.alert({
        body: 'geolocation를 지원하지 않는 브라우저입니다.'
      });
      return Promise.resolve({
        latitude: Config.defaultLatitude,
        longitude: Config.defaultLongitude
      });
    }
  }

  loadGpsByHandler(successHandler, errorHandler, option) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        successHandler,
        errorHandler,
        option || { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      ModalService.alert({
        body: 'geolocation를 지원하지 않는 브라우저입니다.'
      });
    }
  }
}

export default new GpsService();
