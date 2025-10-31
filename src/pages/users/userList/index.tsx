import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { userApiService } from '../../../api/services/user.api';
import { MyToast } from '../../../components/Elements/MyToast';
import ConfirmAlert from '../../../components/Elements/ConfirmAlert';
import InputLabel from '../../../components/Elements/InputLabel';
import IconPlus from '../../../components/Icon/IconPlus';
import UserModalChangeStatus from './UserModalChangeStatus';
import UserModal from './UserModal';
import UserListTable from './UserListTable';

function UserListPage() {

    const dispatch = useDispatch()
    const { t } = useTranslation(["user"])

    const [statusModal, setStatusModal] = useState<any>(null)
    const [openUserModal, setOpenUserModal] = useState<any>(null)
    const [filters, setFilters] = useState({ name: "", page: 1, take: 10 })
    const [list, setList] = useState({ data: [], count: 0 })


    async function fetchData() {

        try {

            setList({ data: [], count: 0 })

            const { users, count } = await userApiService.users(filters)

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


            <h1 className='p-4 m-2'>{t('user:user.userList')}</h1>



            {/* filters */}
            <div className='flex flex-wrap justify-between items-center gap-4 p-2 mb-4'>



                <InputLabel
                    value={filters.name}
                    placeholder={`${t('name')}`}
                    onChange={(name) => { setFilters({ ...filters, name }) }}

                />

                {/* <button type="button" className="btn btn-primary" onClick={() => setOpenUserModal(true)}>{t("add")}<IconPlus /></button> */}

            </div>



            <UserListTable
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


export default UserListPage;
