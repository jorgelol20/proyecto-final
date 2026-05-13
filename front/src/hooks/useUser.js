import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';

export const useUser = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    /**
     * Busca el token en localStorage.
     */
    const token = localStorage.getItem('auth_token');

    /**
     * Recupera el perfil del usuario desde el backend.
     * React Query gestiona automáticamente el estado de carga y tener en caché la información.
     */
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            try{
                const response = await api.get('/perfil');
                return response.data.usuario || response.data;
            }catch(e){
                return null
            }
            
        },

        // Si no existe token, ejecuta la función queryFn.
        enabled: !!token,

        // Número de intentos para realizar la solicitud.
        retry: 3,

        // Tiempo que React Query tratará como "nueva" la información del usuario (5min).
        staleTime: 300000,
    });

    /**
     * Función para realizar login.
     * Si consigue logearse correctamente, guarda la información de este usuario y
     * lo reenvia a la página de su perfil.
     */
    const login = useMutation({
        mutationFn: async (form) => {
            const { data } = await api.post('/login', form);
            return data;
        },
        onSuccess: (data) => {
            // Actualizar el tekon en Axios tras login.
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            //Actualiza la información del usuario para que se aplique en la página.
            localStorage.setItem('auth_token', data.token);
            queryClient.setQueryData(['authUser'], data.usuario);
            navigate(`/`);
        },
        
    });

    /**
     * Función para cerrar sesión.
     * Reenvía al usuario directamente a la página de Login.
     */
    const logout = () => {
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];
        queryClient.removeQueries({ queryKey: ['authUser'] });
        navigate('/login');
    };

    /**
     * Solicita mediante el nick la información de un usuario en concreto.
     * * @param {string} nick 
     * @returns 
     */
    const getUsuario = async (nick) => {
        try {
            const response = await api.get(`/usuarios/${nick}`);
            return response.data.usuario;
        } catch (error) {
            console.error("Error al obtener usuario:", error.response?.data?.message);
            throw error;
        }
    };

    const searchUsuario = async (search) => {
        try {
            const response = await api.get(`/usuarios/search/${search}`)
            console.log(response.data.usuarios)
            return response.data.usuarios
        } catch (error) {
            console.error("Error al obtener usuario:", error.response?.data?.message);
            throw error;
        }
    }

    /**
     * Manda una solicitud de registro.
     * Si es exitosa, deja al usuario logeado y lo reenvia a su perfil.
     */
    const signup = useMutation({
        mutationFn: async (form) => {
            // Nota: Se cambió ({form}) a (form) para consistencia
            const { data } = await api.post(`/usuarios/`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem('auth_token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            queryClient.setQueryData(['authUser'], data.usuario);
            navigate(`/perfil/${data.usuario.nick}`);
        }
    });

    /**
     * Manda la petición para actualizar los datos del usuario y fuerza un 
     * reinicio de del DOM para actualziar los datos.
     */
    const update = useMutation({
        mutationFn: async ({ nick, form }) => {
            const { data } = await api.post(`/usuarios/${nick}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            queryClient.setQueryData(['authUser'], data.usuario);
            navigate(`/perfil/${data.nick}`);
        }
    });

    /**
     * 
     */
    const comment = useMutation({
        mutationFn: async (form) => {
            console.log(form)
            const { data } = await api.post(`/usuarios/comentario/`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            queryClient.setQueryData(['authUser'], data.usuario);
        }
    });

    /**
     * 
     */
    const deleteComment = useMutation({
        mutationFn: async (comentarioId) => {
            // Pasamos el ID directamente en la ruta
            const { data } = await api.delete(`/usuarios/comentario/${comentarioId}`);
            return data;
        },
        onSuccess: () => {
            requestMatch(); // Refrescar lista
        }
    });

    /**
     * 
     */
    const updateComment = useMutation({
        mutationFn: async (form) => {
            console.log(form)
            const { data } = await api.put(`/usuarios/comentario/`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            queryClient.setQueryData(['authUser'], data.usuario);
        }
    });

    const getVictoryRanking = async () => {
        try {
            const response = await api.get(`/ranking-victorias`);
            return response.data.usuarios;
        } catch (error) {
            console.error("Error al obtener el ranking:", error.response?.data?.message);
            throw error;
        }
    };
    const getRoundRanking = async () => {
        try {
            const response = await api.get(`/ranking-rondas`);
            return response.data.usuarios;
        } catch (error) {
            console.error("Error al obtener el ranking:", error.response?.data?.message);
            throw error;
        }
    };

    return {
        user,
        isLoading,
        error,
        update: update.mutate,
        updateError: update.error,
        isUpdating: update.isPending,
        login: login.mutate,
        isLogin: login.isPending,
        loginError: login.error,
        signup: signup.mutate,
        isSingingup: signup.isPending,
        signupError: signup.error,
        logout,
        getUsuario,
        searchUsuario,
        comment: comment.mutate,
        commentError: comment.error,
        isCommenting: comment.isPending,
        deleteComment: deleteComment.mutate,
        deleteCommentError: deleteComment.error,
        isDeletingComment: deleteComment.isPending,
        getVictoryRanking,
        getRoundRanking,
    };
};