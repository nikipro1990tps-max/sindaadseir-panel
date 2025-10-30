import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import { rolehApiService } from '../../../api/services/role.api';
import MyTable from '../../../components/Elements/MyTable';

const RoleListPage = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation(["admin"])

    // const [list, setList] = useState({ roles: [], count: 0 })

    // async function fetchData() {

    //     try {
    //         const { roles, count } = await rolehApiService.roles()
    //         setList({ roles, count })

    //     } catch (error) {
    //         // TODO simething
    //     }

    // }

    // const list = [
    //     {
    //         id: 1,
    //         name: 'John Doe',
    //         email: 'johndoe@yahoo.com',
    //         date: '10/08/2020',
    //         sale: 120,
    //         status: 'Complete',
    //         register: '5 min ago',
    //         progress: '40%',
    //         position: 'Developer',
    //         office: 'London',
    //     },
    //     {
    //         id: 2,
    //         name: 'Shaun Park',
    //         email: 'shaunpark@gmail.com',
    //         date: '11/08/2020',
    //         sale: 400,
    //         status: 'Pending',
    //         register: '11 min ago',
    //         progress: '23%',
    //         position: 'Designer',
    //         office: 'New York',
    //     },
    //     {
    //         id: 3,
    //         name: 'Alma Clarke',
    //         email: 'alma@gmail.com',
    //         date: '12/02/2020',
    //         sale: 310,
    //         status: 'In Progress',
    //         register: '1 hour ago',
    //         progress: '80%',
    //         position: 'Accountant',
    //         office: 'Amazon',
    //     },
    //     {
    //         id: 4,
    //         name: 'Vincent Carpenter',
    //         email: 'vincent@gmail.com',
    //         date: '13/08/2020',
    //         sale: 100,
    //         status: 'Canceled',
    //         register: '1 day ago',
    //         progress: '60%',
    //         position: 'Data Scientist',
    //         office: 'Canada',
    //     },
    // ];

    const item =
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
        status: 'Complete',
        register: '5 min ago',
        progress: '40%',
        position: 'Developer',
        office: 'London',
    }

    let rows = []
    for (let i = 0; i < 250; i++) {
        rows.push({ ...item, id: (i + 1) })
    }

    const page = 5
    const take = 50

    useEffect(() => {
        dispatch(setPageTitle(t("admin:roleList")));
    }, []);

    return (
        <div className='panel'>
            <h1 className='p-4 m-2'>{t('admin:roleList')}</h1>
            <MyTable
                page={page}
                take={take}
                rows={rows}
                actions={[{ title: "حذف", "key": "delete", permissions: ["user-list"] }]}
                onSelectAction={(key, row) => { console.log(444444, key, row) }}
                onPageChange={(page) => { console.log(44444444, page) }}
                sortColumns={[{ column: "id", direction: "desc" }]}
                onSortChange={(sort) => console.log(8888888, "sort", sort)}
                columns={
                    [{
                        "key": "id", "title": "شناسه", render: (item) => {
                            return <span>hi {item.name} #{item.id}</span>
                        }
                    },
                    {
                        "key": "name", "title": "نام"
                    }

                    ]
                }

            />
        </div>
    );
};

export default RoleListPage;
