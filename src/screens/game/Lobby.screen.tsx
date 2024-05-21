

import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../hooks/authContext"
import { TouchableOpacity, Text, Button, View,  StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import {listGames, createGame, listUserDetails,} from "../../api"
import GameListItem from "../../components/GameListItem"
import styled from "styled-components/native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthRouteNames, GameRouteNames } from "../../router/route-names"
const Container = styled(SafeAreaView)`
    display: flex;
    flex: 1;
    padding: 0 8px;
`;
const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
});
const GameList = styled.ScrollView``

interface UserDetails {
    id?: string;
    email?: string;
    gamesPlayed?: number;
    gamesWon?: number;
    gamesLost?: number;
    currentlyGamesPlaying?: number;
}

const LobbyScreen = () => {
    const auth = useAuth();
    const [games, setGames] = useState<any[]>([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    useEffect(() => {
        listGames(auth.token).then(setGames);
        const fetchData = async () => {
            try {
                const userDetailsResponse = await listUserDetails(auth.token);
                setUserDetails(userDetailsResponse.user);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchData();
    }, [auth.token]);

    const loadGames = async () => {
        try {
            const data = await listGames(auth.token);
            setGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    const navigation = useNavigation<any>();

    const applyFilter = () => {
        setFilterApplied(true);
        loadGames();
    };

    const clearFilter = () => {
        setFilterApplied(false);
        loadGames();
    };

    const handleAddGame = async () => {
        await createGame(auth.token);
        await loadGames();
    };

    const goToUserDetails = () => {
        navigation.navigate(GameRouteNames.USER_DETAILS);
    };

    return (
        <Container>
            {/* Profile Button */}
            <TouchableOpacity style={styles.button} onPress={goToUserDetails}>
                <Text style={styles.buttonText}>About Me</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleAddGame}>
                <Text style={styles.buttonText}>New Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={applyFilter}>
                <Text style={styles.buttonText}>My Campaign</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={clearFilter}>
                <Text style={styles.buttonText}>View All Games</Text>
            </TouchableOpacity>
            {/* Game List */}
            <GameList style={{marginTop:20}}>
                {filterApplied
                    ? games
                        .filter((game) =>
                            game.player1?.email === userDetails?.email ||
                            game.player2?.email === userDetails?.email
                        )
                        .map((game) => (
                            <GameListItem
                                status={game.status}
                                player1Email={game.player1?.email}
                                player2Email={game.player2?.email || userEmail}
                                id={game.id}
                                key={game.id}
                                onPress={() => {
                                    navigation.navigate(GameRouteNames.TABLE, { gameId: game.id });
                                }}
                            />
                        ))
                    : games.map((game) => (
                        <GameListItem
                            status={game.status}
                            player1Email={game.player1?.email}
                            player2Email={game.player2?.email || null}
                            id={game.id}
                            key={game.id}
                            onPress={() => {
                                navigation.navigate(GameRouteNames.TABLE, { gameId: game.id });
                            }}
                        />
                    ))}
            </GameList>
        </Container>
    )
}

export default LobbyScreen;