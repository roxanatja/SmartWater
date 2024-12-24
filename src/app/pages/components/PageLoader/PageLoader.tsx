import './PageLoader.css'

interface Props {
    loading: boolean
}

const PageLoader = ({ loading }: Props) => {
    return (
        <>
            {
                loading &&
                <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center z-[500] bg-slate-800/50 backdrop-blur-sm">
                    <div className="loader"></div>
                </div>
            }
        </>
    )
}

export default PageLoader