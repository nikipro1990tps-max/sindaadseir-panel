import { memo, useEffect, useState } from "react";
import MyModal from "../../../components/Elements/MyModal";
import { useTranslation } from "react-i18next";
import RoleSelectInput from "./RoleSelectInput";



interface RolePermissionsModalProps {
    values?: any[]
    closeHandler?: () => void;
    submitHandler?: (values: any) => void;
}


const RoleModalSelectInput = memo((props: RolePermissionsModalProps) => {

    const { values = null, closeHandler = () => { }, submitHandler = () => { } } = props

    const { t } = useTranslation("admin")

    const [selectedValues, setSelectedValues] = useState<any>([])

    useEffect(() => {
        if (values?.[0]) {
            setSelectedValues(values)
        }
    }, [values])


    return (
        <MyModal
            size="lg"
            title={`${t("admin:admin.assign_rols")}`}
            onClose={closeHandler}
            onSubmit={() => submitHandler(selectedValues)}
        >

            <RoleSelectInput
                value={selectedValues}
                onSelect={(values: any) => { setSelectedValues(values) }}

            />


        </MyModal>
    )

})

export default RoleModalSelectInput