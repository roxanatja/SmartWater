interface Props {
    url: string | null;
    onClose: () => void
}

const ImageFullscreen = ({ url, onClose }: Props) => {
    return (
        <>
            {
                url &&
                <div onClick={onClose} className="absolute w-full h-full top-0 left-0 flex items-center justify-center z-[500] bg-slate-800/50 backdrop-blur-sm">
                    <img src={url} alt="" className="h-[80dvh] aspect-auto object-contain" />
                </div>
            }
        </>
    )
}

export default ImageFullscreen