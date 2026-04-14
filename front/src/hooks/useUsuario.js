//Importación de los métodos de react-query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';

//Importación de la configuración de Axios (/api/api.js).
import api from '../api/api.js';

export const useUsuario = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const token = localStorage.getItem('auth_token');

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await api.get('/perfil');
            return response.data;
        },
        //Solo ejecuta el Fn si no existe un token.
        enabled:!token,

        //Número de reintentos si falla.
        retry: 1,

        //Tiempo interno de Axios para considerar que la información recibida es 'vieja'.
        //> Nota: Se indica en milisegundos.
        staleTime: 300000, // 5 minutos.
    });

    //Actualizar avatar del usuario.
    const login = useMutation({
        mutationFn: async (form) => {
            const response = await api.post('/login', form);
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data.token)
            //Guardamos el token en local
            localStorage.setItem('auth_token', data.token);

            //Guardamos en la caché de React la información del usuario.
            queryClient.setQueryData(['authUser'], data.usuario);
            console.log(data.usuario)
            //Actualiza la información del usuario.
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            
            console.log("Login exitoso para:", data.usuario.nick);
            navigate('/perfil');
            
        },
        //Printar por consola el mensaje en caso de error (Provisional)
        onError: (error)=>{
            console.log("Error al logear", error.response?.data?.message);
        }
    });

    //Actualizar avatar del usuario.
    const updateAvatar = useMutation({
        mutationFn: async (form) => {
            const response = await api.post('/usuarios/update', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        },
        onSuccess: () => {
            //Hace que, de forma automática, se sobreescriba la cache y se visualice la nueva imagen.
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        }
    });


    return {
        user,
        isLoading,
        error,
        updateAvatar: updateAvatar.mutate,
        isUpdating: updateAvatar.isPending,
        login: login.mutate,
        isLogin: login.isPending,
    };
};