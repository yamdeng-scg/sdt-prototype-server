import axios from 'axios';

class SlackService {
  sendMessageToErrorChannel(message) {
    axios.post(
      'https://hooks.slack.com/services/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',
      { text: message },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

  sendMessageToDebugChannel(message) {
    axios.post(
      'https://hooks.slack.com/services/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',
      { text: message },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }
}

export default new SlackService();
