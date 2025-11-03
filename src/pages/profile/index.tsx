import { FormEvent, Suspense, useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';;
import { useTranslation } from 'react-i18next';
import InputLabel from '../../components/Elements/InputLabel';
import GenderSelectInput from './GenderSelectInput';
import InputLabelPassword from '../../components/Elements/InputLabelPassword';
import { userApiService } from '../../api/services/user.api';
import PerisanDatePicker from '../../components/Elements/PersianDatePicker';
import { MyToast } from '../../components/Elements/MyToast';
import ImageUploadButton from '../../components/Elements/ImageUploadButton';
import { mediaApiService } from '../../api/services/media.api';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation(["user"])

    const defaultUser = { gender: "male", birthdate: "" }
    const [user, setUser] = useState<any>(defaultUser)
    const mapAccess: any = { "manager": `${t("manager")}`, "admin": `${t("admin")}`, "user": `${t("user")}` }
    const [loading, setLoading] = useState(false)

    async function fetchUser() {

        try {

            setUser(defaultUser)
            const user = await userApiService.profile()
            const {avatar, ...userItems} = user
            setUser({ ...userItems, avatar_src: avatar || "/assets/images/auth/user.png" })
        } catch (error) {

        }

    }

    function updateUser(key: string, value: any) {
        setUser({ ...user, [key]: value })
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();


        let body: any = {
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
            birthdate: user.birthdate,
            gender: user.gender,
            password: user.password,
            confirm_password: user.confirm_password,
            avatar: user.avatar,
            avatarId: null
        }
        if (!body.firstName || body.firstName.length < 1) {
            MyToast.error(`${t("atleast_characters", { n: "1", data: `${t('firstName')}` })}`)
            return
        }

        if (!body.email && !body.mobile) {
            MyToast.error(`${t("email_or_mobile_required")}`)
            return
        }


        if (body.birthdate) {
            // todo somethingss
        }


        if (body.password) {
            if (body.password.length < 6) {
                MyToast.error(`${t("atleast_characters", { n: "6", data: `${t('password')}` })}`)
                return
            }


            if (body.password != body.confirm_password) {
                MyToast.error(`${t("password_not_equal_confirm")}`)
                return
            }

        } else if (!user.hasPassword) {
            MyToast.error(`${t("required_data", { data: `${t("password")}` })}`)
            return
        }




        try {

            setLoading(true)
            if (user.avatar) {
                const { mediaId, url } = await mediaApiService.uploadFile(user.avatar)
                body.avatarId = mediaId
            }
            await userApiService.updateProfile(body)

            setLoading(false)

            MyToast.success(`${t("success_action")}`)

        } catch (error) {


            // delete error avatar
            if (body.avatarId) {
                try {
                    await mediaApiService.deleteFile(body.avatarId)
                } catch (error) {
                    // error delete avatar
                }
            }

            setLoading(false)


        }
    }

    useEffect(() => {
        dispatch(setPageTitle(`${t('profile')}`));
        fetchUser()
    }, []);

    return (
        <div>

            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">{t("user:profile.title")}</h5>
                </div>

                <div>
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={submitForm}>
                        <div className="flex flex-col sm:flex-row">
                            <div className="mb-5 mx-5 text-center">
                                <img src={user.avatar_src} alt={`${user.firstName} ${user.lastName}`} className="w-[80px] h-[85px] ring-2 rounded-full object-cover mx-auto" />
                                <h6 className="text-center text-lg font-bold mb-2">{user.firstName} {user.lastName}</h6>
                                <span className="text-sm mx-2 bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">{mapAccess[user.access]}</span>

                                <div className='my-2'>
                                    <ImageUploadButton
                                        onImageSelect={(file, src) => { setUser({ ...user, avatar: file, avatar_src: src }) }}
                                    />
                                </div>

                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <InputLabel
                                    placeholder={`${t('enter_data', { data: `${t('user:profile.firstName')}` })}`}
                                    label={`${t("user:profile.firstName")}`}
                                    value={user?.firstName || ""}
                                    onChange={(value) => updateUser("firstName", value)}
                                />

                                <InputLabel
                                    label={`${t("user:profile.lastName")}`}
                                    placeholder={`${t('enter_data', { data: `${t('user:profile.lastName')}` })}`}
                                    value={user?.lastName || ""}
                                    onChange={(value) => updateUser("lastName", value)}
                                />

                                <InputLabel
                                    label={`${t("user:profile.mobile")}`}
                                    placeholder={`${t('enter_data', { data: `${t('user:profile.mobile')}` })}`}
                                    value={user?.mobile || ""}
                                    onChange={(value) => updateUser("mobile", value)}
                                />

                                <InputLabel
                                    label={`${t("user:profile.email")}`}
                                    placeholder={`${t('enter_data', { data: `${t('user:profile.email')}` })}`}
                                    value={user?.email || ""}
                                    onChange={(value) => updateUser("email", value)}
                                />

                                <GenderSelectInput
                                    value={user.gender}
                                    onSelect={(value: string) => updateUser("gender", value)}
                                />

                                <PerisanDatePicker
                                    label={`${t("user:profile.birthdata")}`}
                                    value={user.birthdate}
                                    onChange={(value: any) => { console.log(999, value); updateUser("birthdate", value) }}
                                />

                                <InputLabelPassword
                                    label={`${t("user:profile.password")}`}
                                    placeholder={`${t("user:profile.password")}`}
                                    onChange={(value: string) => updateUser("password", value)}
                                />

                                <InputLabelPassword
                                    label={`${t("user:profile.confirm_password")}`}
                                    placeholder={`${t("user:profile.confirm_password")}`}
                                    onChange={(value: string) => updateUser("confirm_password", value)}
                                />


                                <div className="sm:col-span-2 mt-3">
                                    <button type="submit" className="btn btn-primary" >
                                        {loading ? <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" > {t("submit")}</span> : <span>{t("submit")}</span>
                                        }


                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>


            </div>
        </div>
    );
};

export default ProfilePage;
