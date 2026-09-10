import React from 'react';
import { Row, Col, Card, Statistic, Button, Avatar, Tag, Space } from 'antd';
import {
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, NavLink } from 'react-router-dom';
import { Pie, Column } from '@ant-design/plots';
import { useSelector } from 'react-redux';

function Dashboard() {
  const navigate = useNavigate();

  // Đọc dữ liệu từ Redux (đã được HomeLayout nạp sẵn)
  const userState = useSelector((state) => state.userReducer);
  const projects = Array.isArray(userState.myProject) ? userState.myProject : [];

  // Dữ liệu mẫu (Mock) cho biểu đồ
  const pieConfig = {
    data: [
      { type: 'Hoàn thành (Done)', value: 38 },
      { type: 'Đang thực hiện (In Progress)', value: 12 },
      { type: 'Cần làm (To Do)', value: 15 },
      { type: 'Đã hủy / Tạm dừng', value: 4 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: { text: 'value', position: 'spider' },
    legend: { color: { title: false, position: 'bottom', rowPadding: 5 } },
  };

  const columnConfig = {
    data: [
      { project: 'ORMS System', tasks: 18 },
      { project: 'Movie Booking', tasks: 12 },
      { project: 'AUIR Landing', tasks: 5 },
      { project: 'Prestige Floor', tasks: 3 },
    ],
    xField: 'project',
    yField: 'tasks',
    colorField: 'project',
    style: { maxWidth: 40 },
    axis: { y: { labelAutoRotate: false } },
  };

  return (
    <div className="dashboard-container" style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Phần chào mừng & Tác vụ nhanh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontWeight: 700, margin: 0, color: '#1f1f1f' }}>Xin chào! 👋</h2>
          <p style={{ color: '#595959', margin: '4px 0 0 0' }}>
            Chào mừng bạn trở lại hệ thống quản lý dự án. Dưới đây là tóm tắt hoạt động của bạn.
          </p>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/project-management/create')}>
            Tạo Dự Án Mới
          </Button>
        </Space>
      </div>

      {/* Các thẻ Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '8px' }}>
            <Statistic title="Tổng số Dự án" value={projects.length} prefix={<ProjectOutlined style={{ color: '#1890ff' }} />} valueStyle={{ fontWeight: 'bold' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '8px' }}>
            <Statistic title="Công việc Hoàn thành" value={38} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ fontWeight: 'bold', color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '8px' }}>
            <Statistic title="Đang thực hiện" value={12} prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />} valueStyle={{ fontWeight: 'bold', color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '8px' }}>
            <Statistic title="Thành viên phối hợp" value={8} prefix={<TeamOutlined style={{ color: '#722ed1' }} />} valueStyle={{ fontWeight: 'bold' }} />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontSize: '15px', fontWeight: 600 }}><BarChartOutlined /> Tỷ lệ trạng thái Công việc</span>} bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '8px', height: '100%' }}>
            <div style={{ height: '280px' }}><Pie {...pieConfig} /></div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontSize: '15px', fontWeight: 600 }}><BarChartOutlined /> Task hoàn thành theo Dự án</span>} bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '8px', height: '100%' }}>
            <div style={{ height: '280px' }}><Column {...columnConfig} /></div>
          </Card>
        </Col>
      </Row>

      {/* Danh sách Dự án */}
      <Card title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Dự án nổi bật ({projects.length})</span>} bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: '8px' }}>
        <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col xs={24} md={12} lg={12} key={project.id}>
              <Card
                type="inner"
                title={
                  <NavLink to={`/project-management/project-detail/${project.id}`} style={{ fontWeight: 600, color: '#1890ff' }}>
                    {project.projectName}
                  </NavLink>
                }
                extra={<Tag color="geekblue">{project.categoryName || `#${project.categoryId}`}</Tag>}
                style={{ borderRadius: '6px', border: '1px solid #f0f0f0', height: '100%' }}
              >
                <p style={{ color: '#595959', minHeight: '45px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {project.description || 'Chưa có mô tả.'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar.Group maxCount={3} size="small">
                      {(project.members || []).map((m, idx) => (
                        <Avatar key={idx} src={m.avatar} title={m.name} />
                      ))}
                    </Avatar.Group>
                    <span style={{ marginLeft: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                      ({(project.members || []).length} thành viên)
                    </span>
                  </div>
                  <NavLink to={`/project-management/project-detail/${project.id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                    Vào Board <ArrowRightOutlined />
                  </NavLink>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}

export default Dashboard;