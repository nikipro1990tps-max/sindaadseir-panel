import { useEffect, useState } from "react"
import IconEye from "../Icon/IconEye"
import IconPencil from "../Icon/IconPencil"
import IconX from "../Icon/IconX"

interface InputLabelPasswordProps {
    value?: string;
    label?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
}

const InputLabelPassword = (props: InputLabelPasswordProps) => {
    const { value = "", label = "", placeholder = "", onChange = (value: string) => {} } = props

    const [inputType, setInputType] = useState<"password" | "text">("password")
    const [text, setText] = useState<string>(value || "")

    useEffect(() => {
        setText(value || "")
    }, [value])

    const handleChange = (newValue: string) => {
        setText(newValue);
        onChange(newValue);
    }

    const handleClear = () => {
        handleChange("");
    }

    const togglePasswordVisibility = () => {
        setInputType(prevType => prevType === "text" ? "password" : "text")
    }

    return (
        <div>
            <label htmlFor={label}>{label}</label>
            <div className="relative text-white-dark">
                <span 
                    className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer" 
                    onClick={handleClear}
                >
                    {text && <IconX />}
                </span>
                <span 
                    className="absolute end-8 top-1/2 -translate-y-1/2 cursor-pointer" 
                    onClick={togglePasswordVisibility}
                >
                    {text && (
                        <IconEye
                            fill={inputType === 'password'}
                            duotone={inputType === 'password'}
                        />
                    )}
                </span>
                <input 
                    value={text} 
                    id={label} 
                    type={inputType} 
                    placeholder={placeholder} 
                    className="form-input ps-[50px] pe-[62px] placeholder:text-white-dark" 
                    onChange={(e) => handleChange(e.target.value)} 
                />
                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconPencil fill={true} />
                </span>
            </div>
        </div>
    )
}

export default InputLabelPassword