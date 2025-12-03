import { useState, useEffect } from "react"
import MyModal from "../../../components/Elements/MyModal"
import { useTranslation } from "react-i18next"
import { faqApiService } from "../../../api/services/faq.api"
import { MyToast } from "../../../components/Elements/MyToast"
import FaqSectionListTable from "./FaqSectionListTable"
import FaqSectionDetailModal from "./FaqSectionDetailModal"
import ConfirmAlert from "../../../components/Elements/ConfirmAlert"
import IconPlus from "../../../components/Icon/IconPlus"

function FaqSectionListModal(props: any) {



    const { onClose = () => { }, onSubmit = () => { } } = props

    const { t } = useTranslation(['faq'])

    const [filters, setFilters] = useState({ page: 1, take: 10 })
    const [list, setList] = useState({ sections: [], count: 0 })
    const [sectionModal, setSectionModal] = useState<any>(null)

    async function fetch() {
        try {
            const { sections, count } = await faqApiService.sections(filters)
            setList({ sections, count })
        } catch (error) {

        }
    }

    async function handleActionClick(action: string, row: any) {

        if (action == "update") {
            setSectionModal(row)
        } else if (action == "delete") {


            ConfirmAlert({
                title: t("delete_title", { item: row.title }),
                text: t("sure_delete_text", { item: row.title }),
                onConfirm: async () => {
                    try {

                        await faqApiService.deleteSection(row.id)

                        MyToast.success(`${t("delete_success")}`)

                        await fetch()

                        onSubmit()
                    } catch (error) {

                    }
                }
            })
        }

    }

    async function submit() {
        await fetch()
        onSubmit()
    }

    useEffect(() => {

        fetch()
    }, [])


    return (
        <MyModal
            isStatic={true}
            size="xlg"
            title={t("faq:manage_sections")}
            onClose={onClose}
            showActions={false}
        >

            <div >

                {sectionModal &&
                    <FaqSectionDetailModal
                        section={sectionModal}
                        onClose={() => setSectionModal(null)}
                        onSubmit={() => { submit() }}
                    />
                }


                {/* filters */}
                <div className='flex flex-wrap justify-between items-center gap-4 mb-4'>


                    <button type="button" className="btn btn-primary" onClick={() => setSectionModal(true)}>{t("add")}<IconPlus /></button>

                </div>

                <FaqSectionListTable
                    list={list.sections}
                    total={list.count}
                    page={filters.page}
                    take={filters.page}
                    handleActionClick={(action, row) => { handleActionClick(action, row) }}
                    onChangeFilters={(filters) => { setFilters({ ...filters }) }}

                />
            </div>

        </MyModal>

    )
}

export default FaqSectionListModal