import React, { useEffect, useState } from 'react';

import { useRoute } from '@react-navigation/native';
import {useAuth} from "../../hooks/authContext";
import {loadGame, postStrike} from "../../api";
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity } from 'react-native';
export interface Move {
    x: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
    y: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    result: boolean;
    playerId: string;
}

export interface Game {
    id: number;
    status: 'CREATED' | 'MAP_CONFIG' | 'ACTIVE' | 'FINISHED';
    playerToMoveId: string | null;
    player1?: any;
    player2?: any;
    player1Id?: string;
    player2Id?: string;
    moves: Move[];
}

export const x_coordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const y_coordinates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const Board = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px;
`;

const Cell = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  background-color: #f0f0f0;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
`;


const GamePlay = () => {
    const {
        // @ts-ignore
        params: { gameId, userId},
    } = useRoute();

    const auth = useAuth();

    const [GameDetails, setGameDetails] = useState<Game | null>(null);
    const [moves, setMoves] = useState<Record<string, Move>>({});



    useEffect(() => {


        loadGame( auth.token, gameId)
            .then(data => {
                setGameDetails(data);
                console.log('Game fetched successfully');
                setMoves({
                    ...data.moves.reduce((acc : any, move: any) => {
                        acc[move.x + move.y + move.playerId] = move;
                        return acc;
                    }, {}),
                });
            })
            .catch(error => console.error('Failed to fetch game details:', error));

        const refetch = setInterval(() => {
            loadGame(auth.token, gameId)
                .then(data => {
                    setGameDetails(data);
                    console.log('Refreshing game');
                    setMoves({
                        ...data.moves.reduce((acc : any, move : any) => {
                            acc[move.x + move.y + move.playerId] = move;
                            return acc;
                        }, {}),
                    });
                })
                .catch(error => console.error('Refreshed failed:', error));
        }, 2000);


        return () => {
            clearInterval(refetch);
        };
    }, [gameId, auth.token]);

    const onCellPress = async (letter: string, number: string) => {
        if (GameDetails?.status === 'FINISHED') {
            console.log('Game finished');
            return;
        }

        if (!GameDetails || GameDetails.playerToMoveId !== userId) {
            console.log('Oponent turn');
            return;
        }

        const x = letter;
        const y = parseInt(number);

        // @ts-ignore
        const isMoveChosen = (moves, x, y, userId) => moves?.[`${x}${y}${userId}`];
        if (isMoveChosen(moves, x, y, userId)) {
            console.log('This cell is already taken.');
            return;
        }

        try {

            const data = await postStrike(gameId, auth.token, x, y);
            console.log('Strike successful', data);
        } catch (error) {
            console.error('Strike failed:', error);
        }
    };

    const gameStatus = GameDetails?.status;
    const playerToMoveId = GameDetails?.playerToMoveId;
    const titleMessage = gameStatus === 'FINISHED'
        ? (playerToMoveId === userId ? 'You lost...' : 'You won!')
        : (playerToMoveId === userId ? 'Your turn' : "Opponent's turn");


    const renderBoard = () => {
        return x_coordinates.map((letter) => (
            y_coordinates.map((number) => {
                const cellKey = `${letter}${number}`;
                const moveKey = `${letter}${number}${userId}`;
                const move = moves[moveKey];
                const isHit = move && move.result;

                return (
                    <Cell
                        key={cellKey}
                        onPress={() => onCellPress(letter, number)}
                        style={{ backgroundColor: isHit ? '#ff6347' : '#87ceeb' }}
                    >
                        <Text>{isHit ? '🔥' : ''}</Text>

                    </Cell>
                );
            })
        ));
    };

    return (
        <View>
            <Text>{titleMessage}</Text>
            <Board>
                {renderBoard()}
            </Board>
        </View>
    );
};

export default GamePlay;
