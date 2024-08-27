import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: 'auto',
  maxWidth: 300,
}));

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  margin: theme.spacing(0.5),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (prevValue === null) {
      setPrevValue(parseFloat(display));
      setDisplay('0');
    } else {
      handleEqualsClick();
    }
    setOperation(op);
  };

  const handleEqualsClick = async () => {
    if (prevValue !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, prevValue, parseFloat(display));
        switch (result.tag) {
          case 'ok':
            setDisplay(result.value.toString());
            break;
          case 'err':
            setDisplay('Error');
            break;
        }
      } catch (error) {
        console.error('Calculation error:', error);
        setDisplay('Error');
      }
      setLoading(false);
      setPrevValue(null);
      setOperation('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperation('');
    setPrevValue(null);
  };

  return (
    <CalculatorPaper elevation={3}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            value={display}
            InputProps={{
              readOnly: true,
              endAdornment: loading ? <CircularProgress size={20} /> : null,
            }}
          />
        </Grid>
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((num) => (
          <Grid item xs={3} key={num}>
            <CalculatorButton
              fullWidth
              variant="contained"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </CalculatorButton>
          </Grid>
        ))}
        {['+', '-', '*', '/'].map((op) => (
          <Grid item xs={3} key={op}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => handleOperationClick(op)}
            >
              {op}
            </CalculatorButton>
          </Grid>
        ))}
        <Grid item xs={6}>
          <CalculatorButton
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleClear}
          >
            C
          </CalculatorButton>
        </Grid>
        <Grid item xs={6}>
          <CalculatorButton
            fullWidth
            variant="contained"
            style={{ backgroundColor: '#28a745', color: 'white' }}
            onClick={handleEqualsClick}
          >
            =
          </CalculatorButton>
        </Grid>
      </Grid>
    </CalculatorPaper>
  );
};

export default App;
