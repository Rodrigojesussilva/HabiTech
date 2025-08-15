export type Arrolamento = {
  id: string;
  survey_id: string;
  visit_count: number;
  completed: boolean;
  created_by: string;
  created_at: string;
  completed_at?: string;
  survey: {
    main_metadata: {
      numero_sei: string;
    };
  };
};

export interface ArrolamentoListProps {
  data: Arrolamento[];
  onView?: (item: Arrolamento) => void;
  onEdit?: (item: Arrolamento) => void;
  onNewVisit?: (item: Arrolamento) => void;
  onDelete?: (item: Arrolamento) => void;
}

export interface FilterState {
  createdBy: string;
  initialDate: string;
  endDate: string;
  searchQuery: string;
} 