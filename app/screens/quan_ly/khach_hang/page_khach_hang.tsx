import { Text } from "@rneui/themed"
import { StyleSheet } from "react-native"
import { View } from "react-native"

export const PageKhachHang = () => {
    return (<View style={styles.container}>
        <Text>Page khach hang</Text>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'yellow',
        flex: 1
    }
})