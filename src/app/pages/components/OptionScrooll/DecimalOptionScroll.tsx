import React, { useEffect, useState } from 'react'
import { NumericOptionScrooll } from './NumericOptionScroll';

interface Props {
    min?: number;
    max: number;
    className?: string;
    value?: number;
    onOptionChange: (selectedOption: string) => void;
}

const DecimalOptionScroll = ({ max, min, className, value, onOptionChange }: Props) => {
    const [selectedValue, setSelectedValue] = useState<string>("0.00")

    useEffect(() => {
        if (!value) {
            setSelectedValue("0.00")
            onOptionChange("0.00")
        } else {
            const str = value.toFixed(2)
            setSelectedValue(str)
            onOptionChange(str)
        }
    }, [value])

    const handleOptionChange = (part: 'int' | 'dec', val: string) => {
        const currentSlices = selectedValue.split(".")

        let result = ""
        if (part === 'dec') {
            result = `${currentSlices[0]}.${val}`
        } else {
            result = `${val}.${currentSlices[1]}`
        }

        setSelectedValue(result)
        onOptionChange(result)
    };

    return (
        <div className='flex w-full justify-center gap-1 relative'>
            <NumericOptionScrooll value={Number(selectedValue.split(".")[0])} numeric={{ min, isDecimal: false, max }} onOptionChange={(val) => handleOptionChange('int', val)} containerClassName='!w-fit' />
            <div className="w-fit h-full text-2xl font-[500] flex items-center text-white">.</div>
            <NumericOptionScrooll value={Number(selectedValue.split(".")[1])} numeric={{ min: 0, isDecimal: true, max: 99 }} onOptionChange={(val) => handleOptionChange('dec', val)} containerClassName='!w-fit' />
        </div>
    )
}

export default DecimalOptionScroll