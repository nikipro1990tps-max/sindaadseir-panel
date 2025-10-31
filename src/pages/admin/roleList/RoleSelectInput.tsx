import Select from 'react-select';
import { useEffect, useState } from "react"
import { roleApiService } from '../../../api/services/role.api';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';




function RoleSelectInput(props: any) {

    const { isMulti = true, value, onSelect = (value: any) => { } } = props

    const { t } = useTranslation(['admin'])
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [list, setList] = useState([])
    const [selectedValue, setSelectedValue] = useState(null)


    async function fetch() {

        try {
            const { roles } = await roleApiService.roles()
            setList(map2Item(roles))
        } catch (error) {

        }
    }


    function map2Item(role: any) {
        if (Array.isArray(role)) {
            return role.map(x => role2Item(x))
        } else {
            return role2Item(role)
        }
    }

    function role2Item(role: any) {

        return { ...role, label: role.name, value: role.id }
    }

    useEffect(() => {
        fetch()

        if (value) {
            setSelectedValue(map2Item(value))
        }
    }, [value])


    return (
        <Select
            value={selectedValue}
            placeholder={`${t("admin:role.role")}`}
            options={list}
            isMulti={isMulti}
            isRtl={isRtl}
            isClearable={true}
            isSearchable={false}
            closeMenuOnSelect={false}
            onChange={(values) => { onSelect(values) }}
        />

    )
}

export default RoleSelectInput