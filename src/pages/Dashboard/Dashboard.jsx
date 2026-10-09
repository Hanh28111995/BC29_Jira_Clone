import React from "react";
import { Row, Col, Card, Statistic, Button, Avatar, Tag, Space } from "antd";
import {
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate, NavLink } from "react-router-dom";
import { Pie, Column } from "@ant-design/plots";
import { useSelector } from "react-redux";
import { GetDashboardSummaryApi } from "services/task";
import { useAsync } from "hooks/useAsync";

function Dashboard() {
  const navigate = useNavigate();

  // Đọc dữ liệu dự án từ Redux
  const userState = useSelector((state) => state.userReducer);
  const projects = Array.isArray(userState.myProject)
    ? userState.myProject
    : [];

  // Gọi API tổng hợp mới
  const { state: summary } = useAsync({
    service: GetDashboardSummaryApi,
    queryKey: ["dashboard", "summary"],
  });

  // Dữ liệu an toàn khi API chưa trả về
  const summaryData = summary?.resultObject || summary || {};
  const totalProjects = projects.length;
  const mainPj = projects
    .slice()
    .sort((a, b) => (b.totalTasks || 0) - (a.totalTasks || 0))
    .slice(0, 2);
  const completedTasks = summaryData.completedTasks ?? 0;
  const inProgressTasks = summaryData.inProgressTasks ?? 0;
  const memberCount = summaryData.memberCount ?? 0;
  const byStatus = Array.isArray(summaryData.byStatus)
    ? summaryData.byStatus
    : [];

  // Cấu hình biểu đồ Tròn (Pie)
  const pieConfig = {
    data: byStatus.map((item) => ({
      type: item.statusName,
      value: item.count,
    })),
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    label: { text: "value", position: "spider" },
    legend: { color: { title: false, position: "bottom", rowPadding: 5 } },
  };
  
  const columnConfig = {
    data: projects.slice(0, 5).map((project) => {
      const completedCount = project.completedTasks ?? 0;
      const totalCount = project.totalTasks ?? 0;
      const completionRate = totalCount > 0 ? completedCount / totalCount : 0;

      return { project: project.projectName, value: completionRate };
    }),
    xField: "project",
    yField: "value",
    style: { fill: "#1890ff", maxWidth: 30 },
    scale: { y: { domainMin: 0, domainMax: 1, nice: false } },
    axis: {
      y: {
        labelFormatter: (value) => `${Math.round(Number(value) * 100)}%`,
        tickMethod: () => [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
      x: { labelAutoRotate: false, labelAutoHide: false },
    },
    tooltip: {
      items: [
        {
          channel: "y",
          valueFormatter: (value) => `${(Number(value) * 100).toFixed(0)}%`,
        },
      ],
    },
    autoFit: true,
    height: 340,
  };

  return (
    <div className="dashboard-container">
      {/* Phần chào mừng & Tác vụ nhanh */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ fontWeight: 700, margin: 0, color: "#1f1f1f" }}>
            Xin chào! 👋
          </h2>
          <p style={{ color: "#595959", margin: "4px 0 0 0" }}>
            Chào mừng bạn trở lại hệ thống quản lý dự án. Dưới đây là tóm tắt
            hoạt động của bạn.
          </p>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/project-management/create")}
          >
            Tạo Dự Án Mới
          </Button>
        </Space>
      </div>

      {/* Các thẻ Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Tổng số Dự án"
              value={totalProjects}
              prefix={<ProjectOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Công việc Hoàn thành"
              value={completedTasks}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ fontWeight: "bold", color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Đang thực hiện"
              value={inProgressTasks}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ fontWeight: "bold", color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Thành viên phối hợp"
              value={memberCount}
              prefix={<TeamOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: "15px", fontWeight: 600 }}>
                <BarChartOutlined /> Tỷ lệ trạng thái Công việc
              </span>
            }
            bordered={false}
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <div style={{ height: "280px" }}>
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: "15px", fontWeight: 600 }}>
                <BarChartOutlined /> Tỷ lệ hoàn thành task theo Dự án
              </span>
            }
            bordered={false}
            style={{
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <div style={{ height: "340px", overflowX: "auto" }}>
              <div style={{ height: "100%" }}>
                <Column {...columnConfig} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Danh sách Dự án */}
      <Card
        title={
          <span style={{ fontSize: "16px", fontWeight: 600 }}>
            Dự án nổi bật
          </span>
        }
        bordered={false}
        style={{
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
          borderRadius: "8px",
        }}
      >
        <Row gutter={[16, 16]}>
          {mainPj.map((project) => (
            <Col xs={24} md={12} lg={12} key={project.id}>
              <Card
                type="inner"
                title={
                  <NavLink
                    to={`/project-management/project-detail/${project.id}`}
                    style={{ fontWeight: 600, color: "#1890ff" }}
                  >
                    {project.projectName}
                  </NavLink>
                }
                extra={
                  <Tag color="geekblue">
                    {project.categoryName || `${project.totalTasks}`}
                  </Tag>
                }
                style={{
                  borderRadius: "6px",
                  border: "1px solid #f0f0f0",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    color: "#595959",
                    minHeight: "45px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {project.description || "Chưa có mô tả."}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    marginTop: "16px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f0f0f0",
                  }}
                >                  
                  <NavLink
                    to={`/project-management/project-detail/${project.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontWeight: 500,
                    }}
                  >
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
