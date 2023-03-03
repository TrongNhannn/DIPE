import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";     
import { Link, useParams } from 'react-router-dom';


function AddFields() {
        const MySwal = withReactContent(Swal)
        const _token = localStorage.getItem("_token");
        const { unique_string, proxy } = useSelector( state => state );
        const [field_name, setFieldname] = useState('');
        const [field_data_type, setFielddata] = useState('');
        const [default_value, setDefault] = useState('');
        const { table_id } = useParams();
        const [constraint_types, setConstraint_types] = useState({});
        const [nullables, setNullable] = useState({});
        const [selectedOption, setSelectedOption] = useState(null);

        const handleSelectOption = (option) => {
          setSelectedOption(option);
        };

        const handleCheckconstraint_type = (e) => {
          const { name, checked } = e.target;
          setConstraint_types({ ...constraint_types, [name]: checked });
        };

        const handleChecknullable = (e) => {
          const { name, checked } = e.target;
          setNullable({ ...nullables, [name]: checked });
        };
      

          const handleButtonClick = async(event) => {
            const selectedItems = Object.keys(constraint_types).filter(
              (key) => constraint_types[key]
            );

            const selectedNull = Object.keys(nullables).filter(
              (key) => nullables[key]
            );
            
            if(selectedItems.length == 0){
              const nullable = selectedNull
              const field_props = ''
              const value = { table_id, field_name, nullable, field_props, field_data_type, default_value };
              event.preventDefault();
              const response = await fetch(`${proxy}/api/${unique_string}/table/create/field`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  "Authorization": _token, 
              },
                body: JSON.stringify(value)
              })
              const data = await response.json();
                if (data.success == true) {
                  MySwal.fire({
                    title: <strong>Thêm</strong>,
                    text: data.content,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                  })
                } else {
                  MySwal.fire({
                    title: <strong>Thêm</strong>,
                    text: data.content,
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false,
                  })
                }
            }
            else{
              const field_props = ""
              const reference_on = -1
              const check_fomular  = "NONE";
              const check_on_field = "false";
              const default_check_value = ""
              const nullable = selectedNull
              const constraint_type = selectedItems
              
              const value = { table_id, field_name, nullable, field_props, field_data_type, default_value, constraint_type, reference_on, check_fomular, check_on_field, default_check_value };
              event.preventDefault();
              const response = await fetch(`${proxy}/api/${unique_string}/table/create/field_constraint`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  "Authorization": _token, 
              },
                body: JSON.stringify(value)
              })
              const data = await response.json();
                if (data.success == true) {
                  MySwal.fire({
                    title: <strong>Thêm</strong>,
                    text: data.content,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                  })
                } else {
                  MySwal.fire({
                    title: <strong>Thêm</strong>,
                    text: data.content,
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false,
                  })
                }
              
              }
            
          }

        return (
            <div className='main-panel'>
              <div className='row'>
                <div className='panel-box'>
                  <div className='panel-box-header'>
                    <span className='panel-label-header'>Thêm mới trường</span>
                  </div>
                  <div className='panel-box-body'>
                    <div className='row'>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' >ID bảng{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                        <input type='text' className='form-control pt-8' required readOnly defaultValue={table_id}  ></input>
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Tên trường {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                          <input type='text' className='form-control pt-8' value={field_name} onChange={(event) => setFieldname(event.target.value)} ></input>
                      </div>
                      <div className='form-horizontal form group '>
                      <label className='label-control lable-pt' required >Khóa {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                        <label className='lable-check'>Chính{'\u00A0'}
                          <input
                            type="checkbox"
                            name="pk"
                            checked={constraint_types.pk || false}
                            onChange={handleCheckconstraint_type}
                            
                          />
                        </label>
                        <br />
                        <label className='lable-check'>
                        Ngoại{'\u00A0'}
                          <input
                            type="checkbox"
                            name="fk"
                            
                            checked={constraint_types.fk || false}
                            onChange={handleCheckconstraint_type}
                          />
                        </label>

                        <label className='label-control lable-pt' required >Null {'\u00A0'}{'\u00A0'}</label>
                        <label className='lable-check'>Null{'\u00A0'}
                          <input
                            type="checkbox"
                            name="1"
                            value='1'
                            checked={nullables[1] || false}
                            onChange={handleChecknullable}
                            onClick={() => {
                              if (selectedOption === "1") {
                                setSelectedOption("1");
                              } else {
                                handleSelectOption("1");
                              }
                            }}
                          />
                        </label>
                        <br />
                        <label className='lable-check'>
                        Không Null{'\u00A0'}
                          <input
                            type="checkbox"
                            name="0"
                            value='0'
                            checked={nullables[0] || false}
                            onChange={handleChecknullable}
                            onClick={() => {
                              if (selectedOption === "0") {
                                setSelectedOption("0");
                              } else {
                                handleSelectOption("0");
                              }
                            }}
                          />
                        </label>
                      </div>
                      {/* <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Bảng ràng buộc {'\u00A0'}</label>
                        <select name="example" className='form-control pt-8'>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="-">Other</option>
                        </select>
                      </div> */}
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Kiểu dữ liệu {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</label>
                          <input type='text' className='form-control pt-8' value={field_data_type} onChange={(event) => setFielddata(event.target.value)} ></input>
                      </div>
                      <div className='form-horizontal form group'>
                        <label className='label-control lable-pt' required >Giá trị mặc định {'\u00A0'}</label>
                          <input type='text' className='form-control pt-8' value={default_value} onChange={(event) => setDefault(event.target.value)} ></input>
                      </div>
                    </div>
                  </div>
                  <div className='panel-box-footer'>
                    <button className='btn btn-success' onClick={handleButtonClick}>Lưu lại</button>
                    <Link className='btn btn-default' to={`/database/${table_id}`}>Quay lại</Link>
                  </div>
                </div>
              </div>
            </div>
        );
}


export default AddFields;