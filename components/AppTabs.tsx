import {Tabs} from "expo-router"

export default function AppTabs() {
    return (
        <Tabs
            screenOptions={{headerShown: false}}
        >
            <Tabs.Screen name="index"/>
            <Tabs.Screen name={"garage"}/>
            <Tabs.Screen name={"maintenance"}/>
            <Tabs.Screen name={"wallet"}/>
            <Tabs.Screen name={"profile"}/>
        </Tabs>
    )
}