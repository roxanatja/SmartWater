import { Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { text, multiVariableText, table, rectangle } from "@pdfme/schemas";
import React from "react";
import toast from "react-hot-toast";
import { Buffer } from 'buffer'

export const showGeneratePDF = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    template: Template,
    inputs: any[]
) => {
    setLoading(true)

    try {
        const pdf = await generate({ template, inputs, plugins: { Text: text, Rectangle: rectangle, Table: table, "Multi-Variable Text": multiVariableText } })
        const pdfBuffer = Buffer.from(pdf)

        const blob = new Blob([pdfBuffer], { type: 'application/pdf' })

        try {
            const url = window.URL.createObjectURL(blob);
            const w = window.open(url, "Resumen de arqueo", "popup,height=1080,width=900")
            if (w) {
                let timer = setInterval(function () {
                    if (w.closed) {
                        clearInterval(timer);
                        setLoading(false)
                    }
                }, 500);
            } else {
                setLoading(false)
            }
        } catch (e) {
            console.log(e)
            toast.error('Error guardando el pdf');
            setLoading(false)
        }
    } catch (error) {
        console.log(error)
        toast.error('Error generando el pdf');
        setLoading(false)
    }
}