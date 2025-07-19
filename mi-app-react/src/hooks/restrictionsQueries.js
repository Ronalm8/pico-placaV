import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestrictions, addCity, updateRestriction, deleteCity } from '../services/api';

export const useGetRestrictions = () => {
  return useQuery({
    queryKey: ['restrictions'],
    queryFn: getRestrictions,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useAddCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ city, weekTemplate }) => addCity(city, weekTemplate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restrictions'] });
    },
  });
};

export const useUpdateRestriction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ city, day, plates, schedules }) =>
      updateRestriction(city, day, plates, schedules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restrictions'] });
    },
  });
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (city) => deleteCity(city),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restrictions'] });
    },
  });
};
