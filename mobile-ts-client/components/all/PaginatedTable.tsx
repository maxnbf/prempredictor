import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AllScreenProps } from "../../types/routes";

export interface UserScore {
  username: string;
  total: number;
}

interface PaginatedTableProps {
  data: UserScore[];
  title: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
}

export const PaginatedTable: React.FC<PaginatedTableProps> = ({
  data,
  title,
  rowsPerPageOptions = [2, 10, 25],
  defaultRowsPerPage = 2,
}) => {
  const navigation = useNavigation<AllScreenProps>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (newPage: number) => setPage(newPage);

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        {title}
      </Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Rank</DataTable.Title>
          <DataTable.Title>User</DataTable.Title>
          <DataTable.Title numeric>Score</DataTable.Title>
        </DataTable.Header>

        {paginatedData.map((row, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("Home", {
                username: row.username,
                gameweek: undefined,
              })
            }
          >
            <DataTable.Row>
              <DataTable.Cell>{page * rowsPerPage + index + 1}</DataTable.Cell>
              <DataTable.Cell>{row.username}</DataTable.Cell>
              <DataTable.Cell numeric>{row.total}</DataTable.Cell>
            </DataTable.Row>
          </TouchableOpacity>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / rowsPerPage)}
          onPageChange={handleChangePage}
          label={`${page * rowsPerPage + 1}-${Math.min(
            (page + 1) * rowsPerPage,
            data.length
          )} of ${data.length}`}
          showFastPaginationControls
          numberOfItemsPerPage={rowsPerPage}
          onItemsPerPageChange={setRowsPerPage}
          numberOfItemsPerPageList={rowsPerPageOptions}
          selectPageDropdownLabel={"Rows per page"}
        />
      </DataTable>
    </View>
  );
};
