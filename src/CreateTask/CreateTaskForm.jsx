import "./index.scss";
import { Editor } from '@tinymce/tinymce-react';
import { useAsync, useAsyncMutation } from 'hooks/useAsync';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEditSubmit, setMyProject, setProjectMemList } from 'store/actions/user.action';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { notification, Select, Slider } from 'antd';
import { 
    fetchProjectListAPI     
} from "services/project";
import { AddTaskApi } from "services/task";

function CreateTaskForm(props) {
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.userReducer);

    // 1. Chỉ gọi API lấy danh sách Project (nếu cần), còn lại lấy từ Redux
    const { data: projects = [] } = useAsync({
        service: fetchProjectListAPI,
    });

    // Lấy taskType, priority, status trực tiếp từ Redux store của bạn
    const taskTypes = userState.arrTaskType || [];
    const priorities = userState.arrPriority || [];
    const statusList = userState.arrStatus || [];

    const [OriginalTime, setOriginalTime] = useState(0);
    const [TimeTracking, setTimeTracking] = useState({
        timeTrackingSpent: 0,
        timeTrackingRemaining: 0,
    });

    const {
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
    } = props;

    // Lọc danh sách project do chính user tạo
    const myProjects = projects.filter((ele) => ele.creator?.id === userState.userInfor?.id);

    // 2. Map danh sách member từ projectMemList trong Redux
    const listOption = (userState.projectMemList || []).map((item) => ({
        value: item.userId || item.id,
        label: item.name || item.userName
    }));

    const submitForm = () => {
        handleSubmit();
    };

    useEffect(() => {
        if (myProjects.length > 0) {
            dispatch(setMyProject(myProjects));
            if (!values.projectId) {
                setFieldValue('projectId', myProjects[0].id);
                dispatch(setProjectMemList(myProjects[0].members || []));
            }
        }
    }, [projects]);

    useEffect(() => {
        dispatch(setEditSubmit(submitForm));
    }, []);

    const handleEditorChange = (content) => {
        setFieldValue('description', content);
    };

    return (
        <form className='container' onSubmit={submitForm}>
            <div className='form-group'>
                <p className='font-weight-bold'>Project </p>
                <select 
                    name="projectId" 
                    className='form-control' 
                    value={values.projectId} 
                    onChange={(e) => {
                        let { value } = e.target;
                        setFieldValue('projectId', value);
                        
                        const selectedProject = myProjects.find(p => String(p.id) === String(value));
                        if (selectedProject) {
                            dispatch(setProjectMemList(selectedProject.members || []));
                        }
                    }}
                >
                    {myProjects.map((project, index) => (
                        <option key={index} value={project.id}>{project.projectName}</option>
                    ))}
                </select>
            </div>
            
            <div className='form-group'>
                <p className='font-weight-bold'>Task Name </p>
                <input name="taskName" className='form-control' onChange={handleChange} value={values.taskName} />
            </div>

            <div className='form-group'>
                <p className='font-weight-bold'>Status </p>
                <select name="statusId" className='form-control' onChange={handleChange} value={values.statusId}>
                    {statusList.map((item, index) => (
                        <option key={index} value={item.statusId}>{item.statusName}</option>
                    ))}
                </select>
            </div>

            <div className='form-group'>
                <div className='row'>
                    <div className='col-6'>
                        <p className='font-weight-bold'>Priority</p>
                        <select name="priorityId" className='form-control' onChange={handleChange} value={values.priorityId}>
                            {priorities.map((priority, index) => (
                                <option key={index} value={priority.priorityId}>{priority.priority}</option>
                            ))}
                        </select>
                    </div>
                    <div className='col-6'>
                        <p className='font-weight-bold'>Task Type</p>
                        <select name="typeId" className='form-control' onChange={handleChange} value={values.typeId}>
                            {taskTypes.map((taskType, index) => (
                                <option key={index} value={taskType.id}> {taskType.taskType} </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className='form-group'>
                <div className='row'>
                    <div className='col-6'>
                        <p className='font-weight-bold'>Assignees</p>
                        <Select
                            mode="multiple"
                            size="middle"
                            placeholder="Please select"
                            onChange={(selectedValues) => {
                                setFieldValue('listUserAsign', selectedValues);
                            }}
                            style={{ width: '100%' }}
                            optionFilterProp="label"
                            options={listOption}
                        />
                        <div className="row">
                            <div className="col-12" style={{ marginTop: '27px' }}>
                                <p className='font-weight-bold'>Original Estimate</p>
                                <input 
                                    className="form-control" 
                                    type='number' 
                                    min='0' 
                                    defaultValue='0' 
                                    name="originalEstimate" 
                                    onChange={(e) => {
                                        setOriginalTime(e.target.value);
                                        setFieldValue('originalEstimate', Number(e.target.value));
                                    }}
                                    onBlur={() => { 
                                        setFieldValue('timeTrackingRemaining', Number(OriginalTime) - Number(TimeTracking.timeTrackingSpent));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-6'>
                        <p className='font-weight-bold'>Time Tracking</p>
                        <Slider 
                            value={Number(TimeTracking.timeTrackingSpent)}
                            max={Number(OriginalTime) || 100}
                        />
                        <div className="row">
                            <div className="col-6 text-left note-font">{TimeTracking.timeTrackingSpent || '0'}h logged</div>
                            <div className="col-6 text-right note-font">{TimeTracking.timeTrackingRemaining || '0'}h remaining</div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6">
                                <p className='font-weight-bold'>Time spent </p>
                                <input 
                                    className="form-control" 
                                    type='number' 
                                    name="timeTrackingSpent" 
                                    defaultValue='0' 
                                    onChange={(e) => {
                                        let spent = Number(e.target.value);
                                        let remaining = Number(OriginalTime) - spent;
                                        setTimeTracking({
                                            timeTrackingRemaining: remaining,
                                            timeTrackingSpent: spent,
                                        });
                                        setFieldValue('timeTrackingSpent', spent);
                                        setFieldValue('timeTrackingRemaining', remaining);
                                    }} 
                                />
                            </div>
                            <div className="col-6">
                                <p className='font-weight-bold'>Time remain </p>
                                <input className="form-control" type='number' value={Number(OriginalTime) - Number(TimeTracking.timeTrackingSpent)} disabled name="timeTrackingRemaining" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-12 px-0'>
                <div className='form-group'>
                    <p className='font-weight-bold'>Description</p>
                    <Editor
                        name='description'
                        initialValue=''
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                            toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onEditorChange={handleEditorChange}
                    />
                </div>
            </div>
        </form>
    );
}

const CreateTaskWrapper = (props) => {
    const navigate = useNavigate();
    
    const { mutate: createTask } = useAsyncMutation({
        service: AddTaskApi,
        onSuccess: () => {
            notification.success({ description: "Tạo task thành công!" });
        },
        onError: (err) => {
            notification.warning({
                description: err?.response?.data?.content || err?.message || "Tạo task thất bại",
            });
        }
    });

    const CreateTaskFormFormik = React.useMemo(() => {
        return withFormik({
            enableReinitialize: true,
            mapPropsToValues: (innerProps) => ({
                taskName: '',
                description: '',
                statusId: '1',
                originalEstimate: 0,
                timeTrackingSpent: 0,
                timeTrackingRemaining: 0,
                projectId: innerProps.myProject[0]?.id || 0,
                typeId: 1,
                priorityId: 1,
                listUserAsign: [],
            }),
            validationSchema: Yup.object().shape({
                taskName: Yup.string().required('Task name is required!'),
            }),
            handleSubmit: (values) => {
                createTask(values);
            },
            displayName: 'CreateTaskFormit',
        })(CreateTaskForm);
    }, [createTask]);

    const myProject = useSelector((state) => state.userReducer.myProject);

    return <CreateTaskFormFormik navigate={navigate} myProject={myProject} {...props} />;
};

const mapStateToProps = (state) => ({
    myProject: state.userReducer.myProject
});

export default connect(mapStateToProps)(CreateTaskWrapper);