import React, { useContext, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { withFormik } from 'formik';
import { connect, useDispatch, useSelector } from 'react-redux';
import { LoadingContext } from 'contexts/loading.context';
import { setEditSubmit } from 'store/actions/user.action';
import { fetchUpdateTaskAPI } from 'services/task'; // Hoặc api update task tương ứng của bạn
import { notification } from 'antd';
import * as Yup from 'yup';

function TaskEditForm(props) {
    const dispatch = useDispatch();
    const {
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
    } = props;

    const submitForm = () => {
        handleSubmit();
    };

    useEffect(() => {
        // Đẩy hàm submit ra ngoài modal chung để kích hoạt khi bấm Save
        dispatch(setEditSubmit(submitForm));
    }, []);

    const handleEditorChange = (content) => {
        setFieldValue('description', content);
    };

    return (
        <form className='container' onSubmit={submitForm}>
            <div className='row'>
                {/* Task Name */}
                <div className='col-12 form-group'>
                    <p className='font-weight-bold'>Task Name</p>
                    <input 
                        className='form-control' 
                        name='taskName' 
                        value={values.taskName} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Project ID & Status ID */}
                <div className='col-6 form-group'>
                    <p className='font-weight-bold'>Project ID</p>
                    <input 
                        disabled 
                        className='form-control' 
                        name='projectId' 
                        value={values.projectId} 
                    />
                </div>
                <div className='col-6 form-group'>
                    <p className='font-weight-bold'>Status ID</p>
                    <input 
                        className='form-control' 
                        type='number'
                        name='statusId' 
                        value={values.statusId} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Priority ID & Task Type ID */}
                <div className='col-6 form-group'>
                    <p className='font-weight-bold'>Priority ID</p>
                    <input 
                        className='form-control' 
                        type='number'
                        name='priorityId' 
                        value={values.priorityId} 
                        onChange={handleChange} 
                    />
                </div>
                <div className='col-6 form-group'>
                    <p className='font-weight-bold'>Task Type ID</p>
                    <input 
                        className='form-control' 
                        type='number'
                        name='taskTypeId' 
                        value={values.taskTypeId} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Estimate Hours & Assignee ID */}
                <div className='col-6 form-group'>
                    <p className='font-weight-bold'>Estimate Hours</p>
                    <input 
                        className='form-control' 
                        type='number'
                        name='estimateHours' 
                        value={values.estimateHours} 
                        onChange={handleChange} 
                    />
                </div>
                <div className='col-6 form-group'>
                    <p className='font-weight-bold'>Assignee ID</p>
                    <input 
                        className='form-control' 
                        type='number'
                        name='assigneeId' 
                        value={values.assigneeId} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Description (TinyMCE) */}
                <div className='col-12 form-group'>
                    <p className='font-weight-bold'>Description</p>
                    <Editor
                        name='description'
                        value={values.description}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: ['lists link image code'],
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
                        }}
                        onEditorChange={handleEditorChange}
                    />
                </div>
            </div>
        </form>
    );
}

const TaskEditFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        // Lấy dữ liệu task được truyền từ Redux khi mở modal
        const task = props.taskEdit || {};
        return {
            taskName: task.taskName || '',
            description: task.description || '',
            estimateHours: task.estimateHours || 0,
            projectId: task.projectId || 0,
            statusId: task.statusId || 0,
            priorityId: task.priorityId || 0,
            taskTypeId: task.taskTypeId || task.typeId || 0,
            assigneeId: task.assigneeId || 0,
        };
    },
    validationSchema: Yup.object().shape({
        taskName: Yup.string().required('Task name is required!'),
    }),
    handleSubmit: async (values, { props }) => {
        try {
            props.setLoadingState(true);
            // Gọi API update task kèm theo ID của task và values mới
            await fetchUpdateTaskAPI(props.taskEdit.taskId || props.taskEdit.id, values);
            props.setLoadingState(false);
            notification.success({ description: 'Update Task Successfully!' });
        } catch (err) {
            props.setLoadingState(false);
            notification.error({ description: 'Update Task Failed!' });
        }
    },
    displayName: 'TaskEditFormik',
})(TaskEditForm);

const TaskEditWrapper = (props) => {
    const [_, setLoadingState] = useContext(LoadingContext);
    return <TaskEditFormik setLoadingState={setLoadingState} {...props} />;
};

const mapStateToProps = (state) => ({
    // Lấy dữ liệu task từ state của Modal chung mà TaskTable đã set vào
    taskEdit: state.userReducer.editDataProject.data,
});

export default connect(mapStateToProps)(TaskEditWrapper);