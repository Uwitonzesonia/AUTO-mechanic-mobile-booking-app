import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Svg, Path, SvgProps } from "react-native-svg";

export interface GoogleIconProps extends Omit<SvgProps, "style"> {
    size?: number | string;
    style?: StyleProp<ViewStyle>;
    styles?: StyleProp<ViewStyle>;
}

export const GoogleIcon = ({
    size = 16,
    width,
    height,
    style,
    styles,
    ...props
}: GoogleIconProps) => {
    const iconWidth = width ?? size;
    const iconHeight = height ?? size;
    const combinedStyle = styles ?? style;

    return (
        <Svg
            width={iconWidth}
            height={iconHeight}
            viewBox="0 0 16 16"
            fill="none"
            style={combinedStyle}
            {...props}
        >
            <Path
                d="M14.1646 6.52313H13.6413V6.49617H7.79489V9.09459H11.4661C10.9305 10.6072 9.49134 11.693 7.79489 11.693C5.64242 11.693 3.89725 9.94785 3.89725 7.79538C3.89725 5.64291 5.64242 3.89774 7.79489 3.89774C8.78846 3.89774 9.69239 4.27256 10.3806 4.88482L12.2181 3.04741C11.0579 1.96614 9.50595 1.29932 7.79489 1.29932C4.20744 1.29932 1.29883 4.20793 1.29883 7.79538C1.29883 11.3828 4.20744 14.2914 7.79489 14.2914C11.3823 14.2914 14.291 11.3828 14.291 7.79538C14.291 7.35982 14.2461 6.93465 14.1646 6.52313Z"
                fill="#FFC107"
            />
            <Path
                d="M2.04785 4.77179L4.18213 6.33701C4.75963 4.90723 6.15824 3.89774 7.79492 3.89774C8.78849 3.89774 9.69242 4.27256 10.3807 4.88482L12.2181 3.04741C11.0579 1.96614 9.50598 1.29932 7.79492 1.29932C5.29978 1.29932 3.13594 2.70799 2.04785 4.77179Z"
                fill="#FF3D00"
            />
            <Path
                d="M7.79484 14.2914C9.47277 14.2914 10.9974 13.6492 12.1501 12.605L10.1396 10.9037C9.48739 11.3977 8.67668 11.6929 7.79484 11.6929C6.10521 11.6929 4.67056 10.6156 4.13008 9.11206L2.01172 10.7442C3.08682 12.8479 5.27014 14.2914 7.79484 14.2914Z"
                fill="#4CAF50"
            />
            <Path
                d="M14.1646 6.52305H13.6414V6.49609H7.79492V9.09452H11.4662C11.2089 9.8211 10.7415 10.4476 10.1387 10.904C10.139 10.9037 10.1394 10.9037 10.1397 10.9033L12.1502 12.6047C12.0079 12.7339 14.291 11.0433 14.291 7.79531C14.291 7.35975 14.2462 6.93458 14.1646 6.52305Z"
                fill="#1976D2"
            />
        </Svg>
    );
};

export default GoogleIcon;