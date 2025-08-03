import * as React from 'react';
import {Button, Typography, Container} from '@mui/material';

export default function Page() {
    return(
        <Container>
            <Typography variant="h4">
                Material UI 
            </Typography>
            <Button variant="contained" color="primary">
                Click Me
            </Button>
        </Container>
    )

}