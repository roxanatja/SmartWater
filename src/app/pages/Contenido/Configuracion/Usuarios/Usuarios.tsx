import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./Usuarios.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { user, UsuariosContext } from "./UsuariosContext";
import { AddUsuario } from "./AddUsuario/AddUsuario";
import { CuadroUsuarios } from "./CuadroUsuarios/CuadroUsuarios";
import { AsignarPermisos } from "./AsignarPermisos/AsignarPermisos";
import { Permission, User } from "../../../../../type/User";
import { SchedulesApiConector, UsersApiConector, ZonesApiConector } from "../../../../../api/classes";
import Modal from "../../../EntryComponents/Modal";
import { Zone } from "../../../../../type/City";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { Schedule } from "../../../../../type/Schedule";

const Usuarios: FC = () => {
    const { setLoading } = useGlobalContext()
    const { showModal, setShowModal, showMiniModal, selectedUser, setSelectedUser, setShowMiniModal } = useContext(UsuariosContext)

    const [searchParam, setSearchParam] = useState<string>('');

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 15

    const [usersToShow, setUsersToShow] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])

    const [zonas, setZonas] = useState<Zone[]>([])
    const [permisos, setPermisos] = useState<Permission[]>([])
    const [schedules, setSchedules] = useState<Schedule[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)

        const res = await UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { role: 'user' } })
        const prods = res?.data || []
        setUsers(prods)
        setTotalPages(Math.ceil(prods.length / ITEMS_PER_PAGE))

        const resZ = await ZonesApiConector.get({ pagination: { page: 1, pageSize: 3000 } })
        setZonas(resZ?.data || [])
        const resP = await UsersApiConector.getPermissions({ pagination: { page: 1, pageSize: 3000 } })
        setPermisos(resP?.data || [])
        const resS = await SchedulesApiConector.get()
        setSchedules(resS || [])

        setLoading(false)
    }, [setLoading])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if (users) {
            const itms = users.filter(d => d.fullName.toLowerCase().includes(searchParam.toLowerCase()) || d.phoneNumber.toLowerCase().includes(searchParam.toLowerCase()))
            setFilteredUsers(itms);
            setTotalPages(Math.ceil(itms.length / ITEMS_PER_PAGE))
            setPage(1);
        }
    }, [users, searchParam])

    useEffect(() => {
        if (filteredUsers) {
            setUsersToShow(filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [filteredUsers, page])

    return (
        <>
            <div className="px-10">
                <PageTitle titulo="Configuración / Usuarios" icon="../../../Configuracion-icon.svg" />
                <FiltroPaginado add={true} paginacion={true} totalPage={totalPages} currentPage={page} handlePageChange={setPage}
                    onAdd={() => setShowModal(true)} resultados order={false} total={filteredUsers.length} search={setSearchParam}
                    searchPlaceholder="Buscar usuarios por nombre o teléfono">
                    {

                        usersToShow.length > 0 &&
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {
                                usersToShow.map(p => <CuadroUsuarios key={user._id} user={p} />)
                            }
                        </div>
                    }
                    {
                        usersToShow.length === 0 &&
                        <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                            Sin resultados
                        </div>
                    }
                </FiltroPaginado>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 top-0 z-30 bg-main-background">
                    Registrar usuario
                </h2>
                <AddUsuario isOpen={showModal} onCancel={() => setShowModal(false)} schedules={schedules} />
            </Modal>

            <Modal
                isOpen={selectedUser._id !== "" && !showMiniModal}
                onClose={() => setSelectedUser(user)}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 top-0 z-30 bg-main-background">
                    Editar usuario
                </h2>
                <AddUsuario isOpen={selectedUser._id !== "" && showMiniModal ? true : false} schedules={schedules}
                    onCancel={() => {
                        setSelectedUser(user)
                        setShowMiniModal(false);
                    }} />
            </Modal>

            <Modal
                isOpen={selectedUser._id !== "" && showMiniModal ? true : false}
                onClose={() => {
                    setSelectedUser(user)
                    setShowMiniModal(false);
                }}
                className="w-3/12"
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 top-0 z-30">
                    Asignar permisos y zonas
                </h2>
                <div className="p-6">
                    <AsignarPermisos
                        permisos={permisos}
                        zonas={zonas}
                        onCancel={() => {
                            setSelectedUser(user);
                            setShowMiniModal(false);
                        }} />
                </div>
            </Modal>
        </>
    )
}

export { Usuarios }