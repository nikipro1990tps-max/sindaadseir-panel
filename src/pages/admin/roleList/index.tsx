import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { rolehApiService } from '../../../api/services/role.api';
import MyTable from '../../../components/Elements/MyTable';
import InputLabel from '../../../components/Elements/InputLabel';
import IconPlus from '../../../components/Icon/IconPlus';
import MyModal from '../../../components/Elements/MyModal';

const RoleListPage = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation(["admin"])

    // states
    const [filters, setFilters] = useState({ search: "", page: 1, take: 10 })
    const [list, setList] = useState({ data: [], count: 0 })
    const [openRoleModal, setRoleModal] = useState<number | null | boolean>(null)

    async function fetchData() {

        try {

            setList({ data: [], count: 0 })

            const { roles, count } = await rolehApiService.roles(filters)

            setList({ data: roles, count })

        } catch (error) {
            // do something
        }
    }


    function hadnleTableAction(key: string, row: any) {
        if (key == "update") {

        }
    }


    useEffect(() => {
        dispatch(setPageTitle(t("admin:roleList")));

        fetchData()
    }, [filters]);

    return (
        <div className='panel'>
            <h1 className='p-4 m-2'>{t('admin:roleList')}</h1>

            {/* filters */}
            <div className='flex flex-wrap justify-between items-center gap-4 p-2 mb-4'>

                {openRoleModal &&
                    <MyModal
                        isStatic={true}
                        onSubmit={() => setRoleModal(null)}
                        onClose={() => setRoleModal(null)}
                    >

                        <p>asdasdsda</p>
                    </MyModal>
                }

                <InputLabel
                    value={filters.search}
                    placeholder="نام نقش را جستجو کنید"
                    onChange={(search) => { setFilters({ ...filters, search }) }}

                />

                <button type="button" className="btn btn-primary" onClick={() => setRoleModal(true)}>{t("add")}<IconPlus /></button>

            </div>


            <MyTable
                rows={list.data}
                total={list.count}
                page={filters.page}
                take={filters.take}
                actions={[
                    { title: "ویراش", "key": "update", permissions: ["role-manage"] },
                    { title: "حذف", "key": "delete", permissions: ["role-manage"] },
                ]}
                onSelectAction={(key, row) => { console.log(444444, key, row) }}
                onPageChange={(page) => { setFilters({ ...filters, page }) }}
                onTakeChange={(take) => { setFilters({ ...filters, page: 1, take }) }}
                columns={
                    [{ "key": "id", "title": "شناسه" },
                    { "key": "name", "title": "نام" }]
                }

            />
        </div>
    );
};

export default RoleListPage;
