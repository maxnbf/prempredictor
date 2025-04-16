import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Typography, Container } from "@mui/material";
import CreatePrediction from "./CreatePrediction";

export const NewUserOnboarding: React.FC = () => {
    // Get the username from Redux store
    const username = useSelector((state: any) => state.auth.user_info.username);
  
    const [onboardingPage, setOnboardingPage] = useState(0)
    
    if (onboardingPage == 0) {
        return (
            <>
                <Typography variant="h4" gutterBottom>
                    Hello, {username}!
                </Typography>
                <Typography variant="h6" paragraph>
                    Welcome to Premier League Season Predictor.
                </Typography>
                <Typography paragraph>
                    To complete your new account, you must create a prediction for the
                    final standings of the 2024/2025 Premier League season.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOnboardingPage(prev => prev + 1)}
                    fullWidth
                >
                    Continue to Create Prediction
                </Button>
            </>
        );
    } else if (onboardingPage == 1) {
        return <CreatePrediction />
    } else {
        return <div>Something went wrong</div>
    }
}