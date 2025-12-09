import { Fragment, useEffect, useState } from "react";
import FaqListTable from "./FaqListTable";
import { faqApiService } from "../../../api/services/faq.api";
import ConfirmAlert from "../../../components/Elements/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { MyToast } from "../../../components/Elements/MyToast";
import FaqModal from "./FaqModal";
import IconPlus from "../../../components/Icon/IconPlus";
import FaqSectionSelectInput from "../FaqSectionSectionInput";
import FaqSectionListModal from "../section/FaqListSectionModal";
import FloatingInput from "../../../components/Elements/FloatingInput"

function FaqList() {

    const { t } = useTranslation(["admin"])

    const [items, setItems] = useState({ list: [], total: 0 })
    const [filters, setFilters] = useState({ search: "", page: 1, take: 10, sectionId: "" })
    const [faqModal, setFaqModal] = useState<any>(null)
    const [sectionManageModal, setSectionManageModal] = useState(false)
    const [refreshState, setRefereshState] = useState<any>(null)

    async function fetch() {

        setItems({ list: [], total: 0 })

        try {

            const { faqs, count: total } = await faqApiService.list(filters)
            setItems({ list: faqs, total })


        } catch (error) {

        }
    }

    function handleAction(action: string, row: any) {

        if (action == "update") {

            setFaqModal(row)

        } else if (action == "delete") {

            ConfirmAlert({
                title: t("delete_title", { item: row.name }),
                text: t("sure_delete_text", { item: row.name }),
                onConfirm: async () => {
                    try {

                        await faqApiService.delete(row.id)

                        MyToast.success(`${t("delete_success")}`)

                        await fetch()
                    } catch (error) {

                    }
                }
            })
        }
    }

    useEffect(() => {
        fetch()
    }, [filters])


    return (

        <div className='panel'>

            {faqModal &&
                <FaqModal

                    faq={faqModal}
                    onClose={() => setFaqModal(null)}
                    onSubmit={() => { fetch() }}

                />
            }

            {
                sectionManageModal &&
                <FaqSectionListModal
                    onSubmit={() => { setRefereshState(Date.now()) }}

                    onClose={() => setSectionManageModal(false)}

                />

            }


            <h1 className='p-4 text-lg font-bold'>{t('faq:faq_list')}</h1>

            {/* filters */}
            <div className='flex flex-wrap justify-between gap-4 p-2 mb-4'>

                <div className="flex flex-wrap   items-center  gap-4">

                    <div className=" flex-1">

                        <FloatingInput
                            containerClassName="min-w-[220px] flex-1"
                            value={filters.search}
                            label={`${t('search')}`}
                            onChange={(e) => { setFilters({ ...filters, search: e.target.value }) }}

                        />
                    </div>

                    <div className="min-w-[220px] flex-1  z-10">

                        <FaqSectionSelectInput
                            refresh={refreshState}
                            isClearable={true}
                            onSelect={(value: any) => { setFilters({ ...filters, sectionId: value?.id }) }}
                        />
                    </div>

                </div>

                <div className="flex gap-4">
                    <button type="button" className="btn btn-sm btn-success" onClick={() => setSectionManageModal(true)}>{t("faq:manage_sections")}</button>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setFaqModal(true)}>{t("add")}<IconPlus /></button>

                </div>

            </div>


            <FaqListTable
                list={items.list}
                total={items.total}
                page={filters.page}
                take={filters.take}
                onChangeFilters={(filters) => setFilters(filters)}
                handleActionClick={(action, row) => { handleAction(action, row) }}

            />

        </div>
    )
}

export default FaqList;
