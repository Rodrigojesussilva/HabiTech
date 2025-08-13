import { useLocation } from 'react-router-dom';

/**
 * Hook que detecta automaticamente se estamos numa rota de visualização
 * @returns boolean - true se estiver numa rota de view (somente leitura)
 */
export const useViewMode = (): boolean => {
  const location = useLocation();
  
  // Detecta rotas que são de visualização (somente leitura)
  const isViewRoute = location.pathname.includes('/view-');
  
  return isViewRoute;
};

export default useViewMode; 