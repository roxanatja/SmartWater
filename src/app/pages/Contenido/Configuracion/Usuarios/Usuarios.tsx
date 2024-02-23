import { FC, useContext, useEffect, useState } from "react";
import "./Usuarios.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { UsuariosContext } from "./UsuariosContext";
import { AddUsuario } from "./AddUsuario/AddUsuario";
import { CuadroUsuarios } from "./CuadroUsuarios/CuadroUsuarios";
import { AsignarPermisos } from "./AsignarPermisos/AsignarPermisos";
import { GetUser } from "../../../../../services/UserService";
import { User } from "../../../../../type/User/User";

const Usuarios: FC = () => {

    const {showModal, setShowModal, showMiniModal} = useContext(UsuariosContext)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState<Array<User>>([]);

    const getUsers = async () => {
        try{
            await GetUser()
                .then((resp) => {
                    setUsers(resp);
                    setLoading(false);
                });
        }catch(e){
            console.error(e);
            setLoading(false);
            setError(true);
        };
    };

    useEffect(() => {
        getUsers();
    }, []);

    if (loading) {
        return <p>Cargando Usuarios</p>
    };

    if (error) {
        return <p>Ocurrio un error en la carga de datos, intentelo de nuevo en unos minutos</p>
    };

    const AgregarUsuario = () => {
        setShowModal(true)
    };

    const searchUser = (e: string) => {
        const value = e;
        
        if(value === ""){
            getUsers();
            return;
        } else {
            let resultado = users.filter(user => user.fullName.toLowerCase().includes(value.toLowerCase()));

            setUsers(resultado); 
        }
    };

    return(
        <>
        <div>
            <PageTitle titulo="Configuración / Usuarios" icon="../../../Configuracion-icon.svg"/> 
            <FiltroPaginado filtro ={false} onAdd={AgregarUsuario} add search={searchUser}>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "24px"}}>
                    {users.map((user, index) => {
                        return <CuadroUsuarios key={index} user={user}/>
                    })}
                </div>
            </FiltroPaginado>
        </div>
        {showModal && <AddUsuario/>}
        {showMiniModal && <AsignarPermisos/>}
        </>
    )
}

export{Usuarios}