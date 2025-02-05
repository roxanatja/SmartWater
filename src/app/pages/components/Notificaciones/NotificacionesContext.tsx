import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { AuthService } from '../../../../api/services/AuthService'
import { Notification } from '../../../../type/Notification'
import { NotificationsApiConector } from '../../../../api/classes'

const socket = io(process.env.REACT_APP_API_HEROKU)

type NotificationsContextType = {
    notifications: Notification[];
    markAllAsRead: () => void;
    markOneAsRead: (id: string) => void;
    isOpenNotifications: boolean;
    openNotifications: () => void;
    closeNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
    notifications: [],
    markAllAsRead() { },
    markOneAsRead(id: string) { },
    isOpenNotifications: false,
    openNotifications() { },
    closeNotifications() { },
})

export const useNotifications = () => {
    return useContext(NotificationsContext)
}

const eventsListen = ['loan claim', 'user_disconnected']

const NotificacionesProvider = ({ children }: PropsWithChildren) => {
    const user = useMemo(() => AuthService.getUser(), [])

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpenNotifications, setOpenNotifications] = useState<boolean>(false)

    const loadNotifications = useCallback(async () => {
        console.log("Cargando notificaciones...")
        const nots = await NotificationsApiConector.get({ pagination: { page: 1, pageSize: 30000, sort: 'desc' } })
        console.log(nots?.data)
        setNotifications(nots?.data || [])
        console.log("Notificaciones cargadas!")
    }, [])

    useEffect(() => {
        if (user && user.organization) {
            console.log('attempting to connect to socket with organization', user.organization)
            socket.on('connect', () => {
                console.log("Conectado al servidor")
                socket.emit('join organization', user.organization)
                loadNotifications()
            })

            eventsListen.forEach(e => {
                socket.on(e, (data) => {
                    console.log("nueva notificacion de evento", e)
                    loadNotifications()
                })
            })
        }
    }, [user, loadNotifications])

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                markAllAsRead() {
                    setNotifications((prev) => prev.map(p => ({ ...p, read: true })))
                },
                markOneAsRead(id: string) {
                    setNotifications((prev) => prev.map(p => { return p._id === id ? { ...p, read: true } : p }))
                },
                isOpenNotifications,
                openNotifications() { setOpenNotifications(true) },
                closeNotifications() { setOpenNotifications(false) },
            }}>
            {children}
        </NotificationsContext.Provider>
    )
}

export default NotificacionesProvider