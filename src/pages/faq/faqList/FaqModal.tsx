import { useState, useEffect } from "react"
import MyModal from "../../../components/Elements/MyModal"
import { useTranslation } from "react-i18next"
import InputLabel from "../../../components/Elements/InputLabel"
import TextAreaLabel from "../../../components/Elements/TextAreaLabel"
import { faqApiService } from "../../../api/services/faq.api"
import { MyToast } from "../../../components/Elements/MyToast"
import FaqSectionSelectInput from "../FaqSectionSectionInput"

function FaqModal(props: any) {

    const { faq = null, onSubmit = () => { }, onClose = () => { } } = props
    const [state, setState] = useState<any>({ section: null, id: null, question: "", answer: "" })
    const [loading, setLoading] = useState(false)

    const { t } = useTranslation(['faq'])

    async function show() {

        try {

            const { faq: item } = await faqApiService.show(faq.id)
            setState(item)

        } catch (error) {

        }
    }

    async function submit() {

        if (!state.section) {

            MyToast.error(`${t(`faq:select_section_required`)}`)
            return
        }


        if (state.question?.length < 2) {

            MyToast.error(`${t("atleast_characters", { n: "2", data: `${t('faq:question')}` })}`)
            return
        }

        if (state.answer?.length < 2) {

            MyToast.error(`${t("atleast_characters", { n: "2", data: `${t('faq:answer')}` })}`)
            return
        }

        setLoading(true)

        const body = { question: state.question, answer: state.answer, sectionId: state.section.id }

        try {

            if (state?.id) {
                await faqApiService.update(state.id, body)
            } else {
                await faqApiService.create(body)
            }

            setLoading(false)

            onSubmit()

            onClose()
        } catch (error) {

            setLoading(false)
        }
    }

    useEffect(() => {
        if (faq?.id) {
            show()
        }
    }, [faq])


    return (
        <MyModal
            isStatic={true}
            size="lg"
            title={faq ? `${t("update")}` : `${t("create")}`}
            onClose={onClose}
            onSubmit={submit}
            isLoading={loading}
        >

            <div >

                <FaqSectionSelectInput

                    value={state.section}
                    onSelect={(value: any) => setState({ ...state, section: value })}

                />

                <InputLabel
                    placeholder={t("faq:question")}
                    label={t("faq:question")}
                    value={state.question}
                    onChange={(value) => setState({ ...state, question: value })}
                />


                <TextAreaLabel
                    placeholder={t("faq:answer")}
                    label={t("faq:answer")}
                    value={state.answer}
                    onChange={(value) => setState({ ...state, answer: value })}
                />
            </div>

        </MyModal>

    )
}

export default FaqModal