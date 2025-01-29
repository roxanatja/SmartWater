import { Template } from "@pdfme/common";

export const reportTemplate: Template = { "schemas": [[{ "name": "title", "type": "multiVariableText", "content": "{}", "position": { "x": 10.59, "y": 20 }, "width": 105.56, "height": 6.8, "rotate": 0, "alignment": "left", "verticalAlignment": "top", "fontSize": 12, "lineHeight": 1, "characterSpacing": 0, "fontColor": "#1a3d7d", "fontName": "Roboto", "backgroundColor": "", "opacity": 1, "strikethrough": false, "underline": false, "readOnly": true, "text": "Reporte saldos físicos valorados", "variables": [], "required": false }, { "name": "subtitle", "type": "multiVariableText", "content": "{\"date\":\"29/01/2025\"}", "position": { "x": 86.72, "y": 27.23 }, "width": 105.56, "height": 6.8, "rotate": 0, "alignment": "center", "verticalAlignment": "middle", "fontSize": 12, "lineHeight": 1, "characterSpacing": 0, "fontColor": "#1a3d7d", "fontName": "Roboto", "backgroundColor": "", "opacity": 1, "strikethrough": false, "underline": false, "readOnly": false, "text": "Reporte de inventarios al {date}", "variables": ["date"], "required": false }, { "name": "table", "type": "table", "position": { "x": 10.259999999999991, "y": 35.45 }, "width": 258.74, "height": 9.8808, "content": "[]", "showHead": true, "head": ["NRO", "Productos", "Unidad", "Cantidad", "C.P.P", "Monto"], "headWidthPercentages": [8.45649434941967, 27.75058542048474, 13.234543626552524, 16.735071777642034, 17.60461209529627, 16.218692730604765], "tableStyles": { "borderWidth": 0.3, "borderColor": "#6b6b6b" }, "headStyles": { "fontName": "Roboto", "fontSize": 11, "characterSpacing": 0, "alignment": "left", "verticalAlignment": "middle", "lineHeight": 1, "fontColor": "#000000", "borderColor": "#6b6b6b", "backgroundColor": "#ffffff", "borderWidth": { "top": 0, "right": 0, "bottom": 0.3, "left": 0 }, "padding": { "top": 3, "right": 2, "bottom": 3, "left": 2 } }, "bodyStyles": { "fontName": "Roboto", "fontSize": 11, "characterSpacing": 0, "alignment": "left", "verticalAlignment": "middle", "lineHeight": 1, "fontColor": "#000000", "borderColor": "#6b6b6b", "backgroundColor": "", "alternateBackgroundColor": "#ffffff", "borderWidth": { "top": 0, "right": 0, "bottom": 0, "left": 0 }, "padding": { "top": 3, "right": 2, "bottom": 3, "left": 2 } }, "columnStyles": { "alignment": { "0": "left", "1": "left", "2": "left", "3": "left", "4": "left", "5": "left" } }, "required": false, "readOnly": false }]], "basePdf": { "width": 279, "height": 216, "padding": [20, 10, 20, 10] }, "pdfmeVersion": "5.3.1" }

export const kardexTemplate: Template = {
    "schemas": [
        [
            {
                "name": "title", "type": "multiVariableText", "content": "{\"element\":\"Exhibidor\"}", "position": { "x": 10.59, "y": 21 }, "width": 105.56, "height": 6.8, "rotate": 0, "alignment": "left", "verticalAlignment": "top", "fontSize": 12, "lineHeight": 1, "characterSpacing": 0, "fontColor": "#1a3d7d", "fontName": "Roboto", "backgroundColor": "", "opacity": 1, "strikethrough": false, "underline": false, "readOnly": false, "text": "Kardex físico valorado - {element}", "variables": ["element"], "required": false
            }, {
                "name": "table", "type": "table", "position": { "x": 10.259999999999991, "y": 30.69 }, "width": 258.74, "height": 13.7616,
                "content": "[]", "showHead": true,
                "head": ["DETALLE", "FECHA", "DOC", "CANTIDAD\nENTRADA", "P.U", "IMPORTE\nENTRADA", "CANTIDAD\nSALIDA", "P.U", "IMPORTE\nSALIDA", "SALDO\nCANTIDAD", "C.P.P", "SALDO\nIMPORTE"],
                "headWidthPercentages": [9, 9, 8, 8.5, 8, 8.5, 8.5, 8, 8, 8.5, 8, 8],
                "tableStyles": { "borderWidth": 0.3, "borderColor": "#6b6b6b" },
                "headStyles": { "fontName": "Roboto", "fontSize": 10, "characterSpacing": 0, "alignment": "left", "verticalAlignment": "middle", "lineHeight": 1, "fontColor": "#000000", "borderColor": "#6b6b6b", "backgroundColor": "#ffffff", "borderWidth": { "top": 0, "right": 0, "bottom": 0.3, "left": 0 }, "padding": { "top": 3, "right": 2, "bottom": 3, "left": 2 } },
                "bodyStyles": { "fontName": "Roboto", "fontSize": 10, "characterSpacing": 0, "alignment": "left", "verticalAlignment": "middle", "lineHeight": 1, "fontColor": "#000000", "borderColor": "#6b6b6b", "backgroundColor": "", "alternateBackgroundColor": "#ffffff", "borderWidth": { "top": 0, "right": 0, "bottom": 0, "left": 0 }, "padding": { "top": 3, "right": 2, "bottom": 3, "left": 2 } },
                "columnStyles": { "alignment": { "0": "left", "1": "left", "2": "left", "3": "left", "4": "left", "5": "left" } }, "required": false, "readOnly": false
            }
        ]
    ], "basePdf": { "width": 279, "height": 216, "padding": [20, 10, 20, 10] }, "pdfmeVersion": "5.3.1"
}