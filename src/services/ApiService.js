import Api from '../utils/Api';

class ApiService {
  get(url, config) {
    return Api.get(url, config);
  }

  post(url, data, config) {
    return Api.post(url, data, config);
  }

  delete(url, config) {
    return Api.delete(url, config);
  }

  put(url, data, config) {
    return Api.put(url, data, config);
  }

  patch(url, data, config) {
    return Api.patch(url, data, config);
  }
}

export default new ApiService();
