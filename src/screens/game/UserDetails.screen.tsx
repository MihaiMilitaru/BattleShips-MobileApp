import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/authContext";
import { Text, View, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { listUserDetails } from "../../api";

interface UserDetails {
    id?: string;
    email?: string;
    gamesPlayed?: number;
    gamesWon?: number;
    gamesLost?: number;
    currentlyGamesPlaying?: number;
}

const UserDetailsScreen = () => {

    const auth = useAuth();
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [gamesLost, setGamesLost] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [gamesWon, setGamesWon] = useState(0);
    const [gamesCurrent, setGamesCurrent] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDetailsResponse = await listUserDetails(auth.token);
                setUserDetails(userDetailsResponse.user);
                setGamesPlayed(userDetailsResponse.gamesPlayed);
                setGamesWon(userDetailsResponse.gamesWon);
                setGamesLost(userDetailsResponse.gamesLost);
                setGamesCurrent(userDetailsResponse.currentlyGamesPlaying);

            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchData();

    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Account</Text>
            <View style={styles.card}>
                <Text style={styles.field}>Email: {userDetails?.email || 'Not available'}</Text>
                <Text style={styles.field}>Total Games Played: {gamesPlayed || 0}</Text>
                <Text style={styles.field}>Total Games Won: {gamesWon || 0}</Text>
                <Text style={styles.field}>Total Games Lost: {gamesLost || 0}</Text>
                <Text style={styles.field}>Currently Games Playing: {gamesCurrent || 0}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    field: {
        marginBottom: 10,
    },
});

export default UserDetailsScreen;