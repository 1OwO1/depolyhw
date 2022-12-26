import { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Box from '@mui/material/Box';
import TabPanel from './TabPanel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import DenseTable from './DenseTable';

import { useStyles } from '../hooks';
import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  padding: 2em;
  overflow: auto;
`;

const Body = () => {
  const classes = useStyles();

  const { messages, TableMessage, addCardMessage, addRegularMessage, addErrorMessage, updateTableMessage } =
    useScoreCard();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState(0);

  const [queryType, setQueryType] = useState('name');
  const [queryString, setQueryString] = useState('');

  const handleChange = (func) => (event) => {
    func(event.target.value);
  };

  const handleAdd = async () => {
    const {
      data: { message, card },
    } = await axios.post('/card', {
      name,
      subject,
      score,
    });
    if (!card) addErrorMessage(message);
    else{
      addCardMessage(message);
      updateTableMessage([...card]);
    };
  };

  const handleQuery = async () => {
    const {
      data: { messages, message, card },
    } = await axios.get('/cards', {
      params: {
        type: queryType,
        queryString,
      },
    });
   
    if (!messages) addErrorMessage(message);
    else{
      addRegularMessage(...messages);
      updateTableMessage(card);
    };
  };

  //table



// Tabs

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Wrapper>
      <Row>
        {/* Could use a form & a library for handling form data here such as Formik, but I don't really see the point... */}
        <TextField
          className={classes.input}
          placeholder="Name"
          value={name}
          onChange={handleChange(setName)}
        />
        <TextField
          className={classes.input}
          placeholder="Subject"
          style={{ width: 240 }}
          value={subject}
          onChange={handleChange(setSubject)}
        />
        <TextField
          className={classes.input}
          placeholder="Score"
          value={score}
          onChange={handleChange(setScore)}
          type="number"
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!name || !subject}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Row>
      <Row>
        <StyledFormControl>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={queryType}
              onChange={handleChange(setQueryType)}
            >
              <FormControlLabel
                value="name"
                control={<Radio color="primary" />}
                label="Name"
              />
              <FormControlLabel
                value="subject"
                control={<Radio color="primary" />}
                label="Subject"
              />
            </RadioGroup>
          </FormControl>
        </StyledFormControl>
        <TextField
          placeholder="Query string..."
          value={queryString}
          onChange={handleChange(setQueryString)}
          style={{ flex: 1 }}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!queryString}
          onClick={handleQuery}
        >
          Query
        </Button>
      </Row>
      {/* <ContentPaper variant="outlined">
        {messages.map((m, i) => (
          <Typography variant="body2" key={m + i} style={{ color: m.color }}>
            {m.message}
          </Typography>
        ))}
      </ContentPaper> */}
      <ContentPaper variant="outlined">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Add" {...a11yProps(0)} />
            <Tab label="Query" {...a11yProps(0)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
        {messages.map((m, i) => {
            const FirstLetter=m.message[0];
            if(FirstLetter==='A'|| FirstLetter==='D' || (FirstLetter==='U' && !(i===(messages.length-1)))){
              return(
                <Typography variant="body2" key={m + i} style={{ color: m.color }}>
                  {m.message}
                </Typography>
              )
            }
            else if( FirstLetter==='U' ){
              return(
                <>
                  <Typography variant="body2" key={m + i} style={{ color: m.color }}>
                    {m.message}
                  </Typography>
                  {DenseTable(TableMessage)}
                </>
              )
            }
          })}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {messages.map((m, i) => {
            const FirstLetter=m.message[0];
            if(FirstLetter==='N' || FirstLetter==='S' || (FirstLetter==='F' && !(i===(messages.length-1)))){
              return(
                <Typography variant="body2" key={m + i} style={{ color: m.color }}>
                  {m.message}
                </Typography>
              )
            }
            else if((FirstLetter==='F')){
              return(
                <>
                  <Typography variant="body2" key={m + i} style={{ color: m.color }}>
                    {m.message}
                  </Typography>
                  {DenseTable(TableMessage)}
                </>
              )
            }
          })}
        </TabPanel>
      </ContentPaper>
    </Wrapper>
  );
};

export default Body;
