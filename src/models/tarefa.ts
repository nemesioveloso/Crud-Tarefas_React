export interface Tarefa {
    id: number | string;
    titulo: string;
    descricao: string;
    dataCriacao: string;
    dataConclusao: string | null;
    status: 'ABERTA' | 'EM_aNDAMENTO' | 'CONCLUIDA';
  }