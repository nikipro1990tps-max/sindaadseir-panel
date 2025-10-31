import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { roleApiService } from '../../../api/services/role.api';
import InputLabel from '../../../components/Elements/InputLabel';
import IconPlus from '../../../components/Icon/IconPlus';
import RolePermissionsModal from './roleModal'
import RoleListTable from './RoleListTable';

const RoleListPage = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation(["admin"])

    // states
    const [filters, setFilters] = useState({ search: "", page: 1, take: 10 })
    const [list, setList] = useState({ data: [], count: 0 })
    const [permissions, setPermissions] = useState([])
    const [openRoleModal, setOpenRoleModal] = useState<any>(null)
    const [deleteModal, setDeleteModal] = useState(null)

    async function fetchData() {

        try {

            setList({ data: [], count: 0 })

            const { roles, count } = await roleApiService.roles(filters)

            setList({ data: roles, count })

        } catch (error) {
            // do something
        }
    }


    async function fetchPermissions() {
        try {

            setPermissions([])

            const permissions = await roleApiService.permissions()

            setPermissions(permissions)

        } catch (error) {
            // do something
        }
    }


    function handleActionClick(key: string, row: any){

        if (key == 'update'){
            setOpenRoleModal(row)
        }else if (key == 'delete'){

        }
    }

    useEffect(() => {
        dispatch(setPageTitle(t("admin:roleList")));

        fetchData()
        fetchPermissions()
    }, [filters]);

    return (
        <div className='panel'>


            {openRoleModal &&
                <RolePermissionsModal
                    permissionsList={permissions}
                    rolePermissions={(!openRoleModal || typeof openRoleModal == 'boolean') ? null : openRoleModal}
                    submitHandler={() => { console.log(444444444) }}
                    closeHandler={() => setOpenRoleModal(null)}
                />
            }

            <h1 className='p-4 m-2'>{t('admin:roleList')}</h1>



            {/* filters */}
            <div className='flex flex-wrap justify-between items-center gap-4 p-2 mb-4'>



                <InputLabel
                    value={filters.search}
                    placeholder="نام نقش را جستجو کنید"
                    onChange={(search) => { setFilters({ ...filters, search }) }}

                />

                <button type="button" className="btn btn-primary" onClick={() => setOpenRoleModal(true)}>{t("add")}<IconPlus /></button>

            </div>



            <RoleListTable
                list={list.data}
                total={list.count}
                page={filters.page}
                take={filters.take}
                onChangeFilters={(filters: any) => { setFilters({ ...filters }) }}
                handleActionClick={(action, row) => { handleActionClick(action , row) }}
            />

        </div>
    );
};

export default RoleListPage;
