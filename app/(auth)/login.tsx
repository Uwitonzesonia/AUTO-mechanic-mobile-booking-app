import {Button, Text, View} from "react-native";
import {useAuth} from "@/hooks/useAuth";

const Login = () => {
    const {loginWithGoogle} = useAuth()

    return (
        <View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
            <Text>Login</Text>
            <Button
                title="Login with Google"
                onPress={loginWithGoogle}
            />
        </View>
    )
}

export default Login;