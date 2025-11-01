import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { roleApiService } from '../../../api/services/role.api';
import InputLabel from '../../../components/Elements/InputLabel';
import IconPlus from '../../../components/Icon/IconPlus';
import RolePermissionsModal from './roleModal'
import RoleListTable from './RoleListTable';
import ConfirmAlert from '../../../components/Elements/ConfirmAlert';
import { MyToast } from '../../../components/Elements/MyToast';

const RoleListPage = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation(["admin"])

    // states
    const [filters, setFilters] = useState({ search: "", page: 1, take: 10 })
    const [list, setList] = useState({ data: [], count: 0 })
    const [permissions, setPermissions] = useState<any>(null)
    const [roleModal, setRoleModal] = useState<any>(null)

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


    function handleActionClick(key: string, row: any) {

        if (key == 'update') {
            setRoleModal(row)
        } else if (key == 'delete') {
            openDeleteModal(row)
        }
    }

    async function openDeleteModal(row: any) {



        ConfirmAlert({
            title: t("delete_title", { item: row.name }),
            text: t("sure_delete_text", { item: row.name }),
            onConfirm: async () => {
                try {

                    await roleApiService.delete(row.id)

                    MyToast.success(`${t("delete_success")}`)


                    fetchData()
                } catch (error) {

                }
            }
        })




    }

    useEffect(()=>{
        dispatch(setPageTitle(t("admin:roleList")));
        fetchPermissions()

    },[])

    useEffect(() => {

        fetchData()
    }, [filters]);

    return (
        <div className='panel'>

            {(roleModal && permissions) &&
                <RolePermissionsModal
                    permissionsList={permissions}
                    rolePermissions={(typeof roleModal == 'boolean') ? null : roleModal}
                    submitHandler={() => { fetchData() }}
                    closeHandler={() => setRoleModal(null)}
                />
            }


            <h1 className='p-4 text-lg font-bold'>{t('admin:role.roleList')}</h1>


            {/* filters */}
            <div className='flex flex-wrap justify-between items-center gap-4 p-2 mb-4'>

                <InputLabel
                    value={filters.search}
                    placeholder={`${t('admin:role.search')}`}
                    onChange={(search) => { setFilters({ ...filters, search }) }}

                />

                <button type="button" className="btn btn-primary" onClick={() => setRoleModal(true)}>{t("add")}<IconPlus /></button>

            </div>



            <RoleListTable
                list={list.data}
                total={list.count}
                page={filters.page}
                take={filters.take}
                onChangeFilters={(filters: any) => { setFilters({ ...filters }) }}
                handleActionClick={(action, row) => { handleActionClick(action, row) }}
            />

        </div>
    );
};

export default RoleListPage;
