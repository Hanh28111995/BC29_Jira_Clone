import { Editor } from '@tinymce/tinymce-react';
import { LoadingContext } from 'contexts/loading.context';
import { withFormik } from 'formik';
import React, { useContext, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUpdateProjectDetailAPI } from 'services/project';
import { setEditSubmit } from 'store/actions/user.action';
import * as Yup from 'yup';

function ProjectEditForm(props) {
    const userState = useSelector((state) => state.userReducer);
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
        // Đẩy hàm submit ra ngoài để Modal tổng có thể gọi khi bấm nút Save/OK
        dispatch(setEditSubmit(submitForm));
    }, []);

    const handleEditorChange = (content, editor) => {
        setFieldValue('description', content);
    };

    return (
        <form className='container' onSubmit={submitForm} onChange={handleChange}>
            <div className='row'>
                <div className='col-4'>
                    <div className='form-group'>
                        <p className='font-weight-bold'>Project Id</p>
                        <input 
                            disabled 
                            className='form-control' 
                            name='id'
                            value={values.id}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='col-4'>
                    <div className='form-group'>
                        <p className='font-weight-bold'>Project Name</p>
                        <input 
                            className='form-control' 
                            name='projectName'
                            value={values.projectName}
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className='col-4'>
                    <div className='form-group'>
                        <p className='font-weight-bold'>Category</p>
                        <select 
                            name="categoryId" 
                            className='form-control'
                            value={values.categoryId} // Sửa từ defaultValue thành value để Formik kiểm soát chuẩn xác
                            onChange={handleChange}
                        >
                            {
                                userState?.category?.map((item, index) => {
                                    return <option value={item.id} key={index}>{item.projectCategoryName}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='form-group'>
                        <p className='font-weight-bold'>Description</p>
                        <Editor
                            name='description'
                            value={values.description}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

const ProjectEditFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        return {
            id: props.projectEdit?.id || '',
            projectName: props.projectEdit?.projectName || '',
            creator: props.projectEdit?.creator || '',
            description: props.projectEdit?.description || '',
            categoryId: props.projectEdit?.categoryId || '',
        }
    },
    validationSchema: Yup.object().shape({
        projectName: Yup.string().required('Project name is required!'),
    }),
    handleSubmit: async (values, { props }) => {
        try {
            props.setLoadingState(true);
            await fetchUpdateProjectDetailAPI(props.projectEdit.id, values);
            props.setLoadingState(false);
            // Có thể thêm thông báo thành công hoặc đóng modal tại đây nếu cần
        } catch (err) {
            props.setLoadingState(false);
            console.log("Error updating project:", err);
        }
    },
    displayName: 'ProjectEditFormik',
})(ProjectEditForm);

const ProjectEditWrapper = (props) => {
    const navigate = useNavigate();
    const [_, setLoadingState] = useContext(LoadingContext);

    return <ProjectEditFormik navigate={navigate} setLoadingState={setLoadingState} {...props} />;
}

const mapStateToProps = (state) => ({
    projectEdit: state.userReducer.detail.data,
    // Không cần lấy category ở đây nữa vì bên trong component đã dùng useSelector gọi trực tiếp userState.category
});

export default connect(mapStateToProps)(ProjectEditWrapper);