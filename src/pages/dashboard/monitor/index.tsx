import { Button, Card, Col,Modal, Row, Spin, Table, Tag, Input, Form, InputNumber, notification} from 'antd';
import axios from 'axios'
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';

import { GridContent } from '@ant-design/pro-layout';
import { queryLicenses } from './service';

const Monitor: FC = () => {
  const [page, setPage] = useState({
    limit: 10,
    page: 1,
    searchKey: '',
  });

  const [key, setKey] = useState({
    count: 0,
    name: '',
    duration: 0
  })

  const {
    loading: licenseUsersLoading,
    data: dataLicense = [],
    run,
  } = useRequest(
    (page) => {
      return queryLicenses(page);
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    run(page);
  }, []);

  const columns = [
    {
      title: 'Key Value',
      dataIndex: 'keyValue',
      key: 'keyValue',
    },
    {
      title: 'Date',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Is Used',
      dataIndex: 'isUsed',
      key: 'isUsed',
      render: (isUsed: boolean) => {
        return isUsed ? <Tag color={'red'}> Used </Tag> : <Tag color={'green'}>Not Used</Tag>;
      },
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openNotification = () => {
    notification.open({
      key: 'Add Key',
      message: 'Add key sucessfully',
    });
  
  };
  const openNotificationError = () => {
    notification.open({
      key: 'Add Key',
      message: 'Please add your inform',
    });
  
  };
  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async() => {
    if(key.duration<=0 || key.name =='' || key.count<=0){
      openNotificationError();
      setIsModalVisible(false);
    }else{
      await axios.post("http://video-api-ecs-alb-501313528.ap-southeast-1.elb.amazonaws.com:8080/api/v1/license/generate-license",key);
      openNotification()
      setIsModalVisible(false);
      run(page);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onChangePage = (data: any) => {
    page.page = data;
    setPage(page);
    run(page);
  };
  const onChangeCount = (e: any) => {
    key.count = e;
    setKey(key);
  };

  const onChangeDuration = (e: any) =>{
    key.duration = e;
    setKey(key);
  }

  const onChangeName = (e: any) =>{ 
    key.name = e.target.value;
    setKey(key);
  }

  return (
    <GridContent>
      <>
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input  onChange={onChangeName}/>
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              rules={[{ required: true, message: 'Please input the duration!' }]}
            >
              <InputNumber  onChange={onChangeDuration}/>
            </Form.Item>

            <Form.Item
              label="Count"
              name="count"
              rules={[{ required: true, message: 'Please input the count!' }]}
            >
              <InputNumber onChange={onChangeCount} />
            </Form.Item>

       </Form>
          </Modal>
            <Button type="primary"  onClick={showModal}>
              Generate Key
            </Button>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="Key VIP" bordered={false}>
              <Table
                dataSource={dataLicense?.results}
                columns={columns}
                loading={{
                  indicator: (
                    <div>
                      <Spin />
                    </div>
                  ),
                  spinning: licenseUsersLoading,
                }}
                pagination={{
                  pageSize: dataLicense?.pagination?.pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '30'],
                  total: dataLicense?.pagination?.total,
                  defaultCurrent: dataLicense?.pagination?.page,
                  onChange: onChangePage,
                }}
              />
            </Card>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};

export default Monitor;
