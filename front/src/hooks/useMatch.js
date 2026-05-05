import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api.js';

/**
 * Hook para gestionar las matches.
 * Al ser un endpoint público, no requiere token.
 */
export const useMatch = () => {
    const queryClient = useQueryClient();

    /**
     * Obtiene el listado completo de matches.
     */
    const { data: matches, isLoading, error } = useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            const { data } = await api.get('/partidas');
            return data;
        },
        staleTime: 300000,
    });

    /**
     * Guarda una nueva partida.
     * @param {Object} params - Objeto con idUsuario y los datos de la partida.
     */
    const saveMatch = useMutation({
        mutationFn: async ({ form }) => {
            // Asumiendo que envías el idUsuario en el body o como parte del objeto
            const { data } = await api.post('/partidas', form);
            return data;
        },
        onSuccess: () => {
            // Invalidamos 'matches' para que el listado se refresque automáticamente
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        }
    });

    /**
     * Solicita información de una partida específica por su ID.
     * @param {number|string} id 
     */
    const getMatchById = async (id) => {
        try {
            const { data } = await api.get(`/partidas/${id}`);
            return data;
        } catch (error) {
            console.error("Error al obtener la partida:", error.response?.data?.message);
            throw error;
        }
    };

    return {
        matches,
        isLoading,
        error,
        saveMatch: saveMatch.mutate,
        isSaving: saveMatch.isPending,
        saveError: saveMatch.error,
        getMatchById
    };
};