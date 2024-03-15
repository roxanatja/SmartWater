import { ChangeEvent, useContext, useState, useEffect } from "react";
import "./AgregarCliente.css";
import { ImagenInsertar } from "../../../components/ImagenInsertar/ImagenInsertar";
import { ClientesContext } from "../ClientesContext";
import { GoogleMaps } from "../../../components/GoogleMaps/GoogleMaps";
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
    const [storeImage, setStoreImage] = useState<File | null>(null);
    const [checkbox1, setCheckbox1] = useState<boolean>(false);
    const [checkbox2, setCheckbox2] = useState<boolean>(false);
    const [imageCarnetTrasero, setImageCarnetTrasero] = useState<string | null>(null);
    const [imageCarnetDelantero, setImageCarnetDelantero] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isChecked2, setIsChecked2] = useState<boolean>(false);
    const api: string = "AIzaSyApnMcPn7E_7oPoQzelrTZX0OjDwrNbsco";
    const [showMap, setShowMap] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");

    const [fullName, setFullName] = useState<string>("");
    const [bill, setBill] = useState<string>("");
    const [nit, setNit] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    let url = `https://www.google.com/maps/place/${(address)}`;
    const [zoneSelected, setZoneSelected] = useState<string>("");
    const [districts, setDistricts] = useState<District[]>([]);
    const [districtSelected, setDistrictSelected] = useState<string>("");
    const [comment, setComment] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setStoreImage(file);
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    
    const handleSelectImage = () => {
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        fileInput.click();
    };

    const saveImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'nn9rw8nv');
        formData.append('api_key', '799292358463167');

        const response = await fetch("https://api.cloudinary.com/v1_1/ddpagwxh6/image/upload", {
            method: "POST",
            body: formData
        });

        const responseData = await response.json();
        return responseData;
    };

    const capitalize = (value: string) => {   //Función para capitalizar la primera letra de cada palabra.
        return value.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    const verifyPhoneNumber = (value: string) => {
        if (!value.startsWith("+")) {
            var newValue = "+" + value;

            return newValue;
        } else {
            return value;
        }
    }

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        
        setAddress(value);
    };

    const getCoordinates = async () => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
        const response = await fetch(url);
        const data = await response.json();
        let latitude = "0", longitude = "0";

        if(data.length > 0){
            latitude = data[0].lat;
            longitude = data[0].lon;

        } else {
            console.error("No se encontraron coordenadas");
        };

        setLatitude(latitude);
        setLongitude(longitude);
    };

    const showMapLocation = () => {
        getCoordinates();
        console.log("Mostrar mapa", longitude, latitude);
        setShowMap(true);
    }

    const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setComment(value);
    };

    const handleZoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        // eslint-disable-next-line
        zones.map((zone: any) => {
            if(zone.name === value){
                setZoneSelected(zone._id);
                setDistricts(zone.districts);
            }
        });
    };

    const handleDistricChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        // eslint-disable-next-line
        districts.map((district) => {
            if(district._id === value){
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

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    };
    const toggleSwitch2 = () => {
        setIsChecked2(!isChecked2);
    };

    const saveData = async() => {
        let urlStoreImg;

        if (storeImage) {
            urlStoreImg = await saveImage(storeImage);
        } else {
            console.error("No se encontró imagen");
            return window.alert("Porfavor, adjunte una imagen");
        };

        try{
            const dataToSave = {
                user: "63d955b101f27eac0197bb16",
                storeImage: urlStoreImg.secure_url,
                fullName: fullName,
                phoneNumber: await verifyPhoneNumber(phoneNumber),
                email: email,
                address: address,
                comment: comment,
                ciFrontImage: imageCarnetTrasero,
                ciBackImage: imageCarnetDelantero,
                zone: zoneSelected,
                district: districtSelected,
                location: {
                    latitude: latitude,
                    longitude: longitude,
                },
                renewInDays: "10",
                billingInfo: {
                    NIT: nit,
                    phoneNumber: phoneNumber,
                },
                isAgency: checkbox2,
            };

            const resp = await saveClient(dataToSave);

            if(resp === 200){
                console.log('Client successfully registered', dataToSave);
                window.alert('Cliente registrado correctamente');
                window.location.reload();
            }else{
                console.error('Error registering client', dataToSave);
                window.alert('Error al registrar el cliente');
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
                                <input type="text" className="input-text" placeholder="Juan Alvarez" value={fullName} onChange={handleNameChange}/>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Datos de facturación</label>
                                <input type="text" className="input-text" value={bill} onChange={handleBillChange}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Número de NIT</label>
                                <input type="text" className="input-text" placeholder="" value={nit} onChange={handleNitChange}/>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Correo electronico</label>
                                <input type="email" className="input-text" placeholder="juanAlvares@gmail.com" value={email} onChange={handleEmailChange}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Número de teléfono</label>
                                <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                                    <div style={{width: "15%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", border: "1px solid #000", borderEndEndRadius: "0px", borderStartEndRadius: "0px"}}>
                                        <img src="./Telefono-icon.svg" alt="" />
                                    </div>
                                    <input type="text" className="input-text" style={{width: "100%", borderStartStartRadius: "0px", borderEndStartRadius: "0px", textAlign: "start"}} placeholder="591 7510584" value={phoneNumber} onChange={handlePhoneNumberChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Dirección</label>
                                <input type="text" className="input-text" placeholder="Av. Abel Iturralde 1067, La Paz" value={address} onChange={handleAddressChange} />
                                        <div className="ubicacion" style={{marginTop: "10px"}}>
                                            <img src="./Googlemap-Icon.svg" alt="" />
                                            <a className="text-ubi" target="_blank" rel="noopener noreferrer" href={url}>Ver ubicación en Google Maps</a>
                                        </div>
                                    </div>
                                    <div className="input-grup">
                                        <label className="label-grup">Referencia</label>
                                        <input type="text" className="input-text" value={comment} onChange={handleCommentChange} />
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
                            <div className="Ubi-Google">
                                {
                                    showMap ? 
                                        <>
                                            <button onClick={() => setShowMap(false)} className="btn-ubi">Ocultar mapa</button>
                                            <GoogleMaps apiKey={api} />
                                        </>
                                    : 
                                        <button onClick={() => showMapLocation()} className="btn-ubi">Mostrar mapa</button>
                                }
                            </div>
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
