import { FC } from "react"
import { MonitoreoDistribuidoresProvider } from "./MonitoreoDistribuidoresContext"
import { MonitoreoDistribuidores } from "./MonitoreoDistribuidores"


const MonitoreoDistribuidoresWrapper: FC = () => {

    return (
        <>
            <MonitoreoDistribuidoresProvider>
                <MonitoreoDistribuidores />
            </MonitoreoDistribuidoresProvider>
        </>
    )

}

export { MonitoreoDistribuidoresWrapper }