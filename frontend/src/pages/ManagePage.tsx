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
  Button,
  TextField,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment
} from '@mui/material';
import { MdClear } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { listRestaurants, deleteRestaurant } from '../api/restaurantService';
import type { restaurant } from '../interfaces/restaurant';
import { handleApiError } from '../utils/handleApiError';
import { RestaurantRow } from '../components/RestaurantRow';

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
                <RestaurantRow
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
