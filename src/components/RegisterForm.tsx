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
        <section className="home-section rounded-2xl p-8 w-full max-w-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6">Registrarse a Ahorrista</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-600 bg-transparent rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="passwd" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                        type="password"
                        name="passwd"
                        id="passwd"
                        value={formData.passwd}
                        onChange={handleChange}
                        className="w-full border border-gray-600 bg-transparent rounded-md p-2"
                        required
                    />
                </div>
                <button
                    id="registerSubmit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer mt-4 hover:bg-blue-700 transition"
                    type="submit"
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
        </section>
    );
}
