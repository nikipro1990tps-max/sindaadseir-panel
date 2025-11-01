import Select from 'react-select';
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";
import { IRootState } from "../../store";
import { useEffect, useState } from "react";

function GenderSelectInput(props: any) {
    const { value = "male", onSelect = (value: any) => { } } = props

    const { t } = useTranslation(["user"])
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [selectedValue, setSelectedValue] = useState<any>(null)

    const options = [
        { value: "male", label: `${t("user:profile.male")}` },
        { value: "female", label: `${t("user:profile.female")}` },
    ]

    useEffect(() => {
        setSelectedValue(options.find((x: any) => x.value == value))
    }, [value])

    return (
        <div>

            <label htmlFor="select_gener">{t("user:profile.gender")}</label>

            <Select
                inputId='select_gener'
                value={selectedValue}
                placeholder={`${t("admin:role.role")}`}
                options={options}
                isMulti={false}
                isRtl={isRtl}
                isClearable={true}
                isSearchable={false}
                closeMenuOnSelect={true}
                
                onChange={(row) => { onSelect(row.value) }}
            />

        </div>

    )

}

export default GenderSelectInput