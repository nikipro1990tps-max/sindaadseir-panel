import Select from 'react-select';
import { useEffect, useState } from "react"
import { roleApiService } from '../../../api/services/role.api';
import { useTranslation } from 'react-i18next';
import MySelectInput from '../../../components/Elements/MySelectInput';


function RoleSelectInput(props: any) {

    const { isMulti = true, value, onSelect = (value: any) => { } } = props

    const { t } = useTranslation(['admin'])

    const [list, setList] = useState([])
    const [selectedValue, setSelectedValue] = useState(null)


    async function fetch() {

        try {
            const { roles } = await roleApiService.roles()
            setList(roles)
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
            placeholder={`${t("admin:role.role")}`}
            isMulti={isMulti}
            onChange={(values: any) => { onSelect(values) }}

        />

    )
}

export default RoleSelectInput