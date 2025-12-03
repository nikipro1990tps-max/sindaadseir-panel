import { useEffect, useState } from "react"
import { faqApiService } from '../../api/services/faq.api';
import { useTranslation } from 'react-i18next';
import MySelectInput from '../../components/Elements/MySelectInput';


function FaqSectionSelectInput(props: any) {

    const { isClearable = false, value,  onSelect = (value: any) => { } } = props

    const { t } = useTranslation(['faq'])

    const [list, setList] = useState([])
    const [selectedValue, setSelectedValue] = useState(null)


    async function fetch() {

        try {
            const { sections } = await faqApiService.sections()
      
            setList(sections)
        } catch (error) {

        }
    }

    useEffect(() => {

        fetch()

        if (value) {
            setSelectedValue(value)
        }

    }, [value])




    return (
        <MySelectInput
            options={list}
            value={selectedValue}
            isClearable={isClearable}
            valueKey="id"
            labelKey="title"
            placeholder={`${t("faq:select_section")}`}
            isMulti={false}
            onChange={(value: any) => { onSelect(value) }}

        />

    )
}

export default FaqSectionSelectInput