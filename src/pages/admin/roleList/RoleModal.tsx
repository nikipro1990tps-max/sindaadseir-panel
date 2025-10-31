import { memo, useState, useEffect } from "react"
import { MyToast } from "../../../components/Elements/MyToast"
import { useTranslation } from "react-i18next"
import { roleApiService } from "../../../api/services/role.api"
import MyModal from "../../../components/Elements/MyModal"
import InputLabel from "../../../components/Elements/InputLabel"

interface Permission {
    key: string;
    title: string;
}

interface Section {
    section: string;
    title: string;
    permissions: Permission[];
}

interface RolePermissionsModalProps {
    permissionsList?: Section[] | null;
    rolePermissions?: any | null;
    closeHandler?: () => void;
    submitHandler?: () => void;
}

const RolePermissionsModal = memo((props: RolePermissionsModalProps) => {
    const {
        permissionsList = null,
        rolePermissions = null,
        closeHandler = () => { },
        submitHandler = () => { }
    } = props

    const { t } = useTranslation()
    const [role, setRole] = useState<any>({ name: "", permissions: [] })
    const [loading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(true)

    function sectionCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const checked = e.target.checked
        const value = e.target.value

        const findIndexSection = permissionsList?.findIndex(x => x.section === value) ?? -1
        const getAccessOfSection = findIndexSection >= 0 ? permissionsList![findIndexSection].permissions.map(x => x.key) : []

        let permissionsOfRole: string[] = []
        if (checked) {
            permissionsOfRole = [...role.permissions, ...getAccessOfSection]
        } else {
            permissionsOfRole = role.permissions.filter((x: any) => !getAccessOfSection.includes(x))
        }

        setRole({ ...role, permissions: permissionsOfRole })
    }

    function checkBoxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const checked = e.target.checked
        const value = e.target.value
        const permissions = [...role.permissions]
        const findIndex = permissions.findIndex(ac => ac === value)

        if (checked && findIndex === -1) {
            permissions.push(value)
        } else if (!checked && findIndex >= 0) {
            permissions.splice(findIndex, 1)
        }

        setRole({ ...role, permissions })
    }

    async function handleSubmit() {
        setLoading(true)

        if (rolePermissions?.id) {
            await roleApiService.update(rolePermissions.id, { name: role.name, permissions: role.permissions })
                .then(response => {
                    MyToast.success(`${t("success_action")}`)
                    setLoading(false)
                    submitHandler()
                })
                .catch(error => {
                    setLoading(false)
                })
        } else {
            await roleApiService.create({ name: role.name, permissions: role.permissions })
                .then(response => {
                    MyToast.success(`${t("success_action")}`)
                    setLoading(false)
                    submitHandler()
                })
                .catch(error => {
                    setLoading(false)
                })
        }
    }


    useEffect(() => {
        if (rolePermissions != null && rolePermissions !== true) {
            setRole({
                name: rolePermissions.name || "",
                permissions: rolePermissions.permissions || []
            })
        }
        console.log(9999999999, "rolePermissions")
    }, [rolePermissions])



    return (
        <MyModal
            isStatic={true}
            size="xlg"
            title={!rolePermissions?.name ? 'ایجاد سطح دسترسی' : `ویرایش دسترسی ${role.name}`}
            onClose={closeHandler}
            onSubmit={handleSubmit}
            isLoading={loading}
            submitText="ثبت"
            cancelText="انصراف"
        >
            {/* Name Input */}
            <div className='mt-4 p-4'>
                <InputLabel
                    label="نام"
                    placeholder="نام نقش را وارد کنید"
                    value={role.name}
                    onChange={(name: string) => setRole((prev: any) => ({ ...prev, name }))}
                />
            </div>

            {/* Permissions Section */}
            <div className='p-4'>
                <h6 className="text-start text-gray-800 dark:text-white mb-4 text-lg font-semibold">
                    انتخاب دسترسی ها
                </h6>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {permissionsList?.map((section, acIndex) => (
                        <div
                            key={acIndex}
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm"
                        >
                            <div className="p-4">
                                {/* Section Header */}
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <input
                                            checked={section.permissions.map(x => x.key).every(x => role.permissions.includes(x))}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                            type="checkbox"
                                            id={`chb-section-${section.title}`}
                                            value={section.section}
                                            onChange={sectionCheckboxChange}
                                        />
                                        <label
                                            className="text-gray-800 dark:text-white font-medium cursor-pointer"
                                            htmlFor={`chb-section-${section.title}`}
                                        >
                                            {section.title}
                                        </label>
                                    </div>
                                </div>

                                {/* Permissions Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {section.permissions.map((itemPermissions) => (
                                        <div key={itemPermissions.key} className="flex items-center">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <input
                                                    checked={role.permissions.includes(itemPermissions.key)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                                    type="checkbox"
                                                    id={`chb-${itemPermissions.key}`}
                                                    value={itemPermissions.key}
                                                    onChange={checkBoxChange}
                                                />
                                                <label
                                                    className="text-gray-700 dark:text-gray-300 text-sm cursor-pointer"
                                                    htmlFor={`chb-${itemPermissions.key}`}
                                                >
                                                    {itemPermissions.title}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MyModal>
    )
})

export default RolePermissionsModal