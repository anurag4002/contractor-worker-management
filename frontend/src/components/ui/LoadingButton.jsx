import React from "react";
import Button from "./Button";

const LoadingButton = ({ loading, children, loadingText = "Saving...", ...props }) => {
    return (
        <Button disabled={loading} {...props}>
            {loading ? loadingText : children}
        </Button>
    );
};

export default LoadingButton;
