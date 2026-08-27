import {Redirect} from 'expo-router';
import {useAuth} from "@/hooks/useAuth";
import AppTabs from "@/components/AppTabs";

export default function TabLayout() {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) return null;
    if (!isAuthenticated) return <Redirect href="/(auth)/login"/>;

    return (
        <AppTabs/>
    );
}
