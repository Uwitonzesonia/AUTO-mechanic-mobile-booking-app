import {Button, Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "expo-router";

const Register = () => {
    const {loginWithGoogle} = useAuth()
    const router = useRouter();

    return (
        <View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
            <Text>Register</Text>
            <Button
                title="Login with Google"
                onPress={loginWithGoogle}
            />
            <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
            >
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Register;