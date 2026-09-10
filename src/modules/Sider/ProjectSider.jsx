import React from 'react';
import { Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  SettingOutlined,
  BarsOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SendOutlined,
  InboxOutlined,
  FolderOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import './index.scss';

const PROJECT_GROUPS = [
  {
    title: "PLANNING",
    items: [
      { key: "/board", label: "Board", icon: <AppstoreOutlined /> },
      { key: "/backlog", label: "Backlog", icon: <BarsOutlined /> },
      { key: "/reports", label: "Reports", icon: <SendOutlined /> },
    ],
  },
  {
    title: "DEVELOPMENT",
    items: [
      { key: "/releases", label: "Releases", icon: <SendOutlined /> },
      { key: "/issues", label: "Issues and Filters", icon: <UnorderedListOutlined /> },
      { key: "/components", label: "Components", icon: <InboxOutlined /> },
      { key: "/pages", label: "Pages", icon: <FileTextOutlined /> },
    ],
  },
  {
    title: "SETTINGS",
    items: [{ key: "/project-settings", label: "Project Settings", icon: <SettingOutlined /> }],
  },
];


// Item active khi pathname khớp key hoặc bắt đầu bằng key + "/"
const isItemActive = (key, pathname) => pathname === key || pathname.startsWith(`${key}/`);

export default function ProjectSider({ expanded = false, projects = [] }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Project đang mở (từ /project-detail/:id)
  const activeProjectId = (() => {
    const m = pathname.match(/\/project-detail\/([^/]+)/);
    return m ? m[1] : null;
  })();

  const go = (path) => navigate(path);

  // Render một item custom: expanded -> icon + label, collapsed -> icon + Tooltip
  const renderItem = (key, label, icon, active, onGo) => {
    const body = (
      <div
        key={key}
        role="menuitem"
        tabIndex={0}
        className={`ps-item${active ? ' active' : ''}`}
        onClick={onGo}
        onKeyDown={(e) => e.key === 'Enter' && onGo()}
      >
        <span className="ps-item-icon">{icon}</span>
        {expanded && <span className="ps-item-label">{label}</span>}
      </div>
    );
    return expanded ? body : (
      <Tooltip key={key} title={label} placement="right">
        {body}
      </Tooltip>
    );
  };

  return (
    <div className="project-sider">
      {/* Nút tạo project */}
      <div className="ps-head">
        {renderItem(
          'create-project',
          'Create project',
          <PlusOutlined />,
          false,
          () => go('/project-management/create-project'),
        )}
      </div>

      {/* Danh sách project của user */}
      <div className="ps-section">
        {expanded && <div className="ps-section-title">YOUR PROJECTS </div>}
        {expanded && projects.length === 0 && (
          <div className="ps-empty"> <p className="ps-empty-text mb-0">No projects yet</p></div>          
        )}        
        {expanded && projects.length > 0 && (
          <div className="ps-empty"> <a className="ps-empty-link" onClick={() => go('/project-management')}>
        View {projects.length} projects
      </a></div>          
        )}        
      </div>

      {/* Các nhóm menu tĩnh */}
      {PROJECT_GROUPS.map((group) => (
        <div className="ps-section" key={group.title}>
          {expanded && <div className="ps-section-title">{group.title}</div>}
          {group.items.map((item) =>
            renderItem(item.key, item.label, item.icon, isItemActive(item.key, pathname), () => go(item.key)),
          )}
        </div>
      ))}
    </div>
  );
}