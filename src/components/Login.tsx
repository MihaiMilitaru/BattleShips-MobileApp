// import React, {useState} from "react";
// import styled from "styled-components/native";
// import { Text } from "react-native";
//
// const Container = styled.View`
//     width: 100%;
//     height: 100%;
//     display: flex;
//     flex-direction: column;
//     padding: 50px;
// `
//
// const Input = styled.TextInput`
//     width: 100%;
//     height: 30px;
//     border: 1px solid;
//     margin-bottom: 10px;
//     padding: 8px;
// `
//
// const Button = styled.TouchableOpacity`
// `
//
// export interface ILogin {
//     onSubmit: (email: string, password: string) => void;
//     goToRegister: () => void;
// }
//
// const Login: React.FC<ILogin> = ({onSubmit, goToRegister}) => {
//
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//
//     const handleSubmit = () => onSubmit(email, password)
//
//     return (
//         <Container>
//             <Input keyboardType="email-address" onChangeText={setEmail}/>
//             <Input secureTextEntry onChangeText={setPassword}/>
//             <Button onPress={handleSubmit}>
//                 <Text>Submit</Text>
//             </Button>
//             <Button onPress={goToRegister}>
//                 <Text>Register</Text>
//             </Button>
//         </Container>
//     )
// }
//
// export default Login;

import React, { useState } from "react";
import styled from "styled-components/native";
import { Text, View } from "react-native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.View`
  width: 80%;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 10px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: #007bff;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px; 
`;

const ButtonText = styled.Text`
  color: #fff;
`;

const RegisterText = styled.Text`
  margin-top: 20px;
  color: #666;
`;

export interface ILogin {
    onSubmit: (email: string, password: string) => void;
    goToRegister: () => void;
}

const Login: React.FC<ILogin> = ({ onSubmit, goToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => onSubmit(email, password);

    return (
        <Container>
            <FormContainer>
                <Input
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                />
                <Button onPress={handleSubmit}>
                    <ButtonText>Submit</ButtonText>
                </Button>
            </FormContainer>
            <RegisterText>
                Don't have an account?{" "}
                <Text style={{ fontWeight: "bold" }} onPress={goToRegister}>
                    Register here
                </Text>
            </RegisterText>
        </Container>
    );
};

export default Login;