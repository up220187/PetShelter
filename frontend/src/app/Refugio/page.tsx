"use client";

import Image from "next/image";

export default function ShelterDashboardPage() {
    return (
        <div className="shelter-dashboard-content">
            <div className="shelter-left-content">
                <div className="shelter-text-overlay">
                    <p>
                        Gestiona fácilmente el perfil y las fotos de tus mascotas disponibles para adopción.
                    </p>
                    <p>Recibe, revisa y responde solicitudes de adopción desde un solo lugar.</p>
                    <p className="shelter-mission-text">
                        Automatiza tu proceso de adopción con formularios digitales y seguimiento en tiempo real. Ayuda a que más mascotas encuentren un hogar compartiendo sus historias.
                    </p>
                </div>
                <Image
                    src="/Dog.png"
                    alt="Dog in background"
                    layout="fill"
                    objectFit="cover"
                    className="background-dog-image"
                />
            </div>

            <div className="shelter-right-content">
                <Image
                    src="/doggi.png"
                    alt="Adopta un perro"
                    width={300}
                    height={400}
                    className="adopta-perro-image"
                />
            </div>
        </div>
    );
}