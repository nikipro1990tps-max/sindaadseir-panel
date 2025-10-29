import { useEffect, useState } from "react"
import IconX from "../Icon/IconX"

interface InputLabelProps {
    value?: string | null;
    label?: string;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    onChange?: (value: string) => void;
}

const InputLabel = (props: InputLabelProps) => {
    const { 
        value = "", 
        label = "", 
        placeholder = "", 
        type = "text", 
        icon = null, 
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
        <div>
            {label && <label htmlFor={label}>{label}</label>}
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
                    className="form-input px-10 placeholder:text-white-dark" 
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