import React, {useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {StyleSheet, Button, Text, View } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import { GameContext, useGameContext } from '../../hooks/gameContext';
import Table from '../../components/Table';
import {sendMove, joinGame, listUserDetails, loadGame, listGames} from '../../api';
import { useAuth } from '../../hooks/authContext';
import {GameRouteNames} from "../../router/route-names";


interface UserDetails {
    id?: string;
    email?: string;
    gamesPlayed?: number;
    gamesWon?: number;
    gamesLost?: number;
    currentlyGamesPlaying?: number;
}

const TableScreen = () => {


    const route = useRoute<any>();
    const auth = useAuth();
    const navigation = useNavigation<any>();

    const [refresh, setRefresh] = useState(false);
    const [gameDetails, setGameDetails] = useState<any>(null);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [auth.token, route.params.gameId, refresh]);

    const fetchData = async () => {
        try {
            const userDetailsResponse = await listUserDetails(auth.token);
            setUserDetails(userDetailsResponse.user);

            const data = await loadGame(auth.token, route.params.gameId);
            setGameDetails(data);
            setLoading(false);
            setErrorMessage(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            setErrorMessage('Error loading data');
        }
    };

    const handleJoinGame = async () => {
        try {
            await joinGame(auth.token, gameDetails.id);
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error joining game:', error);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (errorMessage) {
        return <Text>{errorMessage}</Text>;
    }


    const goToMapConfig = () => {
        navigation.navigate(GameRouteNames.MAP_CONFIGURATION, {gameId: gameDetails.id});
    };

    const goToPlay = () => {
        navigation.navigate(GameRouteNames.PLAY_GAME, {gameId: gameDetails.id, userId: userDetails.id});
    };

    if (gameDetails.status === "MAP_CONFIG") {

        if(!(gameDetails.player1Id === userDetails.id || gameDetails.player2Id === userDetails.id)){
            return (
                <SafeAreaView style={styles.container}>
                    <Text style={styles.text}>Game Status: {gameDetails.status}</Text>
                    <Text style={styles.text}>Player 1: {gameDetails.player1.email}</Text>
                    <Text style={styles.text}>Player 2: {gameDetails.player2.email}</Text>
                </SafeAreaView>
            );
        }else{
            const ships = gameDetails.shipsCoord;
            let count = 0;

            for(let i=0;i<ships.length;i++){
                if (ships[i].playerId === userDetails.id){
                    count = count +1
                }
            }

            if ((gameDetails.player1Id === userDetails.id || gameDetails.player2Id === userDetails.id) && count) {
                return (
                    <SafeAreaView style={styles.container}>
                        <Text style={styles.text}>Game Status: {gameDetails.status}</Text>
                        <Text style={styles.text}>Player 1: {gameDetails.player1.email}</Text>
                        <Text style={styles.text}>Player 2: {gameDetails.player2.email}</Text>
                        <Text style={styles.text}>Wait for the other player to configure its map</Text>
                    </SafeAreaView>
                );
            } else {
                return (
                    <SafeAreaView style={styles.container}>
                        <Text style={styles.text}>Game Status: {gameDetails.status}</Text>
                        <Text style={styles.text}>Player 1: {gameDetails.player1.email}</Text>
                        <Text style={styles.text}>Player 2: {gameDetails.player2.email}</Text>
                        <Button title="Map Configuration" onPress={goToMapConfig} color="black" />
                    </SafeAreaView>
                );
            }
        }


    }
    if(gameDetails.status === "ACTIVE"){
        if(gameDetails.player1Id === userDetails.id || gameDetails.player2Id === userDetails.id)
            return(
                <SafeAreaView style={styles.container}>
                    <Text style={styles.text}>Player 1: {gameDetails.player1.email}</Text>
                    <Text style={styles.text}>Player 2: {gameDetails.player2.email}</Text>
                    <Button title="Play" onPress={goToPlay} color="black" />
                </SafeAreaView>
            )
        else{
            return(
                <SafeAreaView style={styles.container}>
                    <Text style={styles.text}>Player 1: {gameDetails.player1.email}</Text>
                    <Text style={styles.text}>Player 2: {gameDetails.player2.email}</Text>
                </SafeAreaView>
            )
        }
    }
    if(userDetails && gameDetails.status === "CREATED"){

        if(!gameDetails.player2){
            return (
                <SafeAreaView style={styles.container}>
                    <Text style={styles.text}>Game Status: {gameDetails.status}</Text>
                    <Text style={styles.text}>Player 1: {gameDetails.player1.email}</Text>
                    <Text style={styles.text}>Player 2: Free</Text>
                    <Button
                        title="Join Game"
                        onPress={handleJoinGame}
                        disabled={!gameDetails.id || !auth.token}
                    />
                </SafeAreaView>)

        }
        if(!gameDetails.player1){
            return (
                <SafeAreaView  style={styles.container}>
                    <Text style={styles.text}>Game Status: {gameDetails.status}</Text>
                    <Text style={styles.text}>Player 1: Free</Text>
                    <Text style={styles.text}>Player 2: {gameDetails.player2.email}</Text>
                    <Button
                        title="Join Game"
                        onPress={handleJoinGame}
                        disabled={!gameDetails.id || !auth.token}
                    />
                </SafeAreaView>)

        }

    }
    if(gameDetails.status === "FINISHED"){
        let winner = "";
        let loser = "";
        const hits = {
            player1: 0,
            player2: 0
        };

        // @ts-ignore
        gameDetails.shipsCoord.forEach(ship => {
            if (ship.hit) {
                if (ship.playerId === gameDetails.player1Id) {
                    hits.player1++;
                } else if (ship.playerId === gameDetails.player2Id) {
                    hits.player2++;
                }
            }
        });
        if(gameDetails.player1.id === gameDetails.playerToMoveId){
            loser = gameDetails.player1.email;
            winner = gameDetails.player2.email;
        }else{
            loser = gameDetails.player2.email;
            winner = gameDetails.player1.email;
        }
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>Game Status: {gameDetails.status}</Text>
                <Text style={styles.text}>Winner: {winner}</Text>
                <Text style={styles.text}>Loser: {loser}</Text>
            </SafeAreaView>)


    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Game Status: {gameDetails.status}</Text>
        </SafeAreaView>)

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 18,
        color: '#284dd5',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'black',
        color: 'white',
    }
});


export default TableScreen;

