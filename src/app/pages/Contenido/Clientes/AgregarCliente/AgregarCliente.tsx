import { ChangeEvent, useContext, useState, useEffect } from "react";
import "./AgregarCliente.css";
//import { GoogleMapComponent } from "../../../components/GoogleMaps/GoogleMapComponent";
import { ImagenInsertar } from "../../../components/ImagenInsertar/ImagenInsertar";
import { ClientesContext } from "../ClientesContext";
import { GoogleMaps } from "../../../components/GoogleMaps/GoogleMaps";
// import { GetDistricts } from "../../../../../services/DistrictsService";
import { GetZone } from "../../../../../services/ZonesService";
import { saveClient } from "../../../../../services/ClientsService";

interface District {
    _id: string;
    name: string;
    description: string;
};

interface Zone {
    id: string;
    name: string;
    districts: Array<District>;
};

const AgregarCliente = () => {
    const { setShowModal } = useContext(ClientesContext);
    const [zones, setZones] = useState<Array<Zone>>([]);

    const loadZones = async () => {
        await GetZone().then((resp) => {
            setZones(resp.data);
            setDistricts(resp.data[0].districts);
        });
    }

    useEffect(() => {
        loadZones();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [checkbox1, setCheckbox1] = useState<boolean>(false);
    const [checkbox2, setCheckbox2] = useState<boolean>(false);
    const [imageCarnetTrasero, setImageCarnetTrasero] = useState<string | null>(null);
    const [imageCarnetDelantero, setImageCarnetDelantero] = useState<string | null>(null);
    const [imageCasa, setImageCasa] = useState<string | null>(null);
    //const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isChecked2, setIsChecked2] = useState<boolean>(false);
    const api: string = "AIzaSyApnMcPn7E_7oPoQzelrTZX0OjDwrNbsco";

    const [fullName, setFullName] = useState<string>("");
    const [bill, setBill] = useState<string>("");
    const [nit, setNit] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [zoneSelected, setZoneSelected] = useState<string>("");
    const [districts, setDistricts] = useState<District[]>([]);
    const [districtSelected, setDistrictSelected] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    
    const handleSelectImage = () => {
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        fileInput.click();
    };

    const capitalize = (value: string) => {   //Función para capitalizar la primera letra de cada palabra.
        return value.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(zones)
        const value = event.target.value;

        const capitalizedValue = capitalize(value);

        setFullName(capitalizedValue);
    };

    const handleBillChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setBill(value);
    };

    const handleNitChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setNit(value);
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setEmail(value);
    };

    const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        
        setPhoneNumber(value);
    };

    const handleZoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        // eslint-disable-next-line
        zones.map((zone) => {
            if(zone.name === value){
                setZoneSelected(zone.id);
                setDistricts(zone.districts);
            }
        });
    };

    const handleDistricChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        
        // eslint-disable-next-line
        districts.map((district) => {
            if(district.name === value){
                setDistrictSelected(district._id);
            }
        });
    };

    const handleCheckbox1Change = () => {
        setCheckbox1(!checkbox1);
        if (checkbox2) {
        setCheckbox2(false);
        }
    };

    const handleCheckbox2Change = () => {
        setCheckbox2(!checkbox2);
        if (checkbox1) {
        setCheckbox1(false);
        }
    };

    /*const handleLocationSelect = (location: google.maps.LatLng) => {
        setSelectedLocation(location);
    };*/

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    };
    const toggleSwitch2 = () => {
        setIsChecked2(!isChecked2);
    };

    const saveData = async() => {
        try{
            const dataToSave = {
                user: "63d955b101f27eac0197bb16",
                storeImage: selectedImage,
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                zone: zoneSelected,
                district: districtSelected,
                // isFrequent: checkbox1,
                // isAgency: checkbox2,
                // renewalPeriod: isChecked,
                // renewalAverage: isChecked2,
                // image: selectedImage,
                cidFrontImage: imageCarnetTrasero,
                cidBackImage: imageCarnetDelantero,
                // imageCasa: imageCasa
                // bill: bill,
                // nit: nit,
            };
    
            const resp = await saveClient(dataToSave);

            if(resp && resp.status === 200){
                console.log('Sale successfully registered', dataToSave);
                window.alert('Venta registrada correctamente');
            };
        }catch(e){
            console.log(e);
        };
    };

return (
    <>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="Titulo-Modal">
                            <div>
                                <span>Regitrar cliente</span>
                            </div>
                            <div>
                                <button type="button" className="btn" onClick={handleCloseModal}><img src="./cerrar.svg" alt="" /></button>
                            </div>
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            {selectedImage !== null ?
                                <img className="img-modal" src={selectedImage} alt=""/>
                                :
                                <div className="img-modal">
                                    <span className="letras-img">LV</span>
                                </div>
                            }
                            <button onClick={handleSelectImage} className="btn-camara" type="button"><img src="./CamaraIcon.svg" alt="" /></button>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Nombre</label>
                                <input type="text" className="input-text" value={fullName} onChange={handleNameChange}/>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Datos de facturación</label>
                                <input type="text" className="input-text" value={bill} onChange={handleBillChange}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Número de NIT</label>
                                <input type="text" className="input-text" value={nit} onChange={handleNitChange}/>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Correo electronico</label>
                                <input type="email" className="input-text" value={email} onChange={handleEmailChange}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Número de teléfono</label>
                                <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                                    <div style={{width: "15%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", border: "1px solid #000", borderEndEndRadius: "0px", borderStartEndRadius: "0px"}}>
                                        <img src="./Telefono-icon.svg" alt="" />
                                    </div>
                                    <input type="text" className="input-text" style={{width: "100%", borderStartStartRadius: "0px", borderEndStartRadius: "0px", textAlign: "start"}} value={phoneNumber} onChange={handlePhoneNumberChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Dirección</label>
                                <input type="text" className="input-text"/>
                                <div className="ubicacion" style={{marginTop: "10px"}}>
                                    <img src="./Googlemap-Icon.svg" alt="" />
                                    <a className="text-ubi" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/@10.3649143,-75.4927273,15z?entry=ttu">Ver ubicación en Google Maps</a>
                                </div>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Referencia</label>
                                <input type="text" className="input-text"/>
                            </div>
                        </div>
                        <div className="grupo-input" style={{gap: "20px"}}>
                            <div className="input-grup">
                                <label className="label-grup">Zona</label>
                                <select id="zona" name="zona" className="input-select" onChange={handleZoneChange} >
                                    {
                                        zones.map((zone) => {                                            
                                            return <option key={zone.id} value={zone.id} >{zone.name}</option>
                                        })
                                    }                               
                                </select>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Barrio</label>
                                <select id="barrio" name="zona" className="input-select" onChange={handleDistricChange}>
                                    {
                                        districts.map((district) => {
                                            return <option key={district._id} value={district._id}>{district.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                            <div className="grupo-checbox">
                                <div className="grupo-check">
                                    <input
                                    className="input-check"
                                    type="checkbox"
                                    checked={checkbox1}
                                    onChange={handleCheckbox1Change}
                                    />
                                    <label className="text-check">Cliente habitual</label>
                                </div>
                                <div className="grupo-check">
                                    <input
                                    className="input-check"
                                    type="checkbox"
                                    checked={checkbox2}
                                    onChange={handleCheckbox2Change}
                                    />
                                    <label className="text-check">Agencia</label>
                                </div>
                            </div>
                            <div className="grupo-input">
                                <ImagenInsertar texto="Porfavor, adjunta foto del carnet (trasero)" imagenSelect={imageCarnetTrasero} onImagenSeleccionada={setImageCarnetTrasero} id="trasero" />
                            </div>
                            <div className="grupo-input">
                                <ImagenInsertar texto="Porfavor, adjunta foto del carnet (Delantero)" imagenSelect={imageCarnetDelantero} onImagenSeleccionada={setImageCarnetDelantero} id="delantero" />
                            </div>
                            <div className="grupo-input">
                                <ImagenInsertar texto="Foto de la fachada del domicilio" imagenSelect={imageCasa} onImagenSeleccionada={setImageCasa} id="casa" />
                            </div>
                            <div className="grupo-input">
                            <div className="Ubi-Google">
                                <GoogleMaps apiKey={api}/>
                            </div>
                            {/* {selectedLocation && (
                                <div className="Ubi-Google">
                                    Ubicación seleccionada: {selectedLocation.lat()}, {selectedLocation.lng()}
                                </div>
                            )} */}
                        </div>
                        <div className="grupo-input" style={{flexDirection: "column"}}>
                            <div className="switch-input">
                                <div style={{display: "flex", alignItems: "center", gap: "10px", flex: "1 0 0"}}>
                                    <img src="./Calendario-icon.svg" alt="" />
                                    <span className="title-switch" style={{ color: isChecked ? "#000" : "" }}>Período de Renovación</span>
                                </div>
                                <div style={{display:"flex", alignItems: "center", gap: "22px"}}>
                                    <div>
                                    <span className="title-switch" style={{ color:"#000"}}>Estado:</span>
                                    </div>
                                    <label className="switch-container">
                                        <input type="checkbox" checked={isChecked} onChange={toggleSwitch} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div style={{width: "100%", height: "100%", border: "1px black solid"}}></div>
                        </div>
                        <div className="grupo-input" style={{flexDirection: "column"}}>
                            <div className="switch-input">
                                <div style={{display: "flex", alignItems: "center", gap: "10px", flex: "1 0 0"}}>
                                    <img src="./Calendario-icon.svg" alt="" />
                                    <span className="title-switch" style={{ color: isChecked2 ? "#000" : "" }}>Renovación Promedio</span>
                                </div>
                                <div style={{display:"flex", alignItems: "center", gap: "22px"}}>
                                    <div>
                                    <span className="title-switch" style={{ color:"#000"}}>Estado:</span>
                                    </div>
                                    <label className="switch-container">
                                        <input type="checkbox" checked={isChecked2} onChange={toggleSwitch2} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div style={{width: "100%", height: "100%", border: "1px black solid"}}></div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
                        <button type="button" className="btn-registrar" onClick={saveData}>Registrar cliente</button>
                    </div>
                </div>
            </div>
        </form>
    </>
);
};

export { AgregarCliente };
