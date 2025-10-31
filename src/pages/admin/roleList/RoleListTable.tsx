import { DataTable } from "mantine-datatable"
import { useEffect, useState } from "react"
import Dropdown from "../../../components/Elements/Dropdown"
import IconVerticalAction from "../../../components/Icon/IconVerticalAction"
import Protector from "../../../components/Protector"
import { useSelector } from "react-redux"
import { IRootState } from "../../../store"
import IconTrash from "../../../components/Icon/IconTrash"
import IconPencil from "../../../components/Icon/IconPencil"

interface RoleListTable {
    list: any[],
    total: number,
    page: number,
    take: number,
    onChangeFilters?: (filters: any) => void
    handleActionClick?: (action: string, row: any) => void
}

function RoleListTable(props: RoleListTable) {

    const { handleActionClick = (action: string, row: any) => { }, onChangeFilters = (filters: any) => { }, list = null, total, page, take } = props

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;


    const [rows, setRows] = useState<any[]>([])
    const [filters, setFilters] = useState({ page, take })

    useEffect(() => {
        if (list) setRows(list)
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
                        accessor: 'id', textAlignment: `${isRtl ? "right" : "left"}`,
                        title: `id`, render: ({ id }) => <strong className="text-info text-center">#{id}</strong>
                    },
                    {
                        accessor: 'name',
                        title: `name`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        // sortable: true,
                        render: ({ name }) => (
                            <span className='text-center dark:text-white text-black'>{name}</span>
                        ),
                    },
                    {
                        accessor: 'action',
                        title: 'Action',
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        render: (row) => (


                            <div className="flex flex-wrap gap-5 ">
                                <button title="update" onClick={() => handleActionClick("update", row)}>
                                    <IconPencil />
                                </button>
                                <button className="text-danger" title="delete" onClick={() => handleActionClick("delete", row)}>
                                    <IconTrash />
                                </button>
                            </div>

                            // <div className="dropdown" >
                            //     {/* کامپوننت Dropdown برای نمایش منوی اکشن‌ها */}
                            //     <Dropdown
                            //         placement="top-end"
                            //         portal
                            //         button={
                            //             <IconVerticalAction />
                            //         }
                            //     >

                            //         <ul >
                            //             <Protector
                            //                 requiredPermissions={['role-manage']}
                            //             >
                            //                 <li>
                            //                     <button
                            //                         type="button"
                            //                         className=""
                            //                         onClick={() => handleActionClick("delete", row)}
                            //                     >
                            //                         delete
                            //                     </button>
                            //                 </li>
                            //             </Protector>

                            //             <Protector
                            //                 requiredPermissions={['role-manage']}
                            //             >
                            //                 <li>
                            //                     <button
                            //                         type="button"
                            //                         className=""
                            //                         onClick={() => handleActionClick("update", row)}
                            //                     >
                            //                         update
                            //                     </button>
                            //                 </li>
                            //             </Protector>



                            //         </ul>
                            //     </Dropdown>
                            // </div>
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

export default RoleListTable