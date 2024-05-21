// const baseUrl = 'http://localhost:8080';
const baseUrl = 'http://163.172.177.98:8081'
import { CellId, XCoordinate, YCoordinate } from "./hooks/gameContext";

const baseHeaders = {
    "Content-Type": 'application/json',
    "Accept": 'application/json'
}

export const login = async (email: string, password: string): Promise<string> => {
    const result = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            ...baseHeaders
        },
        body: JSON.stringify({
            email, password
        })
    })

    const data = await result.json()

    return data.accessToken
};


export const register = async (email: string, password: string) => {
    const result = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
            ...baseHeaders
        },
        body: JSON.stringify({
            email, password
        })
    })

    const data = await result.json()

    const token = await login(email, password);

    return token
};

export const listUserDetails = async(token: string) => {
    const result = await fetch(`${baseUrl}/user/details/me`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization' : `Bearer ${token}`
        },

    })

    const data = await result.json();

    return data
}

export const listGames = async(token: string) => {
    const result = await fetch(`${baseUrl}/game`, {
        method: 'GET',
        headers: {
            ...baseHeaders,
            'Authorization' : `Bearer ${token}`
        },

    })

    const data = await result.json();

    return data["games"];
}

export const createGame = async(token: string) => {
    const result = await fetch(`${baseUrl}/game`, {
        method: 'POST',
        headers: {
            ...baseHeaders,
            'Authorization' : `Bearer ${token}`
        },

    })

    const data = await result.json();

    return data;
}

export const loadGame = async(token: string, gameId: number) => {
    const result = await fetch(`${baseUrl}/game/${gameId}`,{
        method: "GET",
        headers: {
            ...baseHeaders,
            'Authorization' : `Bearer ${token}`
        }
    })

    const data = await result.json();

    return data
}

export const sendMove = async (token: string, gameId: number, cell: CellId) => {

    const x: XCoordinate = cell.charAt(0) as XCoordinate;
    const y: YCoordinate = parseInt(cell.slice(1), 10) as YCoordinate;

    const requestBody = {
        x,
        y,
    };

    const result = await fetch(`${baseUrl}/game/move/${gameId}`, {
        method: 'post',
        headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    })

    const data = await result.json();

    return data
}

export const joinGame = async(token: string, gameId: number) => {
    const result = await fetch(`${baseUrl}/game/join/${gameId}`,{
        method: "POST",
        headers: {
            ...baseHeaders,
            'Authorization' : `Bearer ${token}`
        }
    })

    const data = await result.json();

    return data
}

export const postStrike = async (gameId : any, token : any, x : any, y : any) => {
    const response = await fetch(`http://163.172.177.98:8081/game/strike/${gameId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ x, y }),
    });

    if (!response.ok) {
        throw new Error('Failed to post strike');
    }

    return response.json();
};