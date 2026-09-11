import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { Rating } from "@/components/ui/Rating";
import type { Mechanic } from "@/types/mechanic";

const mockReplace = jest.fn();
const mockDismissAll = jest.fn();
const mockCanDismiss = jest.fn(() => true);

jest.mock("expo-router", () => ({
    useRouter: () => ({
        replace: mockReplace,
        dismissAll: mockDismissAll,
        canDismiss: mockCanDismiss,
    }),
}));

jest.mock("@react-native-vector-icons/ionicons", () => ({
    Ionicons: ({ name, testID, ...props }: any) => {
        const { Text } = require("react-native");
        return <Text testID={testID || `icon-${name}`}>{name}</Text>;
    },
}));

describe("<Rating />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockMechanic: Mechanic = {
        id: "mech-456",
        names: "Jean Claude",
        fullName: "Jean Claude Ndayisaba",
        rating: 4.8,
        profileImage: "https://example.com/avatar.jpg",
        expertise: ["Brakes", "Engine"],
        flat_fee: 65,
    };

    test("renders badge variant with rating value formatted to 1 decimal place", async () => {
        const { getByText } = await render(<Rating value={4.78} variant="badge" />);
        expect(getByText("4.8")).toBeTruthy();
    });

    test("renders stars variant with star icons and rating value", async () => {
        const { getByText, getAllByTestId } = await render(
            <Rating value={4} variant="stars" showValue={true} />
        );
        expect(getByText("4.0")).toBeTruthy();
        const starIcons = getAllByTestId("icon-star");
        expect(starIcons.length).toBe(4);
    });

    test("automatically uses mechanic.rating when value prop is omitted", async () => {
        const { getByText } = await render(
            <Rating mechanic={mockMechanic} variant="badge" />
        );
        expect(getByText("4.8")).toBeTruthy();
    });

    test("navigates to maintenance screen with mechanic data when pressed", async () => {
        const { getByTestId } = await render(
            <Rating
                mechanic={mockMechanic}
                variant="badge"
                fromTab="garage"
                testID="mechanic-rating-btn"
            />
        );

        const ratingButton = getByTestId("mechanic-rating-btn");
        await act(async () => {
            await fireEvent.press(ratingButton);
        });

        expect(mockDismissAll).toHaveBeenCalled();
        expect(mockReplace).toHaveBeenCalledWith({
            pathname: "/(drawer)/(tabs)/maintenance",
            params: {
                showRatingModal: "true",
                ratingMechanicId: "mech-456",
                ratingMechanicData: JSON.stringify(mockMechanic),
                fromTab: "garage",
            },
        });
    });

    test("custom onPress takes precedence over automatic navigation", async () => {
        const customPress = jest.fn();
        const { getByTestId } = await render(
            <Rating
                mechanic={mockMechanic}
                onPress={customPress}
                testID="mechanic-rating-btn"
            />
        );

        const ratingButton = getByTestId("mechanic-rating-btn");
        await act(async () => {
            await fireEvent.press(ratingButton);
        });

        expect(customPress).toHaveBeenCalledWith(mockMechanic);
        expect(mockReplace).not.toHaveBeenCalled();
    });

    test("is non-interactive when neither mechanic nor onPress is provided", async () => {
        const { getByTestId } = await render(
            <Rating value={4.5} testID="static-rating" />
        );

        const container = getByTestId("static-rating");
        // Non-interactive container renders as View without accessibilityRole="button"
        expect(container.props.accessibilityRole).toBeUndefined();
    });
});
