import { useState, useEffect } from "react"
import MyModal from "../../../components/Elements/MyModal"
import { useTranslation } from "react-i18next"
import { faqApiService } from "../../../api/services/faq.api"
import { MyToast } from "../../../components/Elements/MyToast"
import FloatingInput from "../../../components/Elements/FloatingInput"

function FaqSectionDetailModal(props: any) {

    const { section = null, onSubmit = () => { }, onClose = () => { } } = props
    const [state, setState] = useState<any>({ title: "", description: "" })
    const [loading, setLoading] = useState(false)

    const { t } = useTranslation(['faq'])

    async function show() {

        try {

            const { section: item } = await faqApiService.showSection(section.id)
            setState(item)

        } catch (error) {

        }
    }

    async function submit() {

        if (state.title?.length < 2) {

            MyToast.error(`${t("atleast_characters", { n: "2", data: `${t('faq:question')}` })}`)
            return
        }

        if (state.question?.length < 2) {

            MyToast.error(`${t("atleast_characters", { n: "2", data: `${t('faq:answer')}` })}`)
            return
        }

        setLoading(true)


        try {

            if (state?.id) {
                await faqApiService.updateSection(state.id, state)
            } else {
                await faqApiService.createSection(state)
            }

            setLoading(false)

            onSubmit()

            onClose()
        } catch (error) {

            setLoading(false)
        }
    }

    useEffect(() => {
        if (section?.id) {
            show()
        }
    }, [section])


    return (
        <MyModal
            isStatic={true}
            size="lg"
            title={section?.id ? `${t("update")}` : `${t("create")}`}
            onClose={onClose}
            onSubmit={submit}
            isLoading={loading}
        >

            <div >

                <FloatingInput
                    label={t("title")}
                    containerClassName="mb-5"
                    value={state.title}
                    onChange={(e) => setState({ ...state, title: e.target.value })}
                />


                <FloatingInput
                    label={t("description")}
                    multiline={true}
                    value={state.description}
                    onChange={(e) => setState({ ...state, description: e.target.value })}
                />
            </div>

        </MyModal>

    )
}

export default FaqSectionDetailModal