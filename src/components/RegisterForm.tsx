import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuthContext } from "../context/AuthContext";
import Link from 'next/link';
import { RegisterRequest } from "@/interfaces/Auth/RegisterRequest";

export default function RegisterForm() {
    const [formData, setFormData] = useState<RegisterRequest>(
        { email: '', passwd: '' }
    );
    const { register } = useAuthContext();
    const router = useRouter();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(formData);
        await register(formData);
        router.push("/");
    }

    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm p-6 bg-white rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                Registrarse a Ahorrista
            </h2>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
                className="w-full mb-4 p-2 border rounded text-blue-600"
            />

            <input
                type="password"
                name="passwd"
                value={formData.passwd}
                onChange={handleChange}
                placeholder="Contraseña"
                required
                className="w-full mb-4 p-2 border rounded text-blue-600"
            />

            <button
                id="registerSubmit"
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Registrarse
            </button>

            <p className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </form>
    </div>
);

}
