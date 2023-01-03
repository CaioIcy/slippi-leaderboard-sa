import * as React from 'react';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  format?: (value: number) => string;
}

interface Props {
  columns: readonly Column[],
  rows: any[];
  withPagination?: boolean;
  withHeader?: boolean;
  sx?: any;
}

export function StickyHeadTable({ columns, rows, withPagination, withHeader, sx }: Props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const dsx = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    borderBottomColor: 'primary.dark',
  }

  return (
    <Box sx={{height: "100%", bgcolor: "orange", maxHeight: "100%", overflow: "hidden"}}>
      <TableContainer sx={{ ...dsx, height: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          {withHeader && <TableHead >
            <TableRow >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth, maxWidth: "400px", }}
                  size="small"
                  sx={{...dsx, color: 'primary.light'}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead> }

          <TableBody sx={{overflow: "hidden"}}>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`tbl-${i}`}>
                    {columns.map((column, j) => {
                      return (
                        <TableCell key={column.id} sx={dsx}>
                          {row[j]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {withPagination && <TablePagination
        component="div"
        SelectProps={{
          sx: {
            color: 'primary.light',
            '.MuiSvgIcon-root ': {
              fill: "rgba(233, 234, 234, 0.8)",
            },
          },
        }}

        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ...dsx,
          height: "100%",
          borderTop: '2px solid',
          borderColor: 'primary.dark',
        }}
      />}
    </Box>
  );

}
