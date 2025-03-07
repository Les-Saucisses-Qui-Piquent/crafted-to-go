import { View, Text } from 'react-native'
import React from 'react'

const welcome = () => {
  return (
    <View>
       <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>
      <View style={styles.buttonContainer}>
        <Text>Brewery</Text>
        <Link href="/(brewery)" asChild>
          <Button title="Go to Brewery" />
        </Link>
      </View>
      <View style={styles.buttonContainer}>
        <Text>Customer</Text>
        <Link href="/(customer)" asChild>
          <Button title="Go to Customer" />
        </Link>
        </View>
    </View>
  )
}

export default welcome