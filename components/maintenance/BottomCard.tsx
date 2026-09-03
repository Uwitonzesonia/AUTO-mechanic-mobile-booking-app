import {View, StyleSheet} from "react-native";
import {Text} from "@/components/Themed";

export default function BottomCard() {

    return (
        <View style={styles.backdrop}>
            <Text>Bottom card</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'flex-end',
    },
})