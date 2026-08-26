import {Button, Text, View} from "react-native";
import {useAuth} from "@/hooks/useAuth";

const Register = () => {
    const {loginWithGoogle} = useAuth()

    return (
        <View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
            <Text>Register</Text>
            <Button
                title="Register"
                onPress={loginWithGoogle}
            />
        </View>
    )
}

export default Register;