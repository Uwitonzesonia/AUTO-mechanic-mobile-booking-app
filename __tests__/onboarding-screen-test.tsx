import OnboardingScreen from "@/app/onboarding";
import {render} from "@testing-library/react-native";

describe( '<OnboardingScreen/>', () => {
    test("Text renders correctly", async () => {
        const { getByText } = await render(<OnboardingScreen />);
        expect(getByText("Lets Get\nstarted with us")).toBeTruthy();
    });

    test ("Login and Register buttons are present", async () => {
        const {getAllByRole} = await render(<OnboardingScreen/>);

        const loginButton = getAllByRole("button", {name: "Login"});
        const registerButton = getAllByRole("button", {name: "Register"});

        expect(loginButton.length).toBeGreaterThan(0);
        expect(registerButton.length).toBeGreaterThan(0);
    });

    test("renders correctly matching snapshot", async () => {
        const tree = (await render(<OnboardingScreen/>)).toJSON();
        expect(tree).toMatchSnapshot();
    })
});

jest.mock("react-native-pager-view", () => {
    const { View } = require("react-native");
    return ({ children, ...props }: any) => <View {...props}>{children}</View>;
});