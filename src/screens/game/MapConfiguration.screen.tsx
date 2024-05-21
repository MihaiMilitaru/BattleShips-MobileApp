import {useNavigation, useRoute} from "@react-navigation/native";
import { useAuth } from "../../hooks/authContext";
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {GameRouteNames} from "../../router/route-names";

const baseHeaders = {
    "Content-Type": 'application/json',
    "Accept": 'application/json'
}
interface Cell {
    row: number;
    col: number;
    ship: boolean;
}

interface Ship {
    x: string;
    y: number;
    size: number;
    direction: "HORIZONTAL" | "VERTICAL";
}


const MapConfigurationScreen = () => {

    const auth = useAuth();

    const [placingSmallShipVertically, setPlacingSmallShipVertically] = useState<boolean>(false);
    const [placingSmallShipHorizontally, setPlacingSmallShipHorizontally] = useState<boolean>(false);

    const [placingMediumShipVertically, setPlacingMediumShipVertically] = useState<boolean>(false);
    const [placingMediumShipHorizontally, setPlacingMediumShipHorizontally] = useState<boolean>(false);

    const [placingLargeShipVertically, setPlacingLargeShipVertically] = useState<boolean>(false);
    const [placingLargeShipHorizontally, setPlacingLargeShipHorizontally] = useState<boolean>(false);

    const [placingXLargeShipVertically, setPlacingXLargeShipVertically] = useState<boolean>(false);
    const [placingXLargeShipHorizontally, setPlacingXLargeShipHorizontally] = useState<boolean>(false);

    const [ships, setShips] = useState<Ship[]>([]);


    const [gridState, setGridState] = useState<Cell[][]>([]);
    const [shipsPlacedSmall, setShipsPlacedSmall] = useState<number>(0);
    const [shipsPlacedMedium, setShipsPlacedMedium] = useState<number>(0);
    const [shipsPlacedLarge, setShipsPlacedLarge] = useState<number>(0);
    const [shipsPlacedXLarge, setShipsPlacedXLarge] = useState<number>(0);


    const maxShipsSmall = 4;
    const maxShipsMedium = 3;
    const maxShipsLarge = 2;
    const maxShipsXLarge = 1;

    const route = useRoute<any>();

    const navigation = useNavigation<any>();

    useState(() => {
        const initialState: Cell[][] = [];
        for (let i = 0; i < 10; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < 10; j++) {
                row.push({ row: i, col: j, ship: false });
            }
            initialState.push(row);
        }
        setGridState(initialState);
    }, );


    const handleCellPressVerticallySmall = (row: number, col: number) => {

            if (row === 9){
                console.log("Cannot place ship here. It gets out of the grid.");
            }else {
                if (placingSmallShipVertically && shipsPlacedSmall < 4) {

                    const newGridState = [...gridState];
                    // Check if the current cell is already occupied by a ship
                    if (!newGridState[row][col].ship) {
                        // Check if the current cell or any adjacent cells are occupied by a ship
                        let canPlaceShip = true;
                        for (let i = row - 1; i <= row + 1; i++) {
                            for (let j = col - 1; j <= col + 1; j++) {
                                if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                    if (newGridState[i][j].ship) {
                                        canPlaceShip = false;
                                        break;
                                    }
                                }
                            }
                        }

                        for (let i = row; i <= row + 2; i++) {
                            for (let j = col - 1; j <= col + 1; j++) {
                                if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                    if (newGridState[i][j].ship) {
                                        canPlaceShip = false;
                                        break;
                                    }
                                }
                            }
                        }

                        if (canPlaceShip) {
                            newGridState[row][col].ship = true;
                            if (row + 1 < 10 && !newGridState[row + 1][col].ship) {
                                newGridState[row + 1][col].ship = true;

                            }
                            setGridState(newGridState);
                            setShipsPlacedSmall(prev => prev + 1);

                            setShips(prevShips => [
                                ...prevShips,
                                { x: String.fromCharCode(65 + row), y: col + 1, size: 2, direction: "HORIZONTAL" }
                            ]);
                        } else {
                            // Handle case where cell or adjacent cells are already occupied
                            console.log("Cannot place ship here. Another ship is too close.");
                        }
                    } else {
                        // Handle case where cell is already occupied
                        console.log("This cell is already occupied by a ship.");
                    }

                    // new case


                } else if (shipsPlacedSmall >= 4) {
                    console.log("You have already placed the maximum number of ships.");
                }
            }

    };

    const handleCellPressVerticallyMedium = (row: number, col: number) => {

        if (row === 9 || row === 8){
            console.log("Cannot place ship here. It gets out of the grid.");
        }else {
            if (placingMediumShipVertically && shipsPlacedMedium < 3) {

                const newGridState = [...gridState];
                // Check if the current cell is already occupied by a ship
                if (!newGridState[row][col].ship) {
                    // Check if the current cell or any adjacent cells are occupied by a ship
                    let canPlaceShip = true;
                    for (let i = row - 1; i <= row + 1; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row; i <= row + 2; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row + 1; i <= row + 3; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (canPlaceShip) {
                        newGridState[row][col].ship = true;

                        if (row + 1 < 10 && !newGridState[row + 1][col].ship) {
                            newGridState[row + 1][col].ship = true;

                        }
                        if (row + 2 < 10 && !newGridState[row + 2][col].ship) {
                            newGridState[row + 2][col].ship = true;
                        }
                        setGridState(newGridState);
                        setShipsPlacedMedium(prev => prev + 1);
                        setShips(prevShips => [
                            ...prevShips,
                            { x: String.fromCharCode(65 + row), y: col + 1, size: 3, direction: "HORIZONTAL" }
                        ]);
                    } else {
                        // Handle case where cell or adjacent cells are already occupied
                        console.log("Cannot place ship here. Another ship is too close.");
                    }
                } else {
                    // Handle case where cell is already occupied
                    console.log("This cell is already occupied by a ship.");
                }



            } else if (shipsPlacedMedium >= 3) {
                console.log("You have already placed the maximum number of ships.");
            }
        }

    };

    const handleCellPressVerticallyLarge= (row: number, col: number) => {

        if (row === 9 || row === 8 || row === 7){
            console.log("Cannot place ship here. It gets out of the grid.");
        }else {
            if (placingLargeShipVertically && shipsPlacedLarge < 2) {

                const newGridState = [...gridState];
                // Check if the current cell is already occupied by a ship
                if (!newGridState[row][col].ship) {
                    // Check if the current cell or any adjacent cells are occupied by a ship
                    let canPlaceShip = true;
                    for (let i = row - 1; i <= row + 1; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row; i <= row + 2; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row + 1; i <= row + 3; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row + 2; i <= row + 4; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }



                    if (canPlaceShip) {
                        newGridState[row][col].ship = true;

                        if (row + 1 < 10 && !newGridState[row + 1][col].ship) {
                            newGridState[row + 1][col].ship = true;

                        }
                        if (row + 2 < 10 && !newGridState[row + 2][col].ship) {
                            newGridState[row + 2][col].ship = true;
                        }
                        if (row + 3 < 10 && !newGridState[row + 3][col].ship) {
                            newGridState[row + 3][col].ship = true;
                        }
                        setGridState(newGridState);
                        setShipsPlacedLarge(prev => prev + 1);
                        setShips(prevShips => [
                            ...prevShips,
                            { x: String.fromCharCode(65 + row), y: col + 1, size: 4, direction: "HORIZONTAL" }
                        ]);
                    } else {
                        // Handle case where cell or adjacent cells are already occupied
                        console.log("Cannot place ship here. Another ship is too close.");
                    }
                } else {
                    // Handle case where cell is already occupied
                    console.log("This cell is already occupied by a ship.");
                }



            } else if (shipsPlacedLarge >= 2) {
                console.log("You have already placed the maximum number of ships.");
            }
        }

    };

    const handleCellPressVerticallyXLarge= (row: number, col: number) => {

        if (row === 9 || row === 8 || row === 7 || row === 6 || row === 5){
            console.log("Cannot place ship here. It gets out of the grid.");
        }else {
            if (placingXLargeShipVertically && shipsPlacedXLarge < 1) {

                const newGridState = [...gridState];
                // Check if the current cell is already occupied by a ship
                if (!newGridState[row][col].ship) {
                    // Check if the current cell or any adjacent cells are occupied by a ship
                    let canPlaceShip = true;
                    for (let i = row - 1; i <= row + 1; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row; i <= row + 2; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row + 1; i <= row + 3; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row + 2; i <= row + 4; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row + 3; i <= row + 5; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let i = row + 4; i <= row + 6; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }


                    if (canPlaceShip) {
                        newGridState[row][col].ship = true;

                        if (row + 1 < 10 && !newGridState[row + 1][col].ship) {
                            newGridState[row + 1][col].ship = true;

                        }
                        if (row + 2 < 10 && !newGridState[row + 2][col].ship) {
                            newGridState[row + 2][col].ship = true;
                        }
                        if (row + 3 < 10 && !newGridState[row + 3][col].ship) {
                            newGridState[row + 3][col].ship = true;
                        }
                        if (row + 4 < 10 && !newGridState[row + 4][col].ship) {
                            newGridState[row + 4][col].ship = true;
                        }
                        if (row + 5 < 10 && !newGridState[row + 5][col].ship) {
                            newGridState[row + 5][col].ship = true;
                        }
                        setGridState(newGridState);
                        setShipsPlacedXLarge(prev => prev + 1);
                        setShips(prevShips => [
                            ...prevShips,
                            { x: String.fromCharCode(65 + row), y: col + 1, size: 6, direction: "HORIZONTAL" }
                        ]);
                    } else {
                        // Handle case where cell or adjacent cells are already occupied
                        console.log("Cannot place ship here. Another ship is too close.");
                    }
                } else {
                    // Handle case where cell is already occupied
                    console.log("This cell is already occupied by a ship.");
                }



            } else if (shipsPlacedXLarge >= 1) {
                console.log("You have already placed the maximum number of ships.");
            }
        }

    };

    const handleCellPressHorizontallySmall = (row: number, col: number) => {
        if (col === 9) {
            console.log("Cannot place ship here. It gets out of the grid.");
        } else {
            if (placingSmallShipHorizontally && shipsPlacedSmall < 4) {
                const newGridState = [...gridState];
                // Check if the current cell is already occupied by a ship
                if (!newGridState[row][col].ship) {
                    // Check if the current cell or any adjacent cells are occupied by a ship
                    let canPlaceShip = true;
                    for (let i = row - 1; i <= row + 1; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col; j <= col + 2; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (canPlaceShip) {
                        newGridState[row][col].ship = true;
                        if (col + 1 < 10 && !newGridState[row][col + 1].ship) {
                            newGridState[row][col + 1].ship = true;
                        }
                        setGridState(newGridState);
                        setShipsPlacedSmall(prev => prev + 1);
                        setShips(prevShips => [
                            ...prevShips,
                            { x: String.fromCharCode(65 + row), y: col + 1, size: 2, direction: "VERTICAL" }
                        ]);
                    } else {
                        // Handle case where cell or adjacent cells are already occupied
                        console.log("Cannot place ship here. Another ship is too close.");
                    }
                } else {
                    // Handle case where cell is already occupied
                    console.log("This cell is already occupied by a ship.");
                }
            } else if (shipsPlacedSmall >= 4) {
                console.log("You have already placed the maximum number of ships.");
            }
        }
    };

    const handleCellPressHorizontallyMedium = (row: number, col: number) => {
        if (col === 9 || col === 8) {
            console.log("Cannot place ship here. It gets out of the grid.");
        } else {
            if (placingMediumShipHorizontally && shipsPlacedMedium < 3) {
                const newGridState = [...gridState];
                // Check if the current cell is already occupied by a ship
                if (!newGridState[row][col].ship) {
                    // Check if the current cell or any adjacent cells are occupied by a ship
                    let canPlaceShip = true;
                    for (let i = row - 1; i <= row + 1; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col; j <= col + 2; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col+1; j <= col + 3; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (canPlaceShip) {
                        newGridState[row][col].ship = true;
                        if (col + 1 < 10 && !newGridState[row][col + 1].ship) {
                            newGridState[row][col + 1].ship = true;
                        }
                        if (col + 2 < 10 && !newGridState[row][col + 2].ship) {
                            newGridState[row][col + 2].ship = true;

                        }
                        setGridState(newGridState);
                        setShipsPlacedMedium(prev => prev + 1);
                        setShips(prevShips => [
                            ...prevShips,
                            { x: String.fromCharCode(65 + row), y: col + 1, size: 3, direction: "VERTICAL" }
                        ]);
                    } else {
                        // Handle case where cell or adjacent cells are already occupied
                        console.log("Cannot place ship here. Another ship is too close.");
                    }
                } else {
                    // Handle case where cell is already occupied
                    console.log("This cell is already occupied by a ship.");
                }
            } else if (shipsPlacedMedium >= 3) {
                console.log("You have already placed the maximum number of ships.");
            }
        }
    };

    const handleCellPressHorizontallyLarge = (row: number, col: number) => {
        if (col === 9 || col === 8 || col === 7) {
            console.log("Cannot place ship here. It gets out of the grid.");
        } else {
            if (placingLargeShipHorizontally && shipsPlacedLarge< 2) {
                const newGridState = [...gridState];
                // Check if the current cell is already occupied by a ship
                if (!newGridState[row][col].ship) {
                    // Check if the current cell or any adjacent cells are occupied by a ship
                    let canPlaceShip = true;
                    for (let i = row - 1; i <= row + 1; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col; j <= col + 2; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col+1; j <= col + 3; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col+2; j <= col + 4; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (canPlaceShip) {
                        newGridState[row][col].ship = true;
                        if (col + 1 < 10 && !newGridState[row][col + 1].ship) {
                            newGridState[row][col + 1].ship = true;
                        }
                        if (col + 2 < 10 && !newGridState[row][col + 2].ship) {
                            newGridState[row][col + 2].ship = true;

                        }
                        if (col + 3 < 10 && !newGridState[row][col + 3].ship) {
                            newGridState[row][col + 3].ship = true;

                        }
                        setGridState(newGridState);
                        setShipsPlacedLarge(prev => prev + 1);
                        setShips(prevShips => [
                            ...prevShips,
                            { x: String.fromCharCode(65 + row), y: col + 1, size: 4, direction: "VERTICAL" }
                        ]);
                    } else {
                        // Handle case where cell or adjacent cells are already occupied
                        console.log("Cannot place ship here. Another ship is too close.");
                    }
                } else {
                    // Handle case where cell is already occupied
                    console.log("This cell is already occupied by a ship.");
                }
            } else if (shipsPlacedLarge >= 2) {
                console.log("You have already placed the maximum number of ships.");
            }
        }
    };

    const handleCellPressHorizontallyXLarge = (row: number, col: number) => {
        if (col === 9 || col === 8 || col === 7 || col === 6 || col === 5) {
            console.log("Cannot place ship here. It gets out of the grid.");
        } else {
            if (placingXLargeShipHorizontally && shipsPlacedXLarge< 1) {
                const newGridState = [...gridState];
                // Check if the current cell is already occupied by a ship
                if (!newGridState[row][col].ship) {
                    // Check if the current cell or any adjacent cells are occupied by a ship
                    let canPlaceShip = true;
                    for (let i = row - 1; i <= row + 1; i++) {
                        for (let j = col - 1; j <= col + 1; j++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col; j <= col + 2; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col+1; j <= col + 3; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col+2; j <= col + 4; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col+3; j <= col + 5; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }

                    for (let j = col+4; j <= col + 6; j++) {
                        for (let i = row - 1; i <= row + 1; i++) {
                            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                                if (newGridState[i][j].ship) {
                                    canPlaceShip = false;
                                    break;
                                }
                            }
                        }
                    }


                    if (canPlaceShip) {
                        newGridState[row][col].ship = true;
                        if (col + 1 < 10 && !newGridState[row][col + 1].ship) {
                            newGridState[row][col + 1].ship = true;
                        }
                        if (col + 2 < 10 && !newGridState[row][col + 2].ship) {
                            newGridState[row][col + 2].ship = true;

                        }
                        if (col + 3 < 10 && !newGridState[row][col + 3].ship) {
                            newGridState[row][col + 3].ship = true;

                        }
                        if (col + 4 < 10 && !newGridState[row][col + 4].ship) {
                            newGridState[row][col + 4].ship = true;

                        }
                        if (col + 5 < 10 && !newGridState[row][col + 5].ship) {
                            newGridState[row][col + 5].ship = true;

                        }
                        setGridState(newGridState);
                        setShipsPlacedXLarge(prev => prev + 1);
                        setShips(prevShips => [
                            ...prevShips,
                            { x: String.fromCharCode(65 + row), y: col + 1, size: 6, direction: "VERTICAL" }
                        ]);
                    } else {
                        // Handle case where cell or adjacent cells are already occupied
                        console.log("Cannot place ship here. Another ship is too close.");
                    }
                } else {
                    // Handle case where cell is already occupied
                    console.log("This cell is already occupied by a ship.");
                }
            } else if (shipsPlacedXLarge >= 1) {
                console.log("You have already placed the maximum number of ships.");
            }
        }
    };

    const handleVerticalButtonPressSmall = () => {
        setPlacingSmallShipVertically(true);
        setPlacingSmallShipHorizontally(false);
        setPlacingMediumShipHorizontally(false);
        setPlacingMediumShipVertically(false);
        setPlacingLargeShipHorizontally(false);
        setPlacingLargeShipVertically(false);
        setPlacingXLargeShipHorizontally(false);
        setPlacingXLargeShipVertically(false);
    };

    const handleHorizontalButtonPressSmall = () => {
        setPlacingSmallShipHorizontally(true);
        setPlacingSmallShipVertically(false);
        setPlacingMediumShipHorizontally(false);
        setPlacingMediumShipVertically(false);
        setPlacingLargeShipHorizontally(false);
        setPlacingLargeShipVertically(false);
        setPlacingXLargeShipHorizontally(false);
        setPlacingXLargeShipVertically(false);
    };

    const handleHorizontalButtonPressMedium = () => {
        setPlacingMediumShipHorizontally(true);
        setPlacingSmallShipHorizontally(false);
        setPlacingSmallShipVertically(false);
        setPlacingMediumShipVertically(false);
        setPlacingLargeShipHorizontally(false);
        setPlacingLargeShipVertically(false);
        setPlacingXLargeShipHorizontally(false);
        setPlacingXLargeShipVertically(false);
    };

    const handleVerticalButtonPressMedium = () => {
        setPlacingMediumShipVertically(true);
        setPlacingSmallShipHorizontally(false);
        setPlacingSmallShipVertically(false);
        setPlacingMediumShipHorizontally(false);
        setPlacingLargeShipHorizontally(false);
        setPlacingLargeShipVertically(false);
        setPlacingXLargeShipHorizontally(false);
        setPlacingXLargeShipVertically(false);
    };

    const handleVerticalButtonPressLarge = () => {
        setPlacingLargeShipVertically(true);
        setPlacingMediumShipVertically(false);
        setPlacingSmallShipHorizontally(false);
        setPlacingSmallShipVertically(false);
        setPlacingMediumShipHorizontally(false);
        setPlacingLargeShipHorizontally(false);
        setPlacingXLargeShipHorizontally(false);
        setPlacingXLargeShipVertically(false);
    }

    const handleHorizontalButtonPressLarge = () => {
        setPlacingLargeShipHorizontally(true);
        setPlacingMediumShipVertically(false);
        setPlacingSmallShipHorizontally(false);
        setPlacingSmallShipVertically(false);
        setPlacingMediumShipHorizontally(false);
        setPlacingLargeShipVertically(false);
        setPlacingXLargeShipHorizontally(false);
        setPlacingXLargeShipVertically(false);
    }

    const handleVerticalButtonPressXLarge = () => {
        setPlacingXLargeShipVertically(true);
        setPlacingXLargeShipHorizontally(false);
        setPlacingLargeShipVertically(false);
        setPlacingMediumShipVertically(false);
        setPlacingSmallShipHorizontally(false);
        setPlacingSmallShipVertically(false);
        setPlacingMediumShipHorizontally(false);
        setPlacingLargeShipHorizontally(false);
    }

    const handleHorizontalButtonPressXLarge = () => {
        setPlacingXLargeShipHorizontally(true);
        setPlacingXLargeShipVertically(false);
        setPlacingLargeShipVertically(false);
        setPlacingMediumShipVertically(false);
        setPlacingSmallShipHorizontally(false);
        setPlacingSmallShipVertically(false);
        setPlacingMediumShipHorizontally(false);
        setPlacingLargeShipHorizontally(false);
    }



    // Function to render the grid
    const renderGrid = () => {
        return gridState.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
                {row.map((cell, colIndex) => (
                    <TouchableOpacity
                        key={`${rowIndex}_${colIndex}`}
                        style={[
                            styles.cell,
                            cell.ship ? styles.shipCell : null,
                        ]}
                        onPress={() => {
                            if (placingSmallShipVertically) {
                                handleCellPressVerticallySmall(cell.row, cell.col);
                            }
                            if (placingSmallShipHorizontally) {
                                handleCellPressHorizontallySmall(cell.row, cell.col);
                            }
                            if (placingMediumShipVertically) {
                                handleCellPressVerticallyMedium(cell.row, cell.col);
                            }
                            if (placingMediumShipHorizontally) {
                                handleCellPressHorizontallyMedium(cell.row, cell.col);
                            }
                            if (placingLargeShipVertically) {
                                handleCellPressVerticallyLarge(cell.row, cell.col);
                            }
                            if (placingLargeShipHorizontally) {
                                handleCellPressHorizontallyLarge(cell.row, cell.col);
                            }
                            if (placingXLargeShipVertically) {
                                handleCellPressVerticallyXLarge(cell.row, cell.col);
                            }
                            if (placingXLargeShipHorizontally) {
                                handleCellPressHorizontallyXLarge(cell.row, cell.col);
                            }
                        }}
                    />
                ))}
            </View>
        ));
    };

    const sendConfiguration = () => {
        console.log('Sending configuration...');


        fetch(`http://163.172.177.98:8081/game/${route.params.gameId}`, {
            method: 'PATCH',
            headers: {
                ...baseHeaders,
                'Authorization' : `Bearer ${auth.token}`
            },
            body: JSON.stringify({ ships }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send configuration');
            }
            console.log('Configuration sent successfully');
            navigation.navigate(GameRouteNames.TABLE, { refresh: true });
        })
        .catch(error => {
            console.error('Error sending configuration:', error.message);
        });
    };


    const renderSendConfigurationButton = () => {
        if (
            shipsPlacedSmall === maxShipsSmall &&
            shipsPlacedMedium === maxShipsMedium &&
            shipsPlacedLarge === maxShipsLarge &&
            shipsPlacedXLarge === maxShipsXLarge
        ) {
            return (
                <TouchableOpacity style={styles.sendConfigButton} onPress={sendConfiguration}>
                    <Text style={styles.sendConfigButtonText}>Send Configuration</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, placingSmallShipVertically ? styles.selectedButton : null]}
                    onPress={handleVerticalButtonPressSmall}
                >
                    <Text style={styles.buttonText}>Small V ({maxShipsSmall - shipsPlacedSmall})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, placingSmallShipHorizontally ? styles.selectedButton : null]}
                    onPress={handleHorizontalButtonPressSmall}
                >
                    <Text style={styles.buttonText}>Small H ({maxShipsSmall - shipsPlacedSmall})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, placingMediumShipVertically ? styles.selectedButton : null]}
                    onPress={handleVerticalButtonPressMedium}
                >
                    <Text style={styles.buttonText}>Medium V ({maxShipsMedium - shipsPlacedMedium})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, placingMediumShipHorizontally ? styles.selectedButton : null]}
                    onPress={handleHorizontalButtonPressMedium}
                >
                    <Text style={styles.buttonText}>Medium H ({maxShipsMedium - shipsPlacedMedium})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, placingLargeShipVertically ? styles.selectedButton : null]}
                    onPress={handleVerticalButtonPressLarge}
                >
                    <Text style={styles.buttonText}>Large V ({maxShipsLarge - shipsPlacedLarge})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, placingLargeShipHorizontally ? styles.selectedButton : null]}
                    onPress={handleHorizontalButtonPressLarge}
                >
                    <Text style={styles.buttonText}>Large H ({maxShipsLarge - shipsPlacedLarge})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, placingXLargeShipVertically ? styles.selectedButton : null]}
                    onPress={handleVerticalButtonPressXLarge}
                >
                    <Text style={styles.buttonText}>XLarge V ({maxShipsXLarge - shipsPlacedXLarge})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, placingXLargeShipHorizontally ? styles.selectedButton : null]}
                    onPress={handleHorizontalButtonPressXLarge}
                >
                    <Text style={styles.buttonText}>XLarge H ({maxShipsXLarge - shipsPlacedXLarge})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>{renderGrid()}</View>

            {/* Render Send Configuration button */}
            {renderSendConfigurationButton()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: 'black',
    },
    shipCell: {
        backgroundColor: 'red',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedButton: {
        backgroundColor: 'green',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        gap: 30
    },

    sendConfigButton: {
        marginTop: 20,
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sendConfigButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MapConfigurationScreen;