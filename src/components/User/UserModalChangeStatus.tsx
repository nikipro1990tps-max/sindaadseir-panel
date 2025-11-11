import { memo, useEffect, useState } from "react"
import MyModal from "../Elements/MyModal"
import { useTranslation } from "react-i18next"
import Select from 'react-select';
import { useSelector } from "react-redux"
import { IRootState } from "../../store"
import { userApiService } from "../../api/services/user.api";
import { MyToast } from "../Elements/MyToast";


interface ChaneStatusModalProps {
    userId: number;
    status: string;
    onSubmit: () => void;
    onClose: () => void;
}

function UserModalChangeStatus(props: ChaneStatusModalProps) {


    const { userId, status, onSubmit = () => { }, onClose = () => { } } = props
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const { t } = useTranslation(["admin"])

    const options: any = [
        { label: `${t("active")}`, value: "is_active" },
        { label: `${t("blocked")}`, value: "is_blocked" },
    ]

    const [state, setState] = useState<any>(options[0])
    const [loading, setLoading] = useState(false)

    async function submit() {

        try {
            setLoading(true)

            await userApiService.changeStatus(userId, state.value)

            MyToast.success(`${"success_action"}`)

            setLoading(false)
            onSubmit()
            onClose()

        } catch (error) {
            setLoading(false)

        }
    }


    useEffect(() => {
        setState(options.find((x: any) => x.value == (status || options[0].value)))
    }, [status])


    return (
        <MyModal
            isStatic={true}
            size="lg"
            title={`${t("user:user.change_status")}`}
            onClose={onClose}
            onSubmit={submit}
            isLoading={loading}
        >

            <Select
                defaultValue={state}
                value={state}
                placeholder={`${t("user:user.select_status")}`}
                options={options}
                isMulti={false}
                isRtl={isRtl}
                isClearable={false}
                isSearchable={false}
                closeMenuOnSelect={true}
                onChange={(value) => { setState(value) }}
            />

        </MyModal>

    )


}

export default memo<ChaneStatusModalProps>(UserModalChangeStatus);
