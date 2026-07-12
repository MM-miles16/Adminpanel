'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./addcardetails.css";

export default function AddCarDetails() {

    const router = useRouter();

    const [form, setForm] = useState({

        mileage:"",
        engineCC:"",
        registration:"",
        airbags:"",
        description:""

    });

    const handleChange=(e)=>{

        setForm({
            ...form,
            [e.target.name]:e.target.value
        })

    }

    const handleSubmit=(e)=>{

        e.preventDefault();

        router.push("/add-car-location");

    }

    return(

        <div className="adding-car-page">

            <div className="adding-car-card">

                <div className="adding-car-header">

                    <h1 className="adding-car-title">
                        Let's Start with Your Car Details
                    </h1>

                    <p className="adding-car-subtitle">
                        These car details will be shown to users when they book your car.
                    </p>

                </div>

                <form
                className="adding-car-form"
                onSubmit={handleSubmit}
                >

                    <div className="adding-car-field">

                        <label className="adding-car-label">Car Mileage</label>

                        <input
                        type="text"
                        name="mileage"
                        className="adding-car-input"
                        onChange={handleChange}
                        value={form.mileage}
                        />

                    </div>

                    <div className="adding-car-field">

                        <label  className="adding-car-label">Engine CC</label>

                        <input
                        type="text"
                        name="engineCC"
                        className="adding-car-input"
                        onChange={handleChange}
                        value={form.engineCC}
                        />

                    </div>

                    <div className="adding-car-field">

                        <label className="adding-car-label">Car Registration Number</label>

                        <input
                        type="text"
                        name="registration"
                        className="adding-car-input"
                        onChange={handleChange}
                        value={form.registration}
                        />

                    </div>

                    <div className="adding-car-field">

                        <label className="adding-car-label">No of Airbag</label>

                        <input
                        type="number"
                        name="airbags"
                        className="adding-car-input"
                        onChange={handleChange}
                        value={form.airbags}
                        />

                    </div>

                    <div
                    className="adding-car-field"
                    style={{gridColumn:"1 / -1"}}
                    >

                        <label className="adding-car-label">Car Description</label>

                        <textarea

                        name="description"

                        maxLength={165}

                        rows={4}

                        className="adding-car-description"

                        placeholder="Write about your car (Maximum 165 characters)"

                        onChange={handleChange}

                        value={form.description}

                        />

                        <div className="adding-car-counter">

                            {form.description.length}/165

                        </div>

                    </div>

                    <div className="adding-car-bottom">

                        <button
                        className="adding-car-btn"
                        type="submit"
                        >
                            SAVE AND CONTINUE
                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}