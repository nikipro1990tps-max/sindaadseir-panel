import Select from 'react-select';
import { useSelector } from "react-redux";
import { IRootState } from "../../store";
import { useState, useEffect } from "react";

function MySelectInput(props: any) {

    const {
        options = null,
        value = null,
        onChange = (row: any) => { },
        isMulti = false,
        title = null,
        isClearable = false,
        closeMenuOnSelect = true,
        isSearchable = false,
        placeholder = "",
        inputId = "",
        valueKey = "id",
        labelKey = "name"
    } = props

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [items, setItems] = useState([])
    const [defaultValue, setDefaultValue] = useState(null)

    function map2Item(model: any) {
        if (Array.isArray(model)) {
            return model.map(x => model2Item(x))
        } else {
            return model2Item(model)
        }
    }

    function model2Item(model: any) {
        return { ...model, label: model[labelKey], value: model[valueKey] }
    }

    useEffect(() => {
        if (value) {
            setDefaultValue(map2Item(value))
        }
    }, [value])

    useEffect(() => {
        if (options?.[0]) {
            setItems(map2Item(options))
        }
    }, [options])

    return (
        <div>

            {title && <label htmlFor={inputId}>{title}</label>}

            <Select
                inputId={inputId}
                isClearable={isClearable}
                closeMenuOnSelect={closeMenuOnSelect}
                value={defaultValue}
                defaultValue={defaultValue}
                placeholder={placeholder}
                options={items}
                isMulti={isMulti}
                isRtl={isRtl}
                isSearchable={isSearchable}

                onChange={(value: any) => { setDefaultValue(value); onChange(value) }}
            />

        </div>

    )


}

export default MySelectInput