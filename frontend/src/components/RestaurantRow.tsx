import { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Card,
  CardMedia,
  Button
} from '@mui/material';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdDelete, MdEdit, MdMap } from 'react-icons/md';
import type { restaurant } from '../interfaces/restaurant';

interface RestaurantRowProps {
  row: restaurant;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function RestaurantRow({ row, onEdit, onDelete }: RestaurantRowProps) {
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

export default RestaurantRow;
