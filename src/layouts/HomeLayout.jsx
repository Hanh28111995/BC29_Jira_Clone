import "antd/dist/antd.min.css";
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  FileAddOutlined,
  WechatOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { Breadcrumb, Layout, Menu, notification } from "antd";
import { USER_KEY } from "constants/common";
import {
  setEditDataProject,
  setMyProject,
  setUserInfoAction,
} from "store/actions/user.action";
import { fetchProjectListAPI } from "services/project";
import { useAsync } from "hooks/useAsync";
import { GetAllPriorityTypeApi } from "services/data/priorityTypes";
import { GetAllStatusTypeApi } from "services/data/statusTypes";
import { GetAllTaskTypeApi } from "services/data/taskTypes";
import { GetAllProjectCategoryApi } from "services/data/projectCategory";
import { getMemberListApi } from "services/user";
import { setCategory, setTaskTypeList, setPriorityList, setStatusList, setuserSearch } from "store/actions/user.action";
import CreateTaskForm from "CreateTask/CreateTaskForm";
import ProjectSider from "modules/Sider/ProjectSider";
import logo from "../logo.svg";
import "./index.scss";

const { Content, Footer, Sider } = Layout;

const getItem = (label, key, icon) => ({ key, icon, label });

// Global rail: highlight theo segment đầu tiên của pathname
const globalKeyFor = (pathname) => {
  const seg = pathname.split("/").filter(Boolean);
  return seg.length ? `/${seg[0]}` : "/dashboard";
};

function HomeLayout() {
  const userState = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { state: members } = useAsync({
  service: getMemberListApi,
  queryKey: ["members-list"],
});

const { state: categories } = useAsync({
  service: GetAllProjectCategoryApi,
  queryKey: ["metadata", "categories"],
});

const { state: priorities } = useAsync({
  service: GetAllPriorityTypeApi,
  queryKey: ["metadata", "priorities"],
});

const { state: statuses } = useAsync({
  service: GetAllStatusTypeApi,
  queryKey: ["metadata", "statuses"],
});

const { state: taskTypes } = useAsync({
  service: GetAllTaskTypeApi,
  queryKey: ["metadata", "task-types"],
});

useEffect(() => { if (members) dispatch(setuserSearch(members)); }, [members, dispatch]);
useEffect(() => { if (categories) dispatch(setCategory(categories)); }, [categories, dispatch]);
useEffect(() => { if (priorities) dispatch(setPriorityList(priorities)); }, [priorities, dispatch]);
useEffect(() => { if (statuses) dispatch(setStatusList(statuses)); }, [statuses, dispatch]);
useEffect(() => { if (taskTypes) dispatch(setTaskTypeList(taskTypes)); }, [taskTypes, dispatch]);

  // null = cả 2 ở icon-mode | 'global' | 'project' = sider đó đang expand
  const [activeSidebar, setActiveSidebar] = useState(null);
  const containerRef = useRef(null);

  const projectExpanded = activeSidebar === "project";
  const projects = userState.myProject || [];

  // Click ra ngoài vùng layout -> cả 2 về icon-mode
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveSidebar(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Đổi route -> tự thu về icon-mode
  useEffect(() => {
    setActiveSidebar(null);
  }, [pathname]);

  const currentUser = userState?.userInfor?.user || userState?.userInfor;
  const userRole = (currentUser?.role || currentUser?.type || "").toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "owner";

  const getGlobalMenuItems = () => {
    const baseItems = [
      getItem("Dashboard", "/dashboard", <DashboardOutlined />),
    ];
    if (isAdmin) {
      baseItems.push(
        getItem("User Management", "/user-management", <TeamOutlined />),
        getItem("Project Management", "/project-management", <ProjectOutlined />),
        getItem("Task Management","/task-management",<UnorderedListOutlined />),
      );
    } else {
      baseItems.push(
        getItem("Task Management","/task-management",<UnorderedListOutlined />),                      
      );
    }
    baseItems.push(
      getItem("Create Task", "callCreateTask", <FileAddOutlined />),
      getItem("Group Chat", "/chat", <WechatOutlined />),
    );
    return baseItems;
  };

  // KHẮC PHỤC LOOP: null khi chưa load -> effect thoát sớm, không dispatch
  const { state } = useAsync({
    dependencies: [],
    service: () => fetchProjectListAPI(),
  });
  const data = Array.isArray(state) ? state : null;

  useEffect(() => {
    if (!currentUser?.id || !data) return;
    const owned = data.filter((ele) => ele.creator?.id === currentUser.id);
    const next = JSON.stringify(owned);
    if (JSON.stringify(userState.myProject || []) !== next) {
      dispatch(setMyProject(owned));
    }
  }, [data, currentUser?.id, userState.myProject]);

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    dispatch(setUserInfoAction(null));
    navigate("/login");
  };

  const handleGlobalClick = ({ key, domEvent }) => {
    domEvent?.stopPropagation();
    setActiveSidebar("global");

    if (key === "callCreateTask") {
      if (projects.length === 0) {
        notification.warning({
          description: "Please join or create a project first!",
        });
        return;
      }
      dispatch(
        setEditDataProject({
          title: "Create Task",
          setOpen: true,
          infor: <CreateTaskForm />,
          data: {
            id: currentUser?.id,
            projectName: "Task Management",
            creator: currentUser?.name,
            description: "",
            categoryId: "",
          },
        }),
      );
      return;
    }

    if (key === "logOut") {
      handleLogout();
      return;
    }

    navigate(key);
  };

  const breadcrumb = pathname.split("/").filter(Boolean);

  const globalWidth = activeSidebar === "global" ? 200 : 55;
  const globalSelected = [globalKeyFor(pathname)];

  return (
    <div ref={containerRef}>
      <Layout style={{ minHeight: "100vh", overflowX: "hidden" }}>
        {/* 1. GLOBAL SIDER — cố định bên trái */}
        <Sider
          collapsible
          trigger={null}
          collapsed={activeSidebar !== "global"}
          width={200}
          collapsedWidth={55}
          style={{
            backgroundColor: "#05357e",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
            transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSidebar("global");
          }}
        >
          <div
            className="logo"
            style={{ textAlign: "center", padding: "16px 0" }}
          >
            <a href="/">
              <div
                className="sideBar-icon"
                style={{ color: "#fff", fontSize: "20px" }}
              >
                <i className="fa-brands fa-jira fa-lg"></i>
              </div>
            </a>
          </div>
          <Menu
            mode="inline"
            theme="dark"
            style={{ backgroundColor: "transparent", borderRight: 0 }}
            items={getGlobalMenuItems()}
            selectedKeys={globalSelected}
            onClick={handleGlobalClick}
          />
          <div
            role="menuitem"
            tabIndex={0}
            className="ps-item global-logout"
            style={{ marginTop: "auto", color: "#fff" }}
            onClick={() => handleLogout()}
            onKeyDown={(e) => e.key === "Enter" && handleLogout()}
          >
            <span className="ps-item-icon">
              <LogoutOutlined />
            </span>
            {activeSidebar === "global" && (
              <span className="ps-item-label">Log Out</span>
            )}
          </div>
        </Sider>

        {/* 2. PHẦN BÊN PHẢI: Project Sider + Content */}
        <Layout
          style={{
            marginLeft: globalWidth,
            transition: "margin-left 0.2s cubic-bezier(0.2, 0, 0, 1)",
            display: "flex",
            flexDirection: "row",
            minHeight: "100vh",
          }}
        >
          {/* PROJECT SIDER (xám) — Sider thật, bên trong là component ProjectSider */}
          <Sider
            collapsible
            trigger={null}
            collapsed={!projectExpanded}
            width={240}
            collapsedWidth={50}
            style={{
              backgroundColor: "#f4f5f7",
              borderRight: "1px solid #e8e8e8",
              height: "100vh",
              position: "sticky",
              top: 0,
              left: 0,
              zIndex: 90,
              overflowY: "auto",
              flexShrink: 0,
              transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSidebar("project");
            }}
          >
            <ProjectSider expanded={projectExpanded} projects={projects} />
          </Sider>

          {/* MAIN CONTENT */}
          <Content
            style={{
              margin: "0 16px",
              flexGrow: 1,
              overflowY: "auto",
              minWidth: 0,
            }}
            onClick={() => setActiveSidebar(null)}
          >
            <Breadcrumb style={{ margin: "16px 0" }}>
              {breadcrumb.map((item, index) => (
                <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
              ))}
            </Breadcrumb>

            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
                background: "#fff",
                borderRadius: "4px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Outlet />
            </div>

            <Footer
              style={{
                textAlign: "center",
                color: "#5e6c84",
                padding: "24px 0",
              }}
            >
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default HomeLayout;
