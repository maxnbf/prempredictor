import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TablePagination, Container
} from "@mui/material";
import { getAllFriendsRankings, getAllRanking, getFanRanking } from "../../actions/rankings";
import NavLayout from "../NavLayout";
import { useNavigate } from "react-router-dom";
import { getFavorite } from "../../actions/user";
import { Search } from "./Search";


export interface UserScore {
    username: string;
    total: number;
}
  
interface PaginatedTableProps {
    data: UserScore[];
    title: string
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({
    data,
    title,
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage = 5
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  
    const handleChangePage = (_: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
    const nav = useNavigate()
    const navigateToUser = (username: string) => {
        nav(`/home/${username}`)
    }

    return (
      <Paper>
            <TableContainer>
                <Typography>{title}</Typography>
                <Table>
                    <TableHead>
                        <TableRow sx={{ height: 15 }}>
                            <TableCell sx={{ height: 15, padding: 1 }} colSpan={3}>Rank</TableCell>
                            <TableCell sx={{ height: 15, padding: 1  }} colSpan={6}>User</TableCell>
                            <TableCell sx={{ height: 15, padding: 1 }} colSpan={3} align="right">Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, idx) => (
                            <TableRow key={idx} sx={{ height: 15, cursor: "pointer" }} onClick={() => navigateToUser(row.username)}>
                                <TableCell sx={{ height: 15, padding: 1 }} colSpan={3}>{page * rowsPerPage + idx + 1}</TableCell>
                                <TableCell sx={{ height: 15, padding: 1}} colSpan={6}>{row.username}</TableCell>
                                <TableCell sx={{ height: 15, padding: 1 }} colSpan={3} align="right">{row.total}</TableCell>
                            </TableRow>
                        ))}

                        {/* Empty rows to fill up remaining space */}
                        {Array.from({ length: rowsPerPage - paginatedData.length }).map((_, idx) => (
                            <TableRow key={`empty-${idx}`} style={{ height: 15 }}>
                                <TableCell sx={{ height: 20, padding: 1 }} colSpan={3} />
                                <TableCell sx={{ height: 20, padding: 1 }} colSpan={6} />
                                <TableCell sx={{ height: 20, padding: 1 }} colSpan={3} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
  
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
      </Paper>
    );
};

export const All = () => {
    const [global, setGlobal] = useState<UserScore[]>([]);
    const [fan, setFan] = useState<UserScore[]>([]);
    const [favoriteTeam, setFavoriteTeam] = useState<string | undefined>(undefined)
    const [friends, setFriends] = useState<UserScore[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const favorite = await getFavorite()
            setFavoriteTeam(favorite)

            const allRanking = await getAllRanking();
            setGlobal(allRanking.data);

            const fanRanking = await getFanRanking(favorite);
            setFan(fanRanking.data);

            const friendRankings = await getAllFriendsRankings();
            setFriends(friendRankings)
        };

        fetchData();
    }, []);

    return (
        <NavLayout>
            <Container maxWidth="md">
                <Search/>
                <PaginatedTable title="Global Leaderboard" data={global} />
                <br></br>
                <PaginatedTable title={`My Friends`} data={friends} />
                <br></br>
                <PaginatedTable title={`${favoriteTeam} Fans Leaderboard`} data={fan} />
            </Container>
        </NavLayout>
    );
};
