import React, { useEffect } from 'react';
import { useUsuario } from '../../hooks/useUsuario.js';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    const { user, isLoading, isError, error } = useUsuario();
    useEffect(()=>{
        //Si el token ya no es válido, reenviamos a la página de login.
        if (isError) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                navigate('/login');
            }else{
                return <p>Error al conectar con el servidor</p>
            }
        }
    },[])
    //Carga de la página
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Cargando perfil...</p>
            </div>
        );
    }
    // Carga de los datos del usuario
        return (
            <div className="profile-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Mi Perfil</h2>
                <hr />
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
                    {/* Imagen de perfil */}
                    <div className="avatar-wrapper">
                        <img 
                            src={user.avatar ??""} 
                            alt="Avatar" 
                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
                        />
                    </div>

                    {/* Datos del usuario */}
                    <div className="user-info">
                        <p><strong>Nick:</strong> {user.nick}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Rol:</strong> {user.es_admin ? 'Administrador' : 'Usuario estándar'}</p>
                        <p><strong>Miembro desde:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/edit-profile')}
                    style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
                >
                    Editar Perfil
                </button>
            </div>
    );
};

export default ProfilePage;