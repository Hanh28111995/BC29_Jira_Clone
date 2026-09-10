import 'antd/dist/antd.min.css';
import {
  SettingOutlined,
  BarsOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SendOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Layout, notification } from 'antd';
import { USER_KEY } from 'constants/common';
import { setEditDataProject, setMyProject, setUserInfoAction } from 'store/actions/user.action';
import { fetchProjectListAPI } from 'services/project';
import { useAsync } from 'hooks/useAsync';
import CreateTaskForm from 'CreateTask/CreateTaskForm';
// import logo from '../logo.svg';
import './index.scss';
import ProjectSider from 'modules/Sider/ProjectSider';

const { Content, Footer, Sider } = Layout;

// Centralized colors — move these into index.scss variables when you get a chance
const SIDERS = {
  globalBg: '#05357e',
  projectBg: '#f4f5f7',
  mutedText: '#5e6c84',
  divider: '#d9d9d9',
};

const SEGMENT_LABELS = {
  dashboard: 'Dashboard',
  'user-management': 'User Management',
  'project-management': 'Project Management',
  'task-management': 'Task Management',
  board: 'Board',
  'project-detail': 'Project Detail',
  chat: 'Group Chat',
  login: 'Login',
};

const getItem = (label, key, icon, children) => ({ key, icon, children, label });

// Global rail: highlight by first path segment, e.g. "/task-management/5" -> "/task-management"
const globalKeyFor = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length ? `/${segments[0]}` : '/dashboard';
};

// Project rail: highlight the item whose route is a prefix of the current path
const projectKeyFor = (pathname, keys) =>
  keys.find((key) => key !== '/' && (pathname === key || pathname.startsWith(`${key}/`)));

function HomeLayout() {
  const userState = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // null = both rails in icon mode, 'global' / 'project' = that rail expanded
  const [activeSidebar, setActiveSidebar] = useState(null);
  const containerRef = useRef(null);

  // Collapse both rails on every route change
  useEffect(() => {
    setActiveSidebar(null);
  }, [pathname]);

  // Click outside the whole shell collapses both rails
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveSidebar(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentUser = userState?.userInfor?.user || userState?.userInfor;
  const userRole = (currentUser?.role || currentUser?.type || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'owner';
  

  const projectMenuItems = [
    getItem('Project Settings', '/project-settings', <SettingOutlined />),
    getItem('Releases', '/releases', <BarsOutlined />),
    getItem('Issues and Filters', '/issues', <AppstoreOutlined />),
    getItem('Pages', '/pages', <FileTextOutlined />),
    getItem('Reports', '/reports', <SendOutlined />),
    getItem('Components', '/components', <InboxOutlined />),
  ];
  const projectMenuKeys = projectMenuItems.map((item) => item.key);

  const { state: data = [] } = useAsync({
    dependencies: [],
    service: () => fetchProjectListAPI(),
  });

  useEffect(() => {
    if (!currentUser?.id) return;
    // Always dispatch — an empty array clears stale state from a previous user/session
    const owned = data.filter((ele) => ele.creator.id === currentUser.id);
    dispatch(setMyProject(owned));
  }, [data, currentUser?.id]);

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    dispatch(setUserInfoAction(null));
    navigate('/login');
  };

  const handleGlobalClick = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    setActiveSidebar('global');

    if (key === 'callCreateTask') {
      if (!userState.myProject || userState.myProject.length === 0) {
        notification.warning({ description: 'Please join or create a project first!' });
        return;
      }
      dispatch(
        setEditDataProject({
          title: 'Create Task',
          setOpen: true,
          infor: <CreateTaskForm />,
          data: {
            id: currentUser?.id,
            projectName: 'Task Management',
            creator: currentUser?.name,
            description: '',
            categoryId: '',
          },
        }),
      );
      return;
    }

    if (key === 'logOut') {
      handleLogout();
      return;
    }

    navigate(key);
  };

  const breadcrumb = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => SEGMENT_LABELS[segment] || segment.replace(/-/g, ' '));

  const isGlobalExpanded = activeSidebar === 'global';
  const isProjectExpanded = activeSidebar === 'project';
  const globalSelected = [globalKeyFor(pathname)];
  const selectedProjectKey = projectKeyFor(pathname, projectMenuKeys);
  const projectSelected = selectedProjectKey ? [selectedProjectKey] : [];

  return (
    <div
      ref={containerRef}
      className={`app-layout-root ${isGlobalExpanded ? 'global-expanded' : ''} ${isProjectExpanded ? 'project-expanded' : ''}`}
    >
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        {/* 1. Global rail (dark blue) */}
    {/* 2. SIDER THỨ HAI (Project Sider - tự dựng, không dùng Menu) */}
<Sider
  collapsible={false}
  width={isProjectExpanded ? 240 : 64}
  className="custom-project-sider"
  style={{ backgroundColor: '#f4f5f7' }}
  onClick={(e) => {
    e.stopPropagation();
    setActiveSidebar('project');
  }}
>
  <ProjectSider expanded={isProjectExpanded} projects={userState.myProject || []} />
</Sider>

        {/* 3. Main content */}
        <Layout className="main-content-wrapper" onClick={() => setActiveSidebar(null)}>
          <Content className="main-content-body">
            <Breadcrumb style={{ margin: '16px 0' }}>
              {breadcrumb.map((item, index) => (
                <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
              ))}
            </Breadcrumb>

            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: '#fff',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <Outlet />
            </div>

            <Footer style={{ textAlign: 'center', color: SIDERS.mutedText, padding: '24px 0' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default HomeLayout;