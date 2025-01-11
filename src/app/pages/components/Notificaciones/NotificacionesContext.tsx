import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { AuthService } from '../../../../api/services/AuthService'

const socket = io(process.env.REACT_APP_API_HEROKU)

export interface Notification {
    read: boolean;
    loanId: string;
    status: string;
    reason: string;
}

type NotificationsContextType = {
    notifications: Notification[];
    markAllAsRead: () => void;
    isOpenNotifications: boolean;
    openNotifications: () => void;
    closeNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
    notifications: [],
    markAllAsRead() { },
    isOpenNotifications: false,
    openNotifications() { },
    closeNotifications() { },
})

export const useNotifications = () => {
    return useContext(NotificationsContext)
}

const NotificacionesProvider = ({ children }: PropsWithChildren) => {
    const user = useMemo(() => AuthService.getUser(), [])

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpenNotifications, setOpenNotifications] = useState<boolean>(false)

    useEffect(() => {
        if (user && user.organization) {
            console.log('attempting to connect to socket with organization', user.organization)
            socket.on('connect', () => {
                console.log("Conectado al servidor")
                socket.emit('join organization', user.organization)
            })

            socket.on('loan claim', (data) => {
                const { loanId, status, reason } = data
                console.log("Prestamo reclamado", { loanId, status, reason, organization: user.organization })
            })
        }
    }, [user])

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                markAllAsRead() {
                    setNotifications((prev) => prev.map(p => ({ ...p, read: true })))
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