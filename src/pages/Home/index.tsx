import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Tarefa } from '../../models/tarefa';

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};



export function Home() {
  const [dadosTable, setDadosTable] = useState<Tarefa[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [currentTarefa, setCurrentTarefa] = useState<Tarefa | null>(null);
  const [newTarefa, setNewTarefa] = useState({ titulo: '', descricao: '', status: 'ABERTA' });

  const handleEdit = (tarefa: Tarefa) => {
    setCurrentTarefa(tarefa);
    setOpenEditDialog(true);
  };

  const handleEditSelectChange = (event: SelectChangeEvent<string>) => {
    if (currentTarefa) {
      setCurrentTarefa({
        ...currentTarefa,
        [event.target.name as string]: event.target.value,
      });
    }
  };

  const handleEditTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentTarefa) {
      setCurrentTarefa({
        ...currentTarefa,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleEditSave = async () => {
    if (currentTarefa) {
      const dados = {
        titulo: currentTarefa.titulo,
        descricao: currentTarefa.descricao,
        status: currentTarefa.status,
      };

      try {
        await axios.put(`http://localhost:8080/tarefas/${currentTarefa.id}`, dados);
        listarTarefas();
        setOpenEditDialog(false);
      } catch (error) {
        console.error('Error in PUT request:', error);
      }
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await axios.delete(`http://localhost:8080/tarefas/${id}`);
      listarTarefas();
    } catch (error) {
      console.error('Error in DELETE request:', error);
    }
  };

  const listarTarefas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tarefas');
      const formattedData = response.data.map((tarefa: Tarefa) => ({
        ...tarefa,
        dataCriacao: formatDateTime(tarefa.dataCriacao),
        dataConclusao: tarefa.dataConclusao ? formatDateTime(tarefa.dataConclusao) : '-'
      }));
      setDadosTable(formattedData);
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  };

  const criarTarefa = async () => {
    try {
      const response = await axios.post('http://localhost:8080/tarefas', newTarefa);
      listarTarefas()
      setOpenNewDialog(false)
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  };

  const handleNewSelectChange = (event: SelectChangeEvent<string>) => {
    setNewTarefa({
      ...newTarefa,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTarefa({
      ...newTarefa,
      [event.target.name]: event.target.value,
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 20,
      flex: 0.1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'titulo',
      headerName: 'Titulo',
      minWidth: 50,
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      minWidth: 50,
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'dataCriacao',
      headerName: 'Data Criação',
      minWidth: 50,
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'dataConclusao',
      headerName: 'Data Conclusão',
      minWidth: 50,
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 50,
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      minWidth: 100,
      flex: 0.6,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Grid container alignItems='center' spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleEdit(params.row)}
            >
              Editar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(params.row.id)}
            >
              Excluir
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  useEffect(() => {
    listarTarefas();
  }, []);

  return (
    <Box sx={{ padding: { xs: 0, sm: 1, md: 2, lg: 4 } }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h4" textAlign="center">
            Lista de Tarefas
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={dadosTable}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 50]}
          />
        </Grid>
        <Grid item xs={12} textAlign='end'>
          <Button variant="contained" color="primary" onClick={() => setOpenNewDialog(true)}>
            Nova Tarefa
          </Button>
        </Grid>
      </Grid>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="titulo"
                label="Titulo"
                type="text"
                fullWidth
                value={currentTarefa?.titulo || ''}
                onChange={handleEditTextFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="descricao"
                label="Descrição"
                type="text"
                fullWidth
                value={currentTarefa?.descricao || ''}
                onChange={handleEditTextFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  margin="dense"
                  name="status"
                  label="Status"
                  fullWidth
                  value={currentTarefa?.status || ''}
                  onChange={handleEditSelectChange}
                >
                  <MenuItem value="ABERTA">ABERTA</MenuItem>
                  <MenuItem value="EM_ANDAMENTO">EM ANDAMENTO</MenuItem>
                  <MenuItem value="CONCLUIDA">CONCLUIDA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)}>
        <DialogTitle>Nova Tarefa</DialogTitle>

        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="titulo"
                label="Titulo"
                type="text"
                fullWidth
                value={newTarefa.titulo}
                onChange={handleNewTextFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="descricao"
                label="Descrição"
                type="text"
                fullWidth
                value={newTarefa.descricao}
                onChange={handleNewTextFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select">Status</InputLabel>
                <Select
                  margin="dense"
                  name="status"
                  label="Status"
                  fullWidth
                  value={newTarefa.status}
                  onChange={handleNewSelectChange}
                >
                  <MenuItem value="ABERTA">ABERTA</MenuItem>
                  <MenuItem value="EM_ANDAMENTO">EM ANDAMENTO</MenuItem>
                  <MenuItem value="CONCLUIDA">CONCLUIDA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={criarTarefa} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
