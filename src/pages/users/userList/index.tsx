import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { userApiService } from '../../../api/services/user.api';
import { MyToast } from '../../../components/Elements/MyToast';
import ConfirmAlert from '../../../components/Elements/ConfirmAlert';
import InputLabel from '../../../components/Elements/InputLabel';
import UserModalChangeStatus from './UserModalChangeStatus';
import UserModal from './UserModal';
import UserListTable from './UserListTable';

function UserListPage() {

    const dispatch = useDispatch()
    const { t } = useTranslation(["user"])

    const [statusModal, setStatusModal] = useState<any>(null)
    const [openUserModal, setOpenUserModal] = useState<any>(null)
    const [filters, setFilters] = useState({ name: "", page: 1, take: 10 })
    const [list, setList] = useState({ data: [], count: 0 , isLoading: false })

    async function fetchData() {


        try {

            setList({ data: [], count: 0 , isLoading : true })

            const { users, count } = await userApiService.users(filters)

            setList({ data: users, count , isLoading : false })

        } catch (error) {
            // do something

            setList({ data: [], count: 0 , isLoading : false })

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



    function handleActionClick(key: string, row: any) {

        if (key == 'changeStatus') {
            setStatusModal(row)
        } else if (key == 'update') {
            setOpenUserModal(row)
        } else if (key == 'delete') {
            openDeleteModal(row)
        }
    }

    useEffect(() => {
        dispatch(setPageTitle(t("user:user.userList")));

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


            {
                openUserModal &&
                <UserModal
                    user={openUserModal}
                    onSubmit={() => { fetchData() }}
                    onClose={() => { setOpenUserModal(null) }}
                />
            }


            <h1 className='p-4 text-lg font-bold'>{t('user:user.userList')}</h1>


            {/* filters */}
            <div className=' flex flex-wrap justify-between items-center gap-4 p-2 mb-4 '>



                <InputLabel
                    label={`${t("search_data", { data: `${t("name")}` })}`}
                    value={filters.name}
                    placeholder={`${t("search_data", { data: `${t("name")}` })}`}
                    onChange={(name) => { setFilters({ ...filters, name }) }}

                />

                {/* <button type="button" className="btn btn-primary" onClick={() => setOpenUserModal(true)}>{t("add")}<IconPlus /></button> */}
            </div>

            <div className='w-full mx-5 h-1 bg-black' />



            <UserListTable
                list={list.data}
                total={list.count}
                page={filters.page}
                take={filters.take}
                isLoading={list.isLoading}
                onChangeFilters={(filters: any) => { setFilters({ ...filters }) }}
                handleActionClick={(action, row) => { handleActionClick(action, row) }}
            />


        </div >
    );
};


export default UserListPage;
