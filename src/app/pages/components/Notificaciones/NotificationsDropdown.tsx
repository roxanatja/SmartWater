import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNotifications } from './NotificacionesContext'
import { motion } from 'framer-motion'
import NotificationBlock from './NotificationBlock'
import { NotificationsApiConector } from '../../../../api/classes'
import { Notification } from '../../../../type/Notification'
import InfiniteScroll from 'react-infinite-scroll-component'

const NotificationsDropdown = () => {
    const { closeNotifications, isOpenNotifications, notifications, openNotifications, markAllAsRead, markOneAsRead } = useNotifications()

    const ref = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const ITEMS_PER_PAGE = 10
    const [page, setPage] = useState(1)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                closeNotifications();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeNotifications]);

    useEffect(() => {
        if (isOpenNotifications && containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
            setPage(1)
        }
    }, [isOpenNotifications])

    const markAsRead = (id: string) => {
        NotificationsApiConector.markAsRead({ notificationId: id }).then(res => {
            markOneAsRead(id)
        })
    }

    const markAllAsReadLocal = () => {
        NotificationsApiConector.markAllAsRead().then(res => {
            console.log(res)
            markAllAsRead()
        })
    }

    const notifToShow = useMemo<Notification[]>(() => notifications.slice(0, page * ITEMS_PER_PAGE), [page, notifications])

    return (
        <div ref={ref} className="bg-blue_custom text-xl text-white flex items-center justify-center px-4 rounded-full relative cursor-pointer hover:bg-blue-800 w-[45px] h-[45px]"
            onClick={() => {
                if (!isOpenNotifications) openNotifications()
                else closeNotifications()
            }}>
            <i className="fa-solid fa-bell"></i>
            {
                notifications.some(n => !n.read) &&
                < div className="bg-red-500 rounded-full p-2 absolute top-0 right-0" />
            }

            <motion.div
                ref={containerRef}
                onClick={(e) => { e.stopPropagation() }}
                initial={false}
                animate={{
                    height: isOpenNotifications ? 500 : 0,
                    borderWidth: isOpenNotifications ? 1 : 0,
                    paddingTop: isOpenNotifications ? 0 : 0,
                    paddingBottom: isOpenNotifications ? 0 : 0,
                }}
                id='scrollableContainer'
                className={`notifications-container absolute top-full translate-y-3 right-0 min-w-[350px] z-[500] bg-blocks border dark:border-blocks shadow-md dark:shadow-slate-500 rounded-[20px] text-sm overflow-y-auto overflow-x-hidden`}>

                <div className="flex items-center justify-between mb-3 sticky top-0 bg-blocks z-10 py-4 px-7">
                    <h3 className='text-font-color text-base font-semibold'>Notificaciones</h3>
                    <i className={`fa-solid fa-envelope-open text-font-color text-base ${notifications.some(n => !n.read) ? "cursor-pointer" : "opacity-50 pointer-events-none cursor-not-allowed"}`} onClick={() => { markAllAsReadLocal() }}></i>
                </div>

                {
                    notifToShow.length > 0 ?
                        <InfiniteScroll
                            dataLength={notifToShow.length}
                            next={() => {
                                setPage(page + 1)
                            }}
                            hasMore={notifToShow.length < notifications.length}
                            loader={<p className='text-[10px] w-full text-center text-font-color'>Loading more...</p>}
                            endMessage={<p className='text-[10px] w-full text-center text-font-color'>No hay más notificaciones</p>}
                            scrollableTarget="scrollableContainer"
                            className='flex flex-col gap-3 px-6 pb-4'
                            scrollThreshold={0.9}
                        >
                            {
                                notifToShow.map((not, index) =>
                                    <NotificationBlock key={`notification_${index}`} notification={not} markAsRead={markAsRead} />
                                )
                            }
                        </InfiniteScroll> :
                        <div className='text-font-color min-h-[300px] flex items-center justify-center'>
                            Sin notificaciones
                        </div>
                }
            </motion.div>
        </div>

    )
}

export default NotificationsDropdown