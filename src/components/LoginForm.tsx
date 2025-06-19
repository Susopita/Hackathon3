'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '@/interfaces/Auth/LoginRequest';
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';

const Login: React.FC = () => {
    const [form, setForm] = useState<LoginRequest>({ email: '', passwd: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuthContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(form);
            router.push('/main');
        } catch (err) {
            setError('Correo o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm p-6 bg-white rounded shadow"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Iniciar sesión
                </h2>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    required
                    className="w-full mb-4 p-2 border rounded text-blue-600"
                />

                <input
                    type="password"
                    name="passwd"
                    value={form.passwd}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    required
                    className="w-full mb-4 p-2 border rounded text-blue-600"
                />

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? 'Ingresando...' : 'Entrar'}
                </button>

                <p className="mt-4 text-center text-sm">
                    ¿No tienes una cuenta?{' '}
                    <Link href="/auth/register" className="text-blue-600 hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
