import React from "react";
import styled from "styled-components/native";
import { Text } from "react-native";

const Container = styled.TouchableOpacity<{ color: string }>`
  font-family: "Berlin Sans FB";
  padding: 12px;
  border: 1px solid ${props => props.color};
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #bdd0ff;
`


export interface IGameListItem {
    id: number;
    onPress?: () => void;
    status: string,
    player1Email: string,
    player2Email: string
}

const GameListItem: React.FC<IGameListItem> = ({id, status, onPress, player1Email, player2Email}) => {
    return (
        <Container color="blue" onPress={onPress}>
            <Text>ID: {id}</Text>
            <Text>Status: {status}</Text>
            {(!player1Email) ? (
                <Text style={{color: 'blue'}}>Player 1: Free</Text>
            ) : (
                <Text>Player 1: {player1Email}</Text>
            )}
            {(!player2Email) ? (
                <Text style={{color: 'blue'}}>Player 2: Free</Text>

            ) : (
                <Text>Player 2: {player2Email}</Text>
            )}
        </Container>
    )
}

export default GameListItem;