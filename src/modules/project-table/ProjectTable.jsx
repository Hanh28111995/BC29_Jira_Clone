import { Space, Table, Input, Button, Image, Tag, Avatar, Popover, AutoComplete } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAsync } from "../../hooks/useAsync";
import { NavLink, useNavigate } from 'react-router-dom';
import {
  EditOutlined,
  DeleteOutlined,
  CloseCircleTwoTone,
  
} from "@ant-design/icons";
import { removeVietnameseTones } from 'constants/common';
import { fetchProjectListAPI } from 'services/project';
import { LoadingContext } from 'contexts/loading.context';
import { fetchGetUserAPI } from 'services/project';
import { setEditDataProject, setMyProject, userSearch } from 'store/actions/user.action';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddUserAPI } from 'services/project';
import { fetchDeleteProjectAPI } from 'services/project';
import { notification } from 'antd';
import { fetchRemoveUserFromProjectAPI } from 'services/project';
import EditForm from 'EditProject/EditForm';
import { fetchProjectDetailAPI } from 'services/project';

const { Search } = Input;


function ProjectTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const userState = useSelector((state) => state.userReducer);

  const { state: data = [] } = useAsync({
    dependencies: [toggle],
    service: () => fetchProjectListAPI(),
  })

  const [ProjectList, setProjectList] = useState(data);
  const [value, setValue] = useState('');
  const [_, setLoadingState] = useContext(LoadingContext);

  const fetchGetUser = async (x) => {
    if (x) {
      setLoadingState({ isLoading: true });
      const result = await fetchGetUserAPI(x);
      setLoadingState({ isLoading: false });
      dispatch(userSearch(result.data.content));
    }
    else {
      dispatch(userSearch([]));
    }
  }
  const fetchAddUser = async (x) => {
    setLoadingState({ isLoading: true });
    const result = await fetchAddUserAPI(x);
    setLoadingState({ isLoading: false });
    // dispatch(userSearch(result.data.content));
  }
  const handleDeleteProject = async (x) => {
    setLoadingState({ isLoading: true });
    await fetchDeleteProjectAPI(x);
    setLoadingState({ isLoading: false });
    notification.success({
      description: " Delete Successfully !",
    });
    setToggle(!toggle);
    navigate("/project-management/project");
  }

  const handleEditProject = async (x) => {
    setLoadingState({ isLoading: true });
    const result = await fetchProjectDetailAPI(x);
    setLoadingState({ isLoading: false });
    console.log(result.data.content)
    dispatch(setEditDataProject(
      {
        title: 'Edit Project',
        setOpen: true,
        infor: <EditForm />,
        data: {
          id: result.data.content.id,
          projectName: result.data.content.projectName,
          creator: result.data.content.creator.id,
          description: result.data.content.description,
          categoryId: result.data.content.projectCategory.id
        },
      }));
  }

  const handdleRemoveUser = async (x, y) => {
    setLoadingState({ isLoading: true });
    await fetchRemoveUserFromProjectAPI({ projectId: x, userId: y })
    setLoadingState({ isLoading: false });
    setToggle(!toggle);
  }

  const searchRef = useRef(null);

  useEffect(() => {
    if (data.length !== 0) {
      let DATA = data.filter((ele) => {
        return ele.creator.id === userState.userInfor.id
      })
      dispatch(setMyProject(DATA));
      setProjectList(data);
    }
  }, [data]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (item2, item1) => {
        return item2.id - item1.id;
      },
      sortDirections: ['descend'],
    },
    {
      title: 'ProjectName',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (_, { projectName, ...props }) => {
        return <NavLink to={`/project-management/project-detail/${props.id}`}>{projectName}</NavLink>
      },
      sorter: (item2, item1) => {
        let projectName1 = item1.projectName?.trim().toLowerCase();
        let projectName2 = item2.projectName?.trim().toLowerCase();
        if (projectName2 < projectName1) {
          return -1;
        }
        return 1;
      },
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (item2, item1) => {
        let categoryName1 = item1.categoryName?.trim().toLowerCase();
        let categoryName2 = item2.categoryName?.trim().toLowerCase();
        if (categoryName2 < categoryName1) {
          return -1;
        }
        return 1;
      },
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
      render: (_, { creator }) => {
        return <Tag color='green' key={creator.id}>{creator.name}</Tag>
      },
      sorter: (item2, item1) => {
        let creator1 = item1.creator?.name.trim().toLowerCase();
        let creator2 = item2.creator?.name.trim().toLowerCase();
        if (creator2 < creator1) {
          return -1;
        }
        return 1;
      },
    },
    {
      title: 'Mem',
      dataIndex: 'members',
      key: 'members',
      render: (_, { members, ...props }) => {
        return (
          <>
            {
              members?.slice(0, 3).map((item, index) => {
                return (
                  <Popover key={index} placement='top' title='member' content={() => {
                    return (
                      <table className='table'>
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>avatar</th>
                            <th>name</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {members?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.userId}</td>
                                <td><Image src={item.avatar}  preview={false} style={{ borderRadius: '50%' }} /></td>
                                <td>{item.name}</td>
                                <td>
                                  <Button shape='circle' style={{ border: 'none', }} size='small' icon={<CloseCircleTwoTone twoToneColor='red' />} onClick={() => handdleRemoveUser(props.id, item.userId)}></Button>
                                </td>
                              </tr>
                            )
                          }
                          )}
                        </tbody>
                      </table>
                    )
                  }}>
                    <Image key={item.userId} src={item.avatar} preview={false} style={{ borderRadius: '50%' }} />
                    {
                      ((index === 2) && (members?.length > 3)) ? <Avatar>...</Avatar> : ''
                    }
                  </Popover>
                )
              })
            }

            {
              <Popover placement='topLeft' title={'Add User'} content={() => {
                return <AutoComplete

                  options={userState.list?.map((user, index) => {
                    return { label: user.name, value: user.userId.toString() }
                  })}
                  value={value}

                  onChange={(text) => {
                    setValue(text);
                  }}
                  onSelect={(value, option) => {
                    setValue(option.label);
                    fetchAddUser({
                      'projectId': props.id,
                      'userId': option.value,
                    });
                    setToggle(!toggle);
                  }
                  }
                  style={{ width: '100%' }}
                  onSearch={(value) => {
                    if (searchRef.current) {
                      clearTimeout(searchRef.current);
                    }
                    searchRef.current = setTimeout(() => {
                      fetchGetUser(value);
                      // console.log(userState.list);
                    }, 500)
                  }}
                />
              }} trigger='click'>
                <Button shape='circle'>+</Button>
              </Popover>
            }
          </>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} aria-label="Edit project" onClick={() => handleEditProject(record.id)} />
          <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete project" onClick={() => handleDeleteProject(record.id)} />
        </Space>
      ),
    },
  ];

  const onSearch = (value) => {
    const keyword = value;
    let DT = data.filter((ele) => {
      return (
        removeVietnameseTones(ele.projectName)
          .toLowerCase()
          .trim()
          .indexOf(removeVietnameseTones(keyword).toLowerCase().trim()) !== -1
      );
    });
    setProjectList(DT);
  }

  return (
    <>
      <Space direction="vertical" className='mb-3' style={{ width: "100%" }}>
        <Search
          placeholder="Project's name search "
          onSearch={onSearch}
        />
      </Space>
      <div className='text-left mb-3'>
        <Button type='primary' onClick={() => navigate('/project-management/create-project')}>
          CREATE
        </Button>
      </div>
      <Table rowKey='id' columns={columns}
        dataSource={ProjectList} />
    </>
  )
}

export default ProjectTable;