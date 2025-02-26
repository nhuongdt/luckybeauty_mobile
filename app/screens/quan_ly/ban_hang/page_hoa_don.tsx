import { Text } from "@rneui/themed"
import { StyleSheet } from "react-native"
import { View } from "react-native"

export const PageHoaDon = () => {
    return (<View style={styles.container}>
        <Text>Page hoa don</Text>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'yellow',
        flex: 1
    }
})