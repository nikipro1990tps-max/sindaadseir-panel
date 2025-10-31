import { useEffect, useState } from "react"
import IconX from "../Icon/IconX"

interface InputLabelProps {
    value?: string | null;
    label?: string;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    className?: string;
    inputClassName?: "";
    onChange?: (value: string) => void;
}

const InputLabel = (props: InputLabelProps) => {
    const {
        value = "",
        label = "",
        placeholder = "",
        type = "text",
        icon = null,
        className = "",
        inputClassName = "",
        onChange = () => { }
    } = props

    const [text, setText] = useState<string>(value ?? "") // Use nullish coalescing

    useEffect(() => {
        setText(value ?? "")
    }, [value])

    const handleChange = (newValue: string) => {
        setText(newValue);
        onChange(newValue);
    }

    const handleClear = () => {
        handleChange("");
    }

    return (
        <div className={`${className}`}>
            {label && <label className="dark:text-white-dark text-start" htmlFor={label}>{label}</label>}
            <div className="relative text-white-dark">
                <span
                    className={`absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer ${text ? 'opacity-100' : 'opacity-0'}`}
                    onClick={handleClear}
                >
                    <IconX />
                </span>
                <input
                    value={text}
                    id={label}
                    type={type}
                    placeholder={placeholder}
                    className={`form-input px-10 placeholder:text-white-dark ${inputClassName}`}
                    onChange={(e) => handleChange(e.target.value)}
                />
                {icon && (
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        {icon}
                    </span>
                )}
            </div>
        </div>
    )
}

export default InputLabel