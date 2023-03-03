import classNames from 'classnames/bind'
import styles from './Database.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTable } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

const cx = classNames.bind(styles)

function DataTable() {

    const { unique_string, proxy } = useSelector( state => state );
    const [database, setDatabase] = useState([])

    useEffect(() => {
        async function fetchData (){
            const response = await fetch(`${proxy}/api/${unique_string}/tables/getall`)
            const resp = await response.json()
            const {success, data, content } = resp;
            let database;
            if( success ){
                database = [ ...data ]
            }else{
                database = []
                console.log( content )
            }
            setDatabase(database)
        }
        fetchData();
       
    }, []);

    return <div className='main-panel'>
    <div className={cx('sidebar', 'sidebarmb')} id="slider">
    <ul className={cx('nav', 'group-menu')}>
        <li id="tongquan" className={cx('nav-item', 'active')}>
            <Link className={cx('nav-link')} to={"/database/add/table"}>
                <p>
                    <FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Thêm bảng
                </p>
            </Link>
        </li>
    </ul>
    <br />
    <br />
    { database.length > 0   ? database.map (item => (
        <ul className={cx('nav', 'group-menu')} key={ item.table_id }>
            <li id="tongquan" className={cx('nav-item', 'active')}>
                <a className={cx('nav-link')} href={`/database/${item.table_id}`}>
                    <p>
                        <FontAwesomeIcon icon={faTable}/>&nbsp;&nbsp;{ item.table_name }
                    </p>
                </a>
                <input type='hidden' value={item.table_id}/>
            </li>
        </ul>
    )) : null }
</div>
</div>
}

export default DataTable;