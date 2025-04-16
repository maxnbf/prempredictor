import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, IconButton, Tooltip, Button } from "@mui/material";
import { LiveRanking, UserRanking } from "../../../types/types";
import { PersonAdd } from "@mui/icons-material";
import { FriendButton } from "./FriendButton";

interface RankingTableProps {
    liveTable: LiveRanking;
    myTable: UserRanking;
    otherTable: UserRanking | undefined;
}

interface MyScore {
    offsets: number[]
    totalOffset: number
}

export function timeAgo(epochMillis: number): string {
    const now = Date.now();
    const diff = now - epochMillis;
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}
  
const calculateOffsets = (live: string[], user: string[]): MyScore => {
  const offsets = [];
  let totalOffset = 0;

  for (let i = 0; i < 20; i++) {
    const livePos = live.indexOf(user[i]);
    const offset = livePos - i;

    offsets.push(offset);
    totalOffset += Math.abs(offset);
  }

  return { offsets, totalOffset };
};

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

export const MyTable: React.FC<RankingTableProps> = ({ liveTable, myTable, otherTable }) => {
    
    const [myScore, setMyScore] = useState<MyScore | undefined>(undefined)
    const [otherScore, setOtherScore] = useState<MyScore | undefined>(undefined)

    useEffect(() => {
        setMyScore(calculateOffsets(liveTable.ranking, myTable.ranking));
        if (otherTable) {
            setOtherScore(calculateOffsets(liveTable.ranking, otherTable?.ranking))
        }
    }, [liveTable, myTable, otherTable]);

    const getOffsetStyle = (offset: number) => {
        if (offset > 0) {
            return { backgroundColor: "green", color: "white" };
        } else if (offset < 0) {
            return { backgroundColor: "red", color: "white" };
        } else {
            return { backgroundColor: "white", color: "black" };
        }
    };

    const teamNameStyle = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100px", 
    };

    return (
        <Box>
            <Box py={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5">
                    @{otherTable ? otherTable.username : myTable.username} {liveTable.season} Predictions
                    </Typography>

                    {otherTable && (
                         <FriendButton activeUser={myTable.username} otherUsername={otherTable.username} />
                    )}
                </Box>

                <Typography mb={2} variant="subtitle2">
                    Last Updated {timeAgo(liveTable.lastUpdated)}
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    <TableRow sx={{ height: 30 }}>
                        <TableCell sx={{ width: 30, fontSize: "0.9rem", padding: 1 }}>Pos.</TableCell>
                        <TableCell align="left" sx={{ fontSize: "0.9rem", padding: 1 }}>Live Standings</TableCell>
                        {otherTable &&
                            <>
                                <TableCell align="left" sx={{ fontSize: "0.9rem", padding: 1 }}>{otherTable.username}'s Standings</TableCell>
                                <TableCell sx={{ fontSize: "0.9rem", padding: 1 }}>Points</TableCell>
                            </>
                        }
                        <TableCell align="left" sx={{ fontSize: "0.9rem", padding: 1 }}>{myTable.username}'s Standings</TableCell>
                        <TableCell sx={{ fontSize: "0.9rem", padding: 1 }}>Points</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {liveTable.ranking.map((team, index) => {
                            const myOffset = myScore?.offsets[index] ?? 0;
                            const otherOffset = otherScore?.offsets[index] ?? 0;
                            return (
                                <TableRow key={team} sx={{ height: 30 }}>
                                    <TableCell sx={{ width: 30, fontSize: "0.9rem", padding: 1 }}>{index + 1}</TableCell>
                                    <TableCell align="left" sx={{ fontSize: "0.9rem", padding: 1, ...teamNameStyle }}>{isMobileDevice() ? <Box m={'auto'}  display={"flex"} component={'img'} width={25} src={liveTable.logoUrls[index]} /> : team}</TableCell>
                                    {otherTable &&
                                        <>
                                        <TableCell align="left" sx={{ fontSize: "0.9rem", padding: 1, ...teamNameStyle }}>{isMobileDevice() ? <Box  m={'auto'} display={"flex"} component={'img'} width={25} src={liveTable.logoUrls[liveTable.ranking.indexOf(otherTable.ranking[index])]} /> : otherTable.ranking[index]}</TableCell>
                                            <TableCell sx={{ ...getOffsetStyle(otherOffset), fontSize: "0.9rem", padding: 1 }}>{otherOffset > 0 ? `+${otherOffset}` : otherOffset}</TableCell>
                                        </>
                                    }
                                    <TableCell align="left" sx={{ fontSize: "0.9rem", padding: 1, ...teamNameStyle }}>{isMobileDevice() ? <Box  m={'auto'}  display={"flex"} component={'img'} width={25} src={liveTable.logoUrls[liveTable.ranking.indexOf(myTable.ranking[index])]} /> : myTable.ranking[index]}</TableCell>
                                    <TableCell sx={{ ...getOffsetStyle(myOffset), fontSize: "0.9rem", padding: 1 }}>{myOffset > 0 ? `+${myOffset}` : myOffset}</TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow sx={{ height: 30 }}>
                            <TableCell colSpan={3} align="right" sx={{ fontSize: "0.9rem" }}>Total Points</TableCell>
                            {
                                otherTable && 
                                <>
                                    <TableCell sx={{ fontSize: "0.9rem" }}>{otherScore?.totalOffset}</TableCell>
                                    <TableCell></TableCell>
                                </>
                            }
                            <TableCell sx={{ fontSize: "0.9rem" }}>{myScore?.totalOffset}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
  );
};
