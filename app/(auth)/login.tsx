import {Button, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "expo-router";
import {AuthProps} from "@/types/auth";
import {useState} from "react";

const Login = () => {
    const {loginWithGoogle, loginWithEmail, error} = useAuth()
    const router = useRouter();
    const [userData, setUserData] = useState<AuthProps>({email: '', password: ''});

    return (
        <View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
            <Text>Login</Text>
            {error && (
                <Text style={{color: "red"}}>{error}</Text>
            )}
            <View style={{width: "80%"}}>
                <Text>Email</Text>
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    value={userData?.email}
                    onChangeText={(email) => setUserData(prev => ({...prev, email}))}
                    style={{marginBottom: 10, borderBottomWidth: 1, color: "black"}}
                />
                <Text>Password</Text>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    value={userData?.password}
                    onChangeText={(password) => setUserData(prev => ({...prev, password}))}
                    autoCapitalize="none"
                    style={{marginBottom: 10, borderBottomWidth: 1, color: "black"}}
                />
            </View>
            <Button
                title={"Login"}
                onPress={() => loginWithEmail(userData)}
            />
            <Button
                title="Login with Google"
                onPress={loginWithGoogle}
            />
            <TouchableOpacity
                onPress={() => router.replace("/(auth)/register")}
            >
                <Text>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Login;