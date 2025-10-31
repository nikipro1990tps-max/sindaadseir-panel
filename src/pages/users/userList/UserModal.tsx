import { useEffect, useState } from "react"
import MyModal from "../../../components/Elements/MyModal"
import { useTranslation } from "react-i18next"
import InputLabel from "../../../components/Elements/InputLabel"
import { MyToast } from "../../../components/Elements/MyToast"
import { userApiService } from "../../../api/services/user.api"

function UserModal(props: any) {


    const { user = null, onSubmit = () => { }, onClose = () => { } } = props

    const [selectedUser, setSelectedUser] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation(["admin"])

    async function fetchUser(userId: number) {
        try {
            setSelectedUser({})

            const user = await userApiService.showUser(userId)
            setSelectedUser(user)
        } catch (error) {

        }
    }

    async function submit() {

        if (!selectedUser.firstName || selectedUser.firstName.length < 1) {
            MyToast.error(`${t("atleast_characters", { n: "1", data: `${t('firstName')}` })}`)
            return
        }

        if (!selectedUser.email && !selectedUser.mobile) {
            MyToast.error(`${t("email_or_mobile_required")}`)
            return
        }


        if (selectedUser.password) {
            if (selectedUser.password.length < 6) {
                MyToast.error(`${t("atleast_characters", { n: "6", data: `${t('password')}` })}`)
                return
            }


            if (selectedUser.password != selectedUser.confirm_password) {
                MyToast.error(`${t("password_not_equal_confirm")}`)
                return
            }
        } else if (!user?.id) {
            MyToast.error(`${t("required_data", { data: `${t("password")}` })}`)
            return
        }


        try {

            setLoading(true)
            if (!user?.id) {

                await userApiService.createAdmin(selectedUser)
            } else {
                await userApiService.updateUser(user.id, selectedUser)
            }

            setLoading(false)

            MyToast.success(`${t("success_action")}`)

            onSubmit()
            onClose()
        } catch (error) {
            setLoading(false)

        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchUser(user.id)
        }
    }, [user])



    return (
        <MyModal
            isStatic={true}
            size="lg"
            title={!user?.name ? `${t("admin:admin.create")}` : `${t("admin:admin.update", { name: user.name })}`}
            onClose={onClose}
            onSubmit={submit}
            isLoading={loading}
        >

            <div className='mt-4 p-4'>

                <InputLabel
                    className={"mb-4"}
                    label={t("firstName")}
                    value={selectedUser.firstName || ""}
                    onChange={(firstName) => setSelectedUser({ ...selectedUser, firstName })}
                />


                <InputLabel
                    className={"mb-4"}
                    label={t("lastName")}
                    value={selectedUser.lastName || ""}
                    onChange={(lastName) => setSelectedUser({ ...selectedUser, lastName })}
                />



                <InputLabel
                    className={"mb-4"}
                    label={t("email")}
                    value={selectedUser.email || ""}
                    onChange={(email) => setSelectedUser({ ...selectedUser, email })}
                />


                <InputLabel
                    className={"mb-4"}
                    label={t("mobile")}
                    value={selectedUser.mobile || ""}
                    onChange={(mobile) => setSelectedUser({ ...selectedUser, mobile })}
                />


                <InputLabel
                    className={"mb-4"}
                    label={t("password")}
                    value={selectedUser.password || ""}
                    onChange={(password) => setSelectedUser({ ...selectedUser, password })}
                />


                <InputLabel
                    className={"mb-4"}
                    label={t("confirm_password")}
                    value={selectedUser.confirm_password || ""}
                    onChange={(confirm_password) => setSelectedUser({ ...selectedUser, confirm_password })}
                />


            </div>
        </MyModal>
    )


}

export default UserModal