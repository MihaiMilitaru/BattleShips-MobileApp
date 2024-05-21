import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GameRouteNames } from './route-names';
import { Text } from 'react-native'
import LobbyScreen from "../screens/game/Lobby.screen";
import TableScreen from "../screens/game/Table.screen";
import UserDetailsScreen from "../screens/game/UserDetails.screen";
import MapConfigurationScreen from "../screens/game/MapConfiguration.screen";
import GamePlayScreen from "../screens/game/GamePlay.screen";

const GameStack = createNativeStackNavigator()

const gameRoutes = (
    <GameStack.Navigator>
        <GameStack.Screen name={GameRouteNames.LOBBY} component={LobbyScreen} options={{
            header: () => null,
        }}/>
        <GameStack.Screen name={GameRouteNames.TABLE} component={TableScreen} options={{
            headerTitle: (props) => <Text {...props}>Game</Text>
        }}/>
        <GameStack.Screen name={GameRouteNames.USER_DETAILS} component={UserDetailsScreen} options={{
            headerTitle: (props) => <Text {...props}>My details</Text>
        }}/>

        <GameStack.Screen name={GameRouteNames.MAP_CONFIGURATION} component={MapConfigurationScreen} options={{
            headerTitle: (props) => <Text {...props}>Map configuration</Text>
        }}/>

        <GameStack.Screen name={GameRouteNames.PLAY_GAME} component={GamePlayScreen} options={{
            headerTitle: (props) => <Text {...props}>Play</Text>
        }}/>

    </GameStack.Navigator>
)

export default gameRoutes;