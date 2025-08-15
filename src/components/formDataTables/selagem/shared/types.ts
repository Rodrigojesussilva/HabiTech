export type Selagem = {
  id: string;
  survey_id: string;
  created_by: string;
  visit_count: number;
  created_at: string;
  completed: boolean;
  completed_at?: string;
  survey: {
    main_metadata: {
      numero_sei: string;
    };
  };
  status_text?: string;
  is_latest?: boolean;
};

export interface SelagemListProps {
  data: Selagem[];
  onView?: (item: Selagem) => void;
  onEdit?: (item: Selagem) => void;
  onNewVisit?: (item: Selagem) => void;
  onDelete?: (item: Selagem) => void;
}

export interface FilterState {
  createdBy: string;
  initialDate: string;
  endDate: string;
  searchQuery: string;
} 