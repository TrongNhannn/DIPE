import DatatableUI from '../DataTable'

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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faListSquares, faPenToSquare, faSquare, faSquareCheck, faSquareFull, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-indigo/theme.css";



function InfoTable() {
        const [table, setTable] = useState([]);
        const [tables, setTables] = useState([]);
        const MySwal = withReactContent(Swal)
        const _token = localStorage.getItem("_token");
        const { table_id } = useParams();
        const { unique_string, proxy } = useSelector( state => state );

        useEffect(() => {
          async function fetchData() {
            const response = await fetch(`${proxy}/api/${unique_string}/tables/table/${table_id}`, {
                  headers: { 
                    "Authorization": _token, 
                },
                })
                const { data } = await response.json();
                setTables(data);
              }
              fetchData();
        }, [unique_string]);

        useEffect(() => {
            async function fetchData (){
                const response = await fetch(`${proxy}/api/${unique_string}/table/${table_id}/fields`)
                const res = await response.json()
                const { fields, constraints } = res;
                if( constraints != undefined ){
                    const bindedFields = fields.map( field => {
                        const fieldConstraints = constraints.filter( constr => constr.field_id === field.field_id );                
                        const constraint_types = fieldConstraints.map( constr => constr.constraint_type );
                        field.constraint_types = constraint_types.join(", ");
                        return { ...field };
                    })
                    //console.log( bindedFields )
                    setTable( bindedFields )
                }else{
                    setTable( fields )
                }            
            }
            fetchData();
          
        }, []);

    const deleteRow = async (credential_string) => {
      const result = await Swal.fire({
        title: 'Xóa',
        text: 'Bạn có muốn xóa bảng ' +tables.table_name,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: 'rgb(209, 72, 81)',
        cancelButtonColor: '#C1C1C1',
        reverseButtons: true
      });
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${proxy}/api/${unique_string}/tables/drop/${table_id}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (data.success == true) {
            MySwal.fire({
              title: <strong>Xóa</strong>,
              text: data.content,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(function(){ 
              window.location.href = '/database';
          })
          } else {
            MySwal.fire({
              title: <strong>Xóa</strong>,
              text: data.content,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            })
          }
        } catch (error) {
          console.error('There was a problem with the network:', error);
          Swal.fire('Oops...', 'Something went wrong!', 'error');
        }
      }
    };

    const deleteField = async (field_id) => {
      const result = await Swal.fire({
        title: 'Xóa',
        text: 'Bạn có muốn xóa trường' +`${field_id}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: 'rgb(209, 72, 81)',
        cancelButtonColor: '#C1C1C1',
        reverseButtons: true
      });
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${proxy}/api/${unique_string}/table/field_drop/${field_id}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (data.success == true) {
            MySwal.fire({
              title: <strong>Xóa</strong>,
              text: data.content,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(function(){ 
              window.location.href = `/database/${table_id}`;
          })
          } else {
            MySwal.fire({
              title: <strong>Xóa</strong>,
              text: data.content,
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            })
          }
        } catch (error) {
          console.error('There was a problem with the network:', error);
          Swal.fire('Oops...', 'Something went wrong!', 'error');
        }
      }
    };

    const renderButtons = (rowData) => {
        return (
          <React.Fragment>
            <Link title='Cập nhật thông tin trường' className='btn btn-outline blue' to={`/database/change/field/${rowData.field_id}/${table_id}`} ><FontAwesomeIcon icon={faPenToSquare}/></Link>{'\u00A0'}
            <a className='btn btn-outline red' title='Xóa' onClick={() => deleteField(rowData.field_id)}><FontAwesomeIcon icon={faTrash}/></a>
             <input type="hidden"  name="userId"  value={rowData.field_id}/>
          </React.Fragment>
         
        );
      };

      
        const checkboxBody = (rowData) => {
          return rowData.nullable === 1 ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />;
        };

      const columns = [
        { field: 'field_name', header: 'Tên trường' },
        { field: 'field_data_type', header: 'Kiểu dữ liệu' },
        { body: checkboxBody, header: 'Null' },
        { field: 'constraint_types', header: 'Ràng buộc' },
        { body: renderButtons, header: 'Thao tác' }
      ];

        return (
        <div className='main-panel'>
            <DatatableUI />
    
            <div className='body-panel'>
              <div className='row'>
                <div className='panel-box'>
                  <div className='panel-box-header'>
                    <span className='panel-label-header'>Cơ sở dữ liệu </span>
                    <div className='right-content'><Link className='btn btn-outline red'  onClick={() => deleteRow()}>Xóa bảng</Link></div>
                    <div className='right-content'><Link className='btn btn-outline green' to={`/database/update/table/${table_id}`}>Cập nhật bảng</Link></div>
                    <div className='right-content'><Link className='btn btn-outline blue' to={`/database/add/field/${table_id}`}>Thêm trường</Link></div>
                  </div>
                  <div className='panel-box-body'>
                  <DataTable showGridlines
                        value={table}
                        scrollable
                        paginator
                        rows={10}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="Hiện {first} đến {last} của {totalRecords} kết quả" 
                    >
                        {columns.map((col, i) => (
                            <Column key={i} field={col.field} header={col.header} body={col.body} />
                        ))}   
                    </DataTable>
                </div>
                </div>
              </div>
            </div>
            </div>
        );
    
}

export default InfoTable;