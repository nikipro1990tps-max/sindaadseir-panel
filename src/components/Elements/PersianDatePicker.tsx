/**
 * https://shahabyazdi.github.io/react-multi-date-picker/
 */

import React, { useEffect, useState } from 'react';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

function CustomInput(props: any) {
    const { onFocus, value, onChange, defauleValue = null } = props
    return (
        <input
            className="form-input placeholder:text-white-dark"
            onFocus={onFocus}
            value={value}
            onChange={onChange}
        />
    )
}

const PersianDatePicker = (props: any) => {
    const { label = "", value = null, format = "YYYY-MM-DD", onChange = (value: any) => { } } = props
    const [selectedDate, setSelectedDate] = useState<any>(null);

    useEffect(() => {
        setSelectedDate(value)
    }, [value])


    return (
        <div>
            <label htmlFor={label}>{label}</label>

            <DatePicker
                highlightToday
                value={selectedDate}
                format={format}
                calendarPosition="top-right"
                calendar={persian}
                locale={persian_fa}
                render={<CustomInput />}
                containerClassName='form-control w-full'
                inputClass="`form-input  placeholder:text-white-dark"
                onChange={(value: any) => { onChange(value?.toDate()) }}
            />

        </div>

    );
};

export default PersianDatePicker;