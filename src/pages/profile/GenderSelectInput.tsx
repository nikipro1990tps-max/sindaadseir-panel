import Select from 'react-select';
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";
import { IRootState } from "../../store";
import { useEffect, useState } from "react";
import MySelectInput from '../../components/Elements/MySelectInput';

function GenderSelectInput(props: any) {
    const { value = "male", onSelect = (value: any) => { } } = props

    const { t } = useTranslation(["user"])

    const [selectedValue, setSelectedValue] = useState<any>(null)

    const options = [
        { value: "male", label: `${t("user:profile.male")}` },
        { value: "female", label: `${t("user:profile.female")}` },
    ]

    useEffect(() => {
        setSelectedValue(options.find((x: any) => x.value == value))
    }, [value])

    return (

        <MySelectInput
            options={options}
            value={selectedValue}
            inputId="select_gender"
            title={t("user:profile.gender")}
            placeholder={`${t("user:profile.gender")}`}
            valueKey="value"
            labelKey="label"
            onChange={(row: any) => { onSelect(row.value) }}
        />
        

    )

}

export default GenderSelectInput