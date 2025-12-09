import { DataTable } from "mantine-datatable"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { IRootState } from "../../../store"
import IconTrash from "../../../components/Icon/IconTrash"
import IconPencil from "../../../components/Icon/IconPencil"
import { useTranslation } from "react-i18next"
import Protector from "../../../components/Protector"

interface FaqSectionListTableProps {
    list: any[],
    total: number,
    page: number,
    take: number,
    onChangeFilters?: (filters: any) => void
    handleActionClick?: (action: string, row: any) => void
}

function FaqSectionListTable(props: FaqSectionListTableProps) {

    const {
        list = null,
        total = 0,
        page = 1,
        take = 10,
        handleActionClick = (action: string, row: any) => { },
        onChangeFilters = (filters: any) => { }
    } = props

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const { t } = useTranslation(["faq"])

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
                        accessor: 'title',
                        title: `${t("title")}`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        // sortable: true,
                        render: ({ title }) => (
                            <p className={`${isRtl ? "right" : "left"} dark:text-white text-black truncate max-w-[200px]`}>{title}</p>
                        ),
                    },
                    {
                        accessor: 'description',
                        title: `${t("description")}`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        // sortable: true,
                        render: ({ description }) => (
                            <p className={`${isRtl ? "right" : "left"} dark:text-white text-black truncate max-w-[200px]`}>{description}</p>
                        ),
                    },
                    {
                        accessor: 'action',
                        title: `${t("action")}`,
                        textAlignment: `${isRtl ? "right" : "left"}`,
                        render: (row) => (


                            <div className="flex flex-wrap gap-5 ">
                                <Protector requiredPermissions={['faq-manage']}>
                                    <button title="update" onClick={() => handleActionClick("update", row)}>
                                        <IconPencil />
                                    </button>
                                </Protector>

                                <Protector requiredPermissions={['faq-manage']}>
                                    <button className="text-danger" title="delete" onClick={() => handleActionClick("delete", row)}>
                                        <IconTrash />
                                    </button>
                                </Protector>

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

export default FaqSectionListTable