import { Card, Col, Row, Spin, Table, Tag } from 'antd';
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

  return (
    <GridContent>
      <>
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
