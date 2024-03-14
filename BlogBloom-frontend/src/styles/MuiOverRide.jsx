import { createTheme } from '@mui/material/styles';
const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#E1ECFD',
                },
            },
        },
    },
});

export default theme