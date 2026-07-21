import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Button,
  TextField,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Card,
  CardMedia,
  InputAdornment
} from '@mui/material';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdDelete, MdEdit, MdMap, MdClear } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { listRestaurants, deleteRestaurant } from '../api/restaurantService';
import type { restaurant } from '../interfaces/restaurant';
import { handleApiError } from '../utils/handleApiError';

function Row(props: { row: restaurant; onEdit: (id: number) => void; onDelete: (id: number) => void }) {
  const { row, onEdit, onDelete } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className="hover:bg-gray-50/40">
        <TableCell sx={{ width: 60 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" className="font-semibold text-gray-800">
          {row.name}
        </TableCell>
        <TableCell className="capitalize font-medium text-gray-700">
          {row.mode === "BOTH" ? "Dining & Takeout" : row.mode.toLowerCase()}
        </TableCell>
        <TableCell className="text-gray-600">{row.phone || '-'}</TableCell>
        <TableCell className="text-gray-600">{row.email || '-'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="bg-gray-50/50 p-5 rounded-md border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-start my-3 mx-2">
              <Box className="flex flex-col sm:flex-row gap-5 flex-1">
                {row.displayImage && (
                  <Card sx={{ maxWidth: 200, minWidth: 150 }} className="border border-gray-200 shadow-sm rounded-md overflow-hidden bg-white">
                    <CardMedia
                      component="img"
                      height="130"
                      image={row.displayImage}
                      alt={row.name}
                      className="object-contain max-h-[130px] p-2"
                    />
                  </Card>
                )}
                <Box className="flex flex-col gap-2">
                  <Typography variant="subtitle1" className="font-bold text-gray-800">
                    Detailed Information
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Address:</strong> {row.address || 'Not Provided'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Website:</strong> {row.website ? (
                      <a href={row.website.startsWith('http') ? row.website : `https://${row.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {row.website}
                      </a>
                    ) : 'Not Provided'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <strong>Coordinates:</strong> {row.latitude !== null && row.longitude !== null ? `${row.latitude}, ${row.longitude}` : 'Not Selected'}
                  </Typography>
                </Box>
              </Box>
              <Box className="flex flex-col gap-3 self-stretch justify-between items-end min-w-[160px] w-full md:w-auto mt-4 md:mt-0">
                {row.latitude !== null && row.longitude !== null && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MdMap />}
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`, '_blank')}
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold"
                  >
                    Open in Maps
                  </Button>
                )}
                <Box className="flex gap-2 w-full mt-auto pt-2">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<MdEdit />}
                    onClick={() => onEdit(row.id!)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold shadow-none"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<MdDelete />}
                    onClick={() => onDelete(row.id!)}
                    className="flex-1 bg-red-600 hover:bg-red-700 font-semibold shadow-none"
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function ManagePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"ALL" | "DINING" | "TAKEOUT" | "BOTH">("ALL");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // Delete Dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchName);
      setPage(0);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchName]);

  // Handle mode change reset page
  const handleModeChange = (value: "ALL" | "DINING" | "TAKEOUT" | "BOTH") => {
    setModeFilter(value);
    setPage(0);
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await listRestaurants({
        name: debouncedSearch.trim() || undefined,
        mode: modeFilter === "ALL" ? undefined : modeFilter,
        page: page + 1,
        limit: rowsPerPage
      });
      if (response.success && response.data) {
        const { rows, count } = response.data as { rows: restaurant[]; count: number };
        setRestaurants(rows || []);
        setTotalCount(count || 0);
      } else {
        toast.error("Failed to fetch restaurants");
      }
    } catch (error) {
      handleApiError(error, "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [debouncedSearch, modeFilter, page, rowsPerPage]);

  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const toastId = toast.loading("Deleting restaurant...");
    try {
      const response = await deleteRestaurant(deleteTargetId.toString());
      if (response.success) {
        toast.success("Restaurant deleted successfully!", { id: toastId });
        setDeleteTargetId(null);
        fetchRestaurants();
      } else {
        toast.error(response.message || "Failed to delete restaurant", { id: toastId });
      }
    } catch (error) {
      handleApiError(error, "Failed to delete restaurant", toastId);
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    void event;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="lg:w-350 mx-auto px-4 pt-3 lg:pt-10 flex flex-col gap-3 lg:gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="font-bold text-3xl">Manage Restaurants</h1>
        <Button
          variant="contained"
          onClick={() => navigate('/add')}
          className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-none py-2 px-4 rounded-sm"
        >
          Add Restaurant
        </Button>
      </div>

      <div className="py-4 rounded-sm flex flex-col md:flex-row gap-4 items-center ">
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          fullWidth
          placeholder="Type restaurant name..."
          slotProps={{
            input: {
              endAdornment: searchName ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setSearchName("")}
                    edge="end"
                    size="small"
                  >
                    <MdClear />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <TextField
          label="Filter by Mode"
          variant="outlined"
          select
          value={modeFilter}
          onChange={(e) => handleModeChange(e.target.value as "ALL" | "DINING" | "TAKEOUT" | "BOTH")}
          fullWidth
        >
          <MenuItem value="ALL">All Modes</MenuItem>
          <MenuItem value="DINING">Dining</MenuItem>
          <MenuItem value="TAKEOUT">Takeout</MenuItem>
          <MenuItem value="BOTH">Dining & Takeout</MenuItem>
        </TextField>
      </div>

      <TableContainer className="shadow-sm border border-gray-100 rounded-sm bg-white overflow-hidden">
        <Table aria-label="collapsible table">
          <TableHead className="bg-gray-50 border-b border-gray-150">
            <TableRow>
              <TableCell sx={{ width: 60 }} />
              <TableCell className="font-bold text-gray-700">Name</TableCell>
              <TableCell className="font-bold text-gray-700">Mode</TableCell>
              <TableCell className="font-bold text-gray-700">Phone</TableCell>
              <TableCell className="font-bold text-gray-700">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-12 text-gray-500">
                  <span className="animate-pulse">Loading restaurants...</span>
                </TableCell>
              </TableRow>
            ) : restaurants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-12 text-gray-500 font-medium">
                  No restaurants found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              restaurants.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t border-gray-100 bg-gray-50/50"
        />
      </TableContainer>

      {/* Custom MUI Delete Confirmation Dialog */}
      <Dialog
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ '& .MuiPaper-root': { borderRadius: '4px', padding: '8px' } }}
      >
        <DialogTitle id="alert-dialog-title" className="font-bold text-gray-800">
          Delete Restaurant?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="text-gray-600">
            Are you sure you want to delete this restaurant? This action is permanent and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button
            onClick={() => setDeleteTargetId(null)}
            className="text-gray-500 hover:bg-gray-100 font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            className="bg-red-600 hover:bg-red-700 font-semibold shadow-none"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManagePage;
