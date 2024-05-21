import React from "react";
import styled from "styled-components/native";
import { Text } from "react-native";
import { CellId, ICell } from "../hooks/gameContext";


interface ITable {
    state: ICell[][];
    onClick: (cellId: CellId) => Promise<any>;
}

const Cell = styled.TouchableOpacity`
    width: 80px;
    height: 80px;
    border: 1px solid;
    margin: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Row = styled.View`
    display: flex;
    flex-direction: row;
`

const Table: React.FC<ITable> = ({state, onClick}) => {
    return (
        state.map((line, index) => (
            <Row key={index}>
                {line.map(({id, value}) => (
                    <Cell key={id} onPress={() => onClick(id)}>
                        <Text>{value}</Text>
                    </Cell>
                ))}
            </Row>
        ))
    )
}

export default Table