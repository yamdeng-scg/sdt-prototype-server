import React from 'react';
import { Card } from 'antd';

class WiseSaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <Card
          title="Card title"
          style={{ width: 300, position: 'absolute', left: '30%', top: '30%' }}
        >
          <p>명언</p>
        </Card>
      </div>
    );
  }
}

export default WiseSaying;
