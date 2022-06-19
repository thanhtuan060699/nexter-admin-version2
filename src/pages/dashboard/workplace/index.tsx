import { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Input, InputNumber, Modal, Radio, Row, Spin, Table, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { queryLicenseUsers } from './service';

const Workplace: FC = () => {
  const [page, setPage] = useState({
    limit: 10,
    page: 1,
    searchKey: '',
  });

  const {
    loading: licenseUsersLoading,
    data: dataLicense = [],
    run,
  } = useRequest(
    (page) => {
      return queryLicenseUsers(page);
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'VIP Account',
      dataIndex: 'vipAccount',
      key: 'vipAccount',
      render: (vipAccount: boolean) => {
        return vipAccount ? <Tag color={'red'}> VIP </Tag> : <Tag color={'green'}>No VIP</Tag>;
      },
    },
    {
      title: 'Join Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: Date) => {
        return moment(createdAt).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Expired VIP Date',
      dataIndex: 'vipExpiredDate',
      key: 'vipExpiredDate',
      render: (vipExpiredDate: any) => {
        return moment(vipExpiredDate).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Update VIP',
      dataIndex: 'userId',
      key: 'updateVIP',
      render: (userId: any) => {
        setUserChoosen(userId?._id);
        return (
          <Button onClick={showModal} type="primary">
            Update
          </Button>
        );
      },
    },
  ];
  const onChangePage = (data: any) => {
    page.page = data;
    setPage(page);
    run(page);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amountDay, setAmountDay] = useState('30');
  const [userChoosen, setUserChoosen] = useState();
  const [amountInputDay, setAmounInputtDay] = useState();
  const [searchKey, setSearchKey] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    let amount;
    if (amountInputDay) {
      amount = amountInputDay;
    } else {
      amount = amountDay;
    }
    await axios.post(
      'http://video-api-ecs-alb-501313528.ap-southeast-1.elb.amazonaws.com:8080/api/v1/license/add-vip-bye-day',
      {
        date: Number(amount),
        userId: userChoosen,
      },
    );
    run(page);

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const changeAmountDay = (e: any) => {
    setAmounInputtDay(e);
  };

  const onChangeSearchKey = (e: any) => {
    setSearchKey(e.target.value);
    page.searchKey = e.target.value;
    setPage(page);
  };

  const handleAmountDayChange = (e: any) => {
    setAmountDay(e.target.value);
  };

  const clickSearch = () => {
    page.searchKey = searchKey;
    setPage(page);
    run(page);
  };
  return (
    <PageContainer>
      <Modal title="Update VIP" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Radio.Group
          value={amountDay}
          style={{ gap: '20px', display: 'flex', justifyContent: 'center' }}
          onChange={handleAmountDayChange}
        >
          <Radio.Button value="30">30</Radio.Button>
          <Radio.Button value="180">180</Radio.Button>
          <Radio.Button value="360">360</Radio.Button>
          <Radio.Button value="720">720</Radio.Button>
          <Radio.Button value="3600">3600</Radio.Button>
        </Radio.Group>
        <InputNumber
          style={{ marginTop: '10px', marginLeft: '52px' }}
          onChange={changeAmountDay}
          placeholder="Days"
        />
      </Modal>
      <Row>
        <Col span={12} style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
          <Input placeholder="Search by name & email" onChange={onChangeSearchKey} />
          <Button type="dashed" icon={<SearchOutlined />} onClick={clickSearch}>
            Search
          </Button>
        </Col>
      </Row>
      <Row>
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
      </Row>
    </PageContainer>
  );
};

export default Workplace;
