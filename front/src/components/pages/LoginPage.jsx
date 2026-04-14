import { useState } from 'react';
import { useUsuario } from '../../hooks/useUsuario.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login, isLogin, isError, error } = useUsuario();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Llamamos a la función del hook
        login({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email"
                required 
            />
            <br />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Contraseña"
                required 
            />
            <br />
            <button type="submit" disabled={isLogin}>
                {isLogin ? 'Entrando...' : 'Login'}
            </button>

            {isError && (
                <p style={{ color: 'red' }}>
                    {error.response?.data?.message || 'Credenciales incorrectas'}
                </p>
            )}
        </form>
    );
};
export default Login;