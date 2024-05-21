import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {loadGame} from '../api';
import { useAuth } from './authContext';

export type XCoordinate = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type YCoordinate = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CellId = `${XCoordinate}${YCoordinate}`;
export type CellValue = 'x' | '0' | '';


export interface ICell {
    value: CellValue;
    id: CellId
}


interface User {
    createdAt: string;
    user: any;
    game?: string;
    userId: number;
    gameId: number
}

interface Move {
    createdAt: string;
    userId: number;
    cell: CellId;
    gameId: number
    result:boolean
}

enum GameStatus {
    CREATED = "created",
    MAP_CONFIG = "map_config",
    ACTIVE = "active",
    FINISHED = "FINISHED"
}

interface Game {
    createdAt: string;
    id: number;
    users: User[];
    winnerId: number;
    moves: Move[];

    playerToMove: number;
    status: GameStatus
}

interface GameContext {
    game: Game | null;
    loadGame: (id: number) => Promise<void>;
    tableState: ICell[][];
}

const Context = createContext<GameContext>({
    loadGame: () => Promise.resolve(),
    game: null,
    tableState: []
});

const baseTableState: ICell[][] = [];

const rows: YCoordinate[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const cols: XCoordinate[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

for (const row of rows) {
    const newRow: ICell[] = [];
    for (const col of cols) {
        const id: CellId = `${col}${row}`;
        const cell: ICell = { id, value: '' };
        newRow.push(cell);
    }
    baseTableState.push(newRow);
}

export const GameContext: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [game, setGame] = useState<Game | null>(null);
    const [tableState, setTableState] = useState<ICell[][]>([]);
    const auth = useAuth();
    const loopRef = useRef<NodeJS.Timeout>();

    const gameToTabelState = () => {
        if (!game) return baseTableState;
        const movesMap: Partial<{[key in CellId]: CellValue}> = {};
        game.moves.forEach(move => {
            let value: CellValue = '';
            if (move.userId === game.users[0].userId) {
                value = 'x';
            } else {
                value = '0';
            }
            movesMap[move.cell] = value;
        });
        return baseTableState.map(
            row => row.map(({id, value}) => ({id, value: movesMap[id] || value}))
        )
    }

    const handleLoadGame = async (id: number) => {
        const result = await loadGame(auth.token, id);
        setGame(result);
    }

    useEffect(() => {
        setTableState(gameToTabelState());
    }, [game]);

    useEffect(() => {
        loopRef.current = setInterval(() => {
            if (game) {
                handleLoadGame(game.id)
            }
        }, 1000);
        return () => {
            clearInterval(loopRef.current)
        }
    }, [game])

    return (<Context.Provider value={{loadGame: handleLoadGame, game, tableState}}>
        {children}
    </Context.Provider>)
};

export const useGameContext = () => useContext(Context);
