import { useEffect, useState } from "react"
import IconX from "../Icon/IconX"

interface TextAreaLabelProps {
    value?: string | null;
    label?: string;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    className?: string;
    inputClassName?: "";
    onChange?: (value: string) => void;
}

const TextAreaLabel = (props: TextAreaLabelProps) => {
    const {
        value = "",
        label = "",
        placeholder = "",
        type = "text",
        icon = null,
        className = "",
        inputClassName = "",
        onChange = (value) => { }
    } = props

    const [text, setText] = useState<string>(value ?? "") // Use nullish coalescing

    useEffect(() => {
        setText(value ?? "")
    }, [value])

    const handleChange = (newValue: string) => {
        setText(newValue);
        onChange(newValue);
    }

    // const handleClear = () => {
    //     handleChange("");
    // }

    return (
        <div className={`${className}`}>
            {label && <label className="dark:text-white-dark text-start" htmlFor={label}>{label}</label>}
            <div className="relative text-white-dark">
                {/* <span
                    className={`absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer ${text ? 'opacity-100' : 'opacity-0'}`}
                    onClick={handleClear}
                >
                    <IconX />
                </span> */}
                <textarea
                    value={text}
                    id={label}
                    placeholder={placeholder}
                    className={`form-input ${icon ? 'px-10' : 'pe-10'} placeholder:text-white-dark ${inputClassName}`}
                    onChange={(e) => handleChange(e.target.value)}
                >

                    {text}

                </textarea>

            </div>
        </div>
    )
}

export default TextAreaLabel