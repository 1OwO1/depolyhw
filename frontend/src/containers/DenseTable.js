import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useScoreCard } from '../hooks/useScoreCard';

function createData(name, subject, score) {
    return {name, subject, score};
  }


  

function DenseTable(array) {

    return(
        
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Subject</TableCell>
                <TableCell align="right">Score</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {array.map((row) => (
                <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.subject}</TableCell>
                <TableCell align="right">{row.score}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        
    );
}

export default DenseTable;