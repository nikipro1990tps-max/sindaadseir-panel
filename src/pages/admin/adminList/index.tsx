import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { userApiService } from '../../../api/services/user.api';
import { MyToast } from '../../../components/Elements/MyToast';
import ConfirmAlert from '../../../components/Elements/ConfirmAlert';
import RoleModalSelectInput from '../roleList/RoleModalSelectInput';
import AdminModal from './AdminModal';
import InputLabel from '../../../components/Elements/InputLabel';
import IconPlus from '../../../components/Icon/IconPlus';
import AdminListTable from './AdminListTable';
import UserModalChangeStatus from '../../../components/User/UserModalChangeStatus';
import FloatingInput from '../../../components/Elements/FloatingInput';

function AdminListPage() {

    const dispatch = useDispatch()
    const { t } = useTranslation(["admin"])

    const [assignRoleModal, setAssignRoleModal] = useState<any>(null)
    const [openAdminModal, setOpenAdminModal] = useState<any>(null)
    const [statusModal, setStatusModal] = useState<any>(null)
    const [filters, setFilters] = useState({ name: "", page: 1, take: 10 })
    const [list, setList] = useState({ data: [], count: 0 })


    async function fetchData() {

        try {

            setList({ data: [], count: 0 })

            const { users, count } = await userApiService.admins(filters)

            setList({ data: users, count })

        } catch (error) {
            // do something
        }
    }


    async function openDeleteModal(row: any) {



        ConfirmAlert({
            title: t("delete_title", { item: row.name }),
            text: t("sure_delete_text", { item: row.name }),
            onConfirm: async () => {
                try {

                    await userApiService.deleteUser(row.id)

                    MyToast.success(`${t("delete_success")}`)


                    fetchData()
                } catch (error) {

                }
            }
        })
    }

    async function doAssignModal(userId: number, values: any) {

        try {
            await userApiService.assignRole(userId, values.map((x: any) => x.id))
            setAssignRoleModal(null)
            fetchData()
        } catch (error) {

        }
    }



    function handleActionClick(key: string, row: any) {

        if (key == 'changeStatus') {
            setStatusModal(row)
        } else if (key == 'assignRole') {
            setAssignRoleModal(row)
        } else if (key == 'update') {
            setOpenAdminModal(row)
        } else if (key == 'delete') {
            openDeleteModal(row)
        }
    }

    useEffect(() => {
        dispatch(setPageTitle(t("admin:admin.adminList")));

    }, [])


    useEffect(() => {

        fetchData()
    }, [filters]);




    return (
        <div className='panel'>

            {statusModal &&
                <UserModalChangeStatus

                    userId={statusModal.id}
                    status={statusModal.status}
                    onClose={() => setStatusModal(null)}
                    onSubmit={() => { fetchData() }}

                />
            }

            {assignRoleModal &&
                <RoleModalSelectInput
                    values={assignRoleModal.roles}
                    closeHandler={() => setAssignRoleModal(null)}
                    submitHandler={(values) => { doAssignModal(assignRoleModal.id, values) }}

                />
            }


            {
                openAdminModal &&
                <AdminModal
                    user={openAdminModal}
                    onSubmit={() => { fetchData() }}
                    onClose={() => { setOpenAdminModal(null) }}
                />
            }


            <h1 className='p-4 text-lg font-bold'>{t('admin:admin.adminList')}</h1>

            {/* filters */}
            <div className='flex flex-wrap justify-between items-center gap-4 p-2 mb-4'>

                <FloatingInput
                    value={filters.name}
                    label={`${t('name')}`}
                    onChange={(e) => { setFilters({ ...filters, name: e.target.value }) }}
                />

                <button type="button" className="btn btn-primary" onClick={() => setOpenAdminModal(true)}>{t("add")}<IconPlus /></button>

            </div>



            <AdminListTable
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


export default AdminListPage;
