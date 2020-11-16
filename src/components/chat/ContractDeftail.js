import React from 'react';
import { Row, Col, Typography, Select, Input } from 'antd';
import { AudioOutlined, SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Title } = Typography;

class ContractDeftail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Row
          style={{
            padding: 10,
            marginBottom: 10
          }}
        >
          <Col span={24}>
            <Title level={3} className="text mr0">
              사용계약정보 (4)
            </Title>
          </Col>
        </Row>
        <Row
          style={{
            padding: 10
          }}
        >
          <Col span={24} style={{ marginBottom: 10 }}>
            <Select
              defaultValue="lucy"
              style={{ width: '100%', textAlign: 'left' }}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          <Col span={8} style={{ textAlign: 'left' }}>
            사용계약번호
          </Col>
          <Col
            span={16}
            style={{
              textAlign: 'right',
              position: 'relative',
              marginBottom: 5
            }}
          >
            <Input
              placeholder="input search text"
              enterButton={null}
              allowClear
              suffix={
                <SearchOutlined
                  style={{
                    fontSize: 16,
                    color: '#1890ff'
                  }}
                />
              }
            />
          </Col>
        </Row>
        <div style={{ padding: 30, textAlign: 'center' }}>
          <Row>
            <Col span={24}>존재하지 않은 사용계약번호입니다</Col>
          </Row>
        </div>
        <div
          style={{
            overflowY: 'scroll',
            height: document.documentElement.clientHeight - 104
          }}
        >
          <Col span={12} style={{ textAlign: 'left' }}>
            사용계약번호
          </Col>
          <Col
            span={12}
            style={{
              textAlign: 'right',
              position: 'relative',
              marginBottom: 5
            }}
          >
            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              12312312321
            </span>
            <div>가정용</div>
          </Col>
          <Row
            style={{
              padding: 10
            }}
          >
            <Col span={12} style={{ textAlign: 'left' }}>
              계약상태
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              정상
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              계약자 성명
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              홍길동
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              휴대폰 번호
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                01231231223
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              주소
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                ㄴㅁㅇㅁㄴㅇㅁㄴㅇ
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              점검기준일
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              00월1일
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              청구서
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              모바일 청구서
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              납부방법
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              자동이체
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              최근 계량기 교체일
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                2020년 1월 21일
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              최근 안전점검일자
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                2020년 1월 21일
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              잔여캐시
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                500 캐시
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              해당 고객센터
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                0001111
              </span>
            </Col>
          </Row>
          <Row
            style={{
              padding: 10,
              borderBottom: '1px solid #f0f0f0',
              borderTop: '1px solid #f0f0f0'
            }}
          >
            <Col span={24} style={{ marginBottom: 10 }}>
              <Select
                defaultValue="lucy"
                style={{ width: 150, textAlign: 'left' }}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>{' '}
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                500 캐시
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              납기일
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                2020년1월21일
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              총 청구요금
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
          </Row>
          <Row style={{ padding: 10, borderBottom: '1px solid #f0f0f0' }}>
            <Col span={12} style={{ textAlign: 'left' }}>
              당월 소계{' '}
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                요약
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                5000원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              기본 요금
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              사용 요금
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              감면 금액
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              계량기 교체 금액
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              부가세
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              정산금액
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              절사금액
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
          </Row>
          <Row style={{ padding: 10, borderBottom: '1px solid #f0f0f0' }}>
            <Col span={12} style={{ textAlign: 'left' }}>
              미납 소계{' '}
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                요약
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                5000원
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              이전 미납
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                123원
              </span>
            </Col>
          </Row>
          <Row
            style={{
              padding: 10,
              borderBottom: '1px solid #f0f0f0',
              marginBottom: 20
            }}
          >
            <Col span={12} style={{ textAlign: 'left' }}>
              납부 상태{' '}
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                납부전
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              입금전용계좌{' '}
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                납부전
              </span>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'left' }}>
              <Select
                defaultValue="lucy"
                style={{ width: 200, textAlign: 'left' }}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                000000
              </span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ContractDeftail;
