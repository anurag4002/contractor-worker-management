import React from "react";
import Button from "./Button";

const LoadingButton = ({ loading, children, loadingText = "Saving...", variant = "primary", ...props }) => {
    return (
        <Button disabled={loading} variant={variant} {...props}>
            {loading ? loadingText : children}
        </Button>
    );
};

export default LoadingButton;
