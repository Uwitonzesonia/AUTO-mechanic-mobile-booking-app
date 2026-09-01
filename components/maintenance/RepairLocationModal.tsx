import {Modal, Text, StyleSheet} from "react-native";
import {LinearBgView} from "@/components/LinearBg";

export default function RepairLocationModal() {
    return (
        <Modal
            visible={true}
            animationType="slide"
            style={styles.modal}
            onRequestClose={() => {}}
        >
            <LinearBgView>
                <Text>Repair Location Modal</Text>
            </LinearBgView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: "##202730"
    }
})