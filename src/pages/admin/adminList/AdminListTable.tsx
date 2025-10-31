import { useSelector } from "react-redux";
import { IRootState } from "../../../store";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "mantine-datatable";
import IconPencil from "../../../components/Icon/IconPencil";
import IconTrash from "../../../components/Icon/IconTrash";
import Protector from "../../../components/Protector";
import IconPlus from "../../../components/Icon/IconPlus";
import IconSquareRotated from "../../../components/Icon/IconSquareRotated";
import IconAt from "../../../components/Icon/IconAt";


interface AdminListTableProps {
    list: any[],
    total: number,
    page: number,
    take: number,
    onChangeFilters?: (filters: any) => void
    handleActionClick?: (action: string, row: any) => void
}

function AdminListTable(props: AdminListTableProps) {

    const { list = null, total, page, take, handleActionClick = (action: string, row: any) => { }, onChangeFilters = (filters: any) => { } } = props

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const { t } = useTranslation(["admin"])

    const [rows, setRows] = useState<any[]>([])
    const [filters, setFilters] = useState({ page, take })

    useMemo(() => {
        setRows(list || [])
    }, [list])

    useEffect(() => {
        setFilters({ ...filters, page, take })
    }, [page, take])

    return (
        <div className="datatables" >
            <DataTable
                noRecordsText="No results match your search query"
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={rows}


                columns={[
                    {
                        accessor: 'index', textAlignment: `${isRtl ? "right" : "left"}`,
                        title: `#`, render: ({ id }) => <strong className="text-info text-center">#{rows.findIndex(x => x.id == id) * page + 1}</strong>
                    },
                    {
                        accessor: 'name',
                        title: `${t("name")}`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        // sortable: true,
                        render: (user) => (
                            <div className="flex gap-2 items-center">

                                <img className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:translate-x-2"
                                    src={user.avatar || "/assets/images/auth/user.png"} alt={user.name} />
                                <span className='text-center dark:text-white text-black'>{user.name}</span>

                            </div>
                        ),
                    },

                    {
                        accessor: 'roles',
                        title: `${t("admin:admin.roles")}`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        // sortable: true,
                        render: (user) => (
                            <div className="flex flex-wrap gap-4" >

                                {user.roles.map((role: any, index: number) => (
                                    <span className=" bg-primary text-white text-sm py-1 px-2 rounded-full" key={index}>
                                        {role.name}
                                    </span>
                                ))}


                            </div>
                        ),
                    },
                    {
                        accessor: 'status',
                        title: `${t("status")}`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        // sortable: true,
                        render: ({ status }) => (

                            <span>
                                {status == "is_active" && <span className="p-2 bg-success text-white text-xs rounded-full font-bold" >{t("active")}</span>}
                                {status == "is_blocked" && <span className="p-2 bg-danger text-white text-xs rounded-full font-bold" >{t("blocked")}</span>}
                            </span>
                        ),
                    },
                    {
                        accessor: 'action',
                        title: `${t("action")}`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        render: (row) => (


                            <div className="flex flex-wrap gap-5 ">


                                <Protector requiredPermissions={['user-manage']}>
                                    <button title="assign role" onClick={() => handleActionClick("assignRole", row)}>
                                        <IconAt />
                                    </button>
                                </Protector>

                                <Protector requiredPermissions={['user-manage']}>
                                    <button title="update" onClick={() => handleActionClick("update", row)}>
                                        <IconPencil />
                                    </button>
                                </Protector>

                                <Protector requiredPermissions={['user-manage']}>
                                    <button className="text-danger" title="delete" onClick={() => handleActionClick("delete", row)}>
                                        <IconTrash />
                                    </button>
                                </Protector>

                            </div>


                        ),
                    },

                ]}
                totalRecords={total}
                recordsPerPage={filters.take}
                page={filters.page}
                onPageChange={(p) => { setFilters({ ...filters, page: p }); onChangeFilters(filters) }}
                recordsPerPageOptions={[10, 50, 100]}
                onRecordsPerPageChange={(take) => { setFilters({ ...filters, page: 1, take }); onChangeFilters(filters) }}
                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
            />
        </div>
    )
}

export default AdminListTable