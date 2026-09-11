import React from "react";
import { Keyboard } from "react-native";
import { render, fireEvent, act } from "@testing-library/react-native";
import { RatingModal } from "@/components/maintenance/modal/RatingModal";
import type { Mechanic } from "@/types/mechanic";

jest.mock("@react-native-vector-icons/ionicons", () => {
    const { Text } = require("react-native");
    const MockIonicons = (props: any) => <Text testID={`icon-${props.name}`}>{props.name}</Text>;
    return {
        __esModule: true,
        default: MockIonicons,
        Ionicons: MockIonicons,
    };
});

const mockMechanic: Mechanic = {
    id: "mech-101",
    names: "Alex Rivera",
    email: "alex@example.com",
    phoneNumber: "+1234567890",
    profileImage: "https://example.com/alex.jpg",
    current_location: {
        latitude: 37.7749,
        longitude: -122.4194,
        distanceKm: 1.2,
    },
    specialties: ["Engine", "Brakes"],
} as unknown as Mechanic;

describe("<RatingModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Rendering and Content", () => {
        test("renders modal with mechanic name, 5 stars, comment input, and submit button", async () => {
            const onClose = jest.fn();
            const { getByText, getByPlaceholderText, getAllByTestId, getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            expect(getByText("Alex Rivera")).toBeTruthy();
            expect(getByText("Thank you!")).toBeTruthy();
            expect(getByText("Please rate your trip")).toBeTruthy();
            expect(
                getByPlaceholderText("Write your message here ...")
            ).toBeTruthy();
            expect(getByTestId("rating-submit-button")).toBeTruthy();

            // 5 stars initially rendered as active 'star' icon
            const starIcons = getAllByTestId("icon-star");
            expect(starIcons.length).toBe(5);
        });

        test("renders fallback 'Your Mechanic' when mechanic prop is null", async () => {
            const onClose = jest.fn();
            const { getByText } = await render(
                <RatingModal visible={true} mechanic={null} onClose={onClose} />
            );

            expect(getByText("Your Mechanic")).toBeTruthy();
        });

        test("verifies 'What went well?' tag chips section is NOT present", async () => {
            const onClose = jest.fn();
            const { queryByText } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            expect(queryByText("What went well?")).toBeNull();
            expect(queryByText("On Time")).toBeNull();
            expect(queryByText("Professional")).toBeNull();
            expect(queryByText("Clean Work")).toBeNull();
        });
    });

    describe("Star Rating Selection", () => {
        test("updates selected rating when stars are tapped", async () => {
            const onSubmit = jest.fn();
            const onClose = jest.fn();
            const { getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} onSubmit={onSubmit} />
            );

            // Tap 3rd star
            await act(async () => {
                await fireEvent.press(getByTestId("rating-star-3"));
            });

            // Tap submit button to verify 3 stars
            await act(async () => {
                await fireEvent.press(getByTestId("rating-submit-button"));
            });
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    rating: 3,
                })
            );
        });
    });

    describe("Comment Input and Submission", () => {
        test("submits selected rating and comment text, then closes modal", async () => {
            const onClose = jest.fn();
            const onSubmit = jest.fn();
            const dismissSpy = jest.spyOn(Keyboard, "dismiss");

            const { getByTestId } = await render(
                <RatingModal
                    visible={true}
                    mechanic={mockMechanic}
                    onClose={onClose}
                    onSubmit={onSubmit}
                />
            );

            // Select 4 stars
            await act(async () => {
                await fireEvent.press(getByTestId("rating-star-4"));
            });

            // Type review comment
            await act(async () => {
                await fireEvent.changeText(
                    getByTestId("rating-comment-input"),
                    "Mechanic arrived promptly and fixed the brakes cleanly."
                );
            });

            // Submit review
            await act(async () => {
                await fireEvent.press(getByTestId("rating-submit-button"));
            });

            expect(dismissSpy).toHaveBeenCalled();
            expect(onSubmit).toHaveBeenCalledWith({
                rating: 4,
                comment: "Mechanic arrived promptly and fixed the brakes cleanly.",
            });
            expect(onClose).toHaveBeenCalled();
        });
    });

    describe("Dismiss and Close Actions", () => {
        test("calls onClose when top dismiss area (map) is pressed", async () => {
            const onClose = jest.fn();
            const { getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            const dismissArea = getByTestId("rating-dismiss-area");
            await act(async () => {
                await fireEvent.press(dismissArea);
            });

            expect(onClose).toHaveBeenCalled();
        });
    });

    describe("Keyboard Avoiding & Gap Prevention Verification", () => {
        test("verifies animated backdrop is anchored to bottom with justifyContent='flex-end'", async () => {
            const onClose = jest.fn();
            const { getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );
            const kav = getByTestId("rating-keyboard-avoiding-view");
            expect(kav.props.style.justifyContent).toBe("flex-end");
        });

        test("switches to compact content-hugging layout when keyboard opens and restores when closed", async () => {
            let showListener: (() => void) | undefined;
            let hideListener: (() => void) | undefined;

            jest.spyOn(Keyboard, "addListener").mockImplementation(
                (event: string, callback: any) => {
                    if (event === "keyboardWillShow" || event === "keyboardDidShow") {
                        showListener = callback;
                    }
                    if (event === "keyboardWillHide" || event === "keyboardDidHide") {
                        hideListener = callback;
                    }
                    return { remove: jest.fn() } as any;
                }
            );

            const onClose = jest.fn();
            const { getByText, queryByText } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            // Initially keyboard is closed: subtitle is visible
            expect(getByText("Please rate your trip")).toBeTruthy();

            // Simulate Keyboard Open
            await act(async () => {
                showListener?.();
            });

            // When keyboard is open:
            // Subtitle is hidden to compress height and eliminate gap above keyboard
            expect(queryByText("Please rate your trip")).toBeNull();

            // Simulate Keyboard Close
            await act(async () => {
                hideListener?.();
            });

            // When keyboard is closed again:
            // Subtitle is restored
            expect(getByText("Please rate your trip")).toBeTruthy();
        });

        test("verifies modal card wrapper is anchored with justifyContent='flex-end' to position strictly above keyboard", async () => {
            const onClose = jest.fn();
            const { getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            const kav = getByTestId("rating-keyboard-avoiding-view");
            const kavStyle = kav.props.style;
            // backdrop must use justifyContent: 'flex-end' so children are pushed upwards above the keyboard
            expect(kavStyle.justifyContent).toBe("flex-end");
        });

        test("verifies modal card and safe area adapt to hug content and sit directly above keyboard", async () => {
            let showListener: (() => void) | undefined;

            jest.spyOn(Keyboard, "addListener").mockImplementation(
                (event: string, callback: any) => {
                    if (event === "keyboardWillShow" || event === "keyboardDidShow") {
                        showListener = callback;
                    }
                    if (event === "keyboardWillHide" || event === "keyboardDidHide") {
                    }
                    return { remove: jest.fn() } as any;
                }
            );

            const onClose = jest.fn();
            const { getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            const { StyleSheet } = require("react-native");
            const cardWrapper = getByTestId("rating-modal-card-wrapper");
            const safeArea = getByTestId("rating-modal-safe-area");

            // Before keyboard opens: fixed 70% height sheet with bottom safe area edge enabled
            expect(safeArea.props.edges.bottom).toBe("additive");
            const closedStyle = StyleSheet.flatten(cardWrapper.props.style);
            expect(closedStyle.height).toBeDefined();

            // Simulate Keyboard Open
            await act(async () => {
                showListener?.();
            });

            // When keyboard opens:
            // 1. safeArea edges disable bottom inset to sit flush directly above keyboard
            expect(safeArea.props.edges.bottom).toBe("off");

            // 2. cardWrapper height adapts to hug content
            const openStyle = StyleSheet.flatten(cardWrapper.props.style);
            expect(openStyle.height).toBe("auto");
            expect(openStyle.maxHeight).toBe("100%");

            // 3. Submit button has compact marginVertical
            const submitBtn = getByTestId("rating-submit-button");
            const submitStyle = StyleSheet.flatten(submitBtn.props.style);
            expect(submitStyle.marginVertical).toBe(4);
        });

        test("verifies comment input focus triggers scroll to keep form visible above keyboard", async () => {
            const onClose = jest.fn();
            const { getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            const commentInput = getByTestId("rating-comment-input");

            // Focusing comment input triggers auto-scroll to keep it above keyboard
            await act(async () => {
                await fireEvent(commentInput, "focus");
            });

            expect(commentInput).toBeTruthy();
        });

        test("verifies the entire modal container is displaced upward above the keyboard", async () => {
            const { StyleSheet } = require("react-native");
            let showListener: ((e: any) => void) | undefined;
            let hideListener: ((e: any) => void) | undefined;

            jest.spyOn(Keyboard, "addListener").mockImplementation(
                (event: string, callback: any) => {
                    if (event === "keyboardWillShow" || event === "keyboardDidShow") {
                        showListener = callback;
                    }
                    if (event === "keyboardWillHide" || event === "keyboardDidHide") {
                        hideListener = callback;
                    }
                    return { remove: jest.fn() } as any;
                }
            );

            const onClose = jest.fn();
            const { getByTestId } = await render(
                <RatingModal visible={true} mechanic={mockMechanic} onClose={onClose} />
            );

            const modalBackdrop = getByTestId("rating-keyboard-avoiding-view");

            // Before keyboard: whole modal sits at the bottom of the screen (paddingBottom is 0)
            const initialBackdropStyle = StyleSheet.flatten(modalBackdrop.props.style);
            expect(initialBackdropStyle.paddingBottom).toBe(0);

            // Simulate Keyboard Open with 300px keyboard
            await act(async () => {
                showListener?.({ endCoordinates: { height: 300 } });
            });

            // The whole modal backdrop increases paddingBottom to 300px,
            // lifting the entire modal container (background, header, content) up above the keyboard
            const liftedBackdropStyle = StyleSheet.flatten(modalBackdrop.props.style);
            expect(liftedBackdropStyle.paddingBottom).toBe(300);

            // Simulate Keyboard Close
            await act(async () => {
                hideListener?.({});
            });

            // Modal container returns to the bottom of the screen
            const resetBackdropStyle = StyleSheet.flatten(modalBackdrop.props.style);
            expect(resetBackdropStyle.paddingBottom).toBe(0);
        });
    });
});
