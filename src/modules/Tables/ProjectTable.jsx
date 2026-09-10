import { Space, Table, Input, Button, Image, Tag, Avatar, Popover, AutoComplete, notification } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useAsync } from "../../hooks/useAsync";
import { NavLink, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { removeVietnameseTones } from 'constants/common';
import { LoadingContext } from 'contexts/loading.context';
import { setEditDataProject, setMyProject, setuserSearch } from 'store/actions/user.action';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjectListAPI,
  fetchAddUserAPI,
  fetchDeleteProjectAPI,
  fetchRemoveUserFromProjectAPI,
  fetchProjectDetailAPI,
} from 'services/project';
import ProjectEditForm from 'modules/Forms/ProjectEditForm';

const { Search } = Input;

function ProjectTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const userState = useSelector((state) => state.userReducer);
  const [, setLoadingState] = useContext(LoadingContext);
  const [value, setValue] = useState('');

  // Danh sách user & category trong Redux (đã nạp lúc login / dashboard)
  const userPool = Array.isArray(userState.list) ? userState.list : [];
  const categories = Array.isArray(userState.metaData?.projectCategories) ? userState.metaData.projectCategories : [];
  const currentUserId = userState.userInfor?.id;

  const { state } = useAsync({
    dependencies: [toggle],
    service: () => fetchProjectListAPI(),
  });
  
  const data = Array.isArray(state)
    ? state
    : Array.isArray(state?.resultObject)
      ? state.resultObject
      : [];

  const [ProjectList, setProjectList] = useState(data);

  useEffect(() => {
    if (data.length === 0) return;
    // Project do user tạo
    const mine = data.filter((p) => String(p.creatorId) === String(currentUserId));
    dispatch(setMyProject(mine));
    setProjectList(data);
  }, [data]);

  // Lọc user từ Redux thay vì gọi API
  const fetchGetUser = (keyword) => {
    if (!keyword.trim()) {
      dispatch(setuserSearch([]));
      return;
    }
    const filtered = userPool.filter((u) =>
      removeVietnameseTones(u.name)
        .toLowerCase()
        .includes(removeVietnameseTones(keyword).toLowerCase()),
    );
    dispatch(setuserSearch(filtered));
  };

  const fetchAddUser = async (payload) => {
    setLoadingState({ isLoading: true });
    await fetchAddUserAPI(payload);
    setLoadingState({ isLoading: false });
  };

  const handdleRemoveUser = async (projectId, userId) => {
    setLoadingState({ isLoading: true });
    await fetchRemoveUserFromProjectAPI({ projectId, userId });
    setLoadingState({ isLoading: false });
    setToggle((t) => !t);
  };

  const handleDeleteProject = async (id) => {
    setLoadingState({ isLoading: true });
    await fetchDeleteProjectAPI(id);
    setLoadingState({ isLoading: false });
    notification.success({ description: "Delete Successfully!" });
    setToggle((t) => !t);
    navigate("/project-management/project");
  };

  const handleEditProject = async (id) => {
    setLoadingState({ isLoading: true });
    const result = await fetchProjectDetailAPI(id);
    setLoadingState({ isLoading: false });
    const p = result?.data?.resultObject ?? result?.resultObject ?? result?.data?.content ?? {};
    dispatch(
      setEditDataProject({
        title: "Edit Project",
        setOpen: true,
        infor: <ProjectEditForm />,
        data: {
          id: p.id,
          projectName: p.projectName,
          creatorId: p.creatorId,
          description: p.description,
          categoryId: p.categoryId,
        },
      }),
    );
  };
  
  const creatorName = (creatorId) => {
    console.log("userPool:", userPool, "categories:", categories);
    const u = userPool.find((x) => String(x.id) === String(creatorId));
    return u?.name || `#${creatorId}`;
  };
  const categoryName = (categoryId) => {
    console.log("userPool:", userPool, "categories:", categories);
    const c = categories.find((x) => String(x.id) === String(categoryId));
    return c?.categoryName || c?.name || `#${categoryId}`;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["descend"],
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (_, r) => (
        <NavLink to={`/project-management/project-detail/${r.id}`}>{r.projectName}</NavLink>
      ),
    },
    {
      title: "Category",
      key: "categoryId",
      render: (_, r) => <Tag>{categoryName(r.categoryId)}</Tag>,
    },
    {
      title: "Creator",
      key: "creatorId",
      render: (_, r) => <Tag color="green">{creatorName(r.creatorId)}</Tag>,
    },
    {
      title: "Members",
      key: "members",
      render: (_, r) => {
        const members = Array.isArray(r.members) ? r.members : [];
        return (
          <>
            {members.slice(0, 3).map((m, i) => (
              <Popover
                key={i}
                placement="top"
                title="member"
                content={() => (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>avatar</th>
                        <th>name</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((it, j) => (
                        <tr key={j}>
                          <td>{it.userId}</td>
                          <td>
                            <Image src={it.avatar} preview={false} style={{ borderRadius: "50%" }} />
                          </td>
                          <td>{it.name}</td>
                          <td>
                            <Button
                              shape="circle"
                              size="small"
                              icon={<CloseCircleTwoTone twoToneColor="red" />}
                              onClick={() => handdleRemoveUser(r.id, it.userId)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              >
                <Image src={m.avatar} preview={false} style={{ borderRadius: "50%" }} />
                {i === 2 && members.length > 3 && <Avatar>...</Avatar>}
              </Popover>
            ))}

            <Popover
              placement="topLeft"
              title="Add User"
              content={() => (
                <AutoComplete
                  options={userPool.map((u) => ({ label: u.name, value: String(u.userId) }))}
                  value={value}
                  onChange={setValue}
                  onSelect={(_, opt) => {
                    setValue(opt.label);
                    fetchAddUser({ projectId: r.id, userId: opt.value });
                    setToggle((t) => !t);
                  }}
                  onSearch={fetchGetUser}
                  style={{ width: "100%" }}
                />
              )}
              trigger="click"
            >
              <Button shape="circle">+</Button>
            </Popover>
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} aria-label="Edit project" onClick={() => handleEditProject(r.id)} />
          <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete project" onClick={() => handleDeleteProject(r.id)} />
        </Space>
      ),
    },
  ];

  const onSearch = (keyword) => {
    const kw = removeVietnameseTones(keyword).toLowerCase().trim();
    const filtered = data.filter((e) =>
      removeVietnameseTones(e.projectName).toLowerCase().includes(kw),
    );
    setProjectList(filtered);
  };

  return (
    <>
      <Space direction="vertical" className="mb-3" style={{ width: "100%" }}>
        <Search placeholder="Project's name search" onSearch={onSearch} />
      </Space>
      <div className="text-left mb-3">
        <Button type="primary" onClick={() => navigate("/project-management/create-project")}>
          CREATE
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={ProjectList} />
    </>
  );
}

export default ProjectTable;