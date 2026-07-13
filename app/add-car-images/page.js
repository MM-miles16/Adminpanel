'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./addcarimages.css";

export default function AddCarImages() {

    const router = useRouter();

    const [agree,setAgree]=useState(false);

    const [images,setImages]=useState({
        front:null,
        back:null,
        side:null,
        inside:null
    });

    const [preview,setPreview]=useState({
        front:"",
        back:"",
        side:"",
        inside:""
    });

    const [showSuccess,setShowSuccess]=useState(false);

    const handleImage=(e,key)=>{

        const file=e.target.files[0];

        if(!file) return;

        setImages(prev=>({
            ...prev,
            [key]:file
        }));

        setPreview(prev=>({
            ...prev,
            [key]:URL.createObjectURL(file)
        }));

    }

    const handleSubmit=(e)=>{

        e.preventDefault();

        if(!agree){

            alert("Please accept Terms & Conditions.");

            return;

        }

        setShowSuccess(true);

        setTimeout(()=>{

            router.push("/cars");

        },2200);

    }

    const UploadBox=(title,key)=>(
        <div className="adding-car-upload-field">

            <label className="adding-car-label">

                {title}

            </label>

            <label className="adding-car-upload-box">

                {preview[key] ? (

                    <img
                    src={preview[key]}
                    className="adding-car-preview"
                    />

                ):(

                    <>

                    <div className="adding-car-upload-icon">

                        ☁

                    </div>

                    <span className="adding-car-upload-btn">

                        Upload File

                    </span>

                    </>

                )}

                <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e)=>handleImage(e,key)}
                />

            </label>

        </div>
    );

    return(

        <div className="adding-car-page">

            <div className="adding-car-card">

                <div className="adding-car-header">

                    <h1 className="adding-car-title">

                        Provide Your Vehicle Photos

                    </h1>

                    <p className="adding-car-subtitle">

                        These car photos will be shown to users when they book your car.

                    </p>

                </div>

                <form
                className="adding-car-form"
                onSubmit={handleSubmit}
                >

                    {UploadBox("Add Front Car Image","front")}

                    {UploadBox("Add Back Car Image","back")}

                    {UploadBox("Add Side Car Image","side")}

                    {UploadBox("Add Inside Car Image","inside")}

                    <div className="adding-car-terms">

                        <label>

                            <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e)=>setAgree(e.target.checked)}
                            />

                            <span>

                            I agree to the Company's Terms & Conditions and confirm that my car insurance is active and valid.

                            </span>

                        </label>

                    </div>

                    
                    <div className="adding-car-bottom">

                        <button
                        type="submit"
                        className="adding-car-btn"
                        >
                        FINALIZE AND ADD
                        </button>

                    </div>

                </form>

            </div>

            {showSuccess &&(

                <div className="adding-car-success-overlay">

                    <div className="adding-car-success-box">

                        <div className="adding-car-success-icon">

                            ✓

                        </div>

                        <h2 className="adding-car-success-h">

                            Car Added Successfully

                        </h2>

                        <p className="adding-car-success-p">

                            Your vehicle has been added successfully.

                        </p>

                    </div>

                </div>

            )}

        </div>

    )

}