import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MockData from "./api/dataMock.json";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
interface IData {
  id: number;
  nameMatter: string;
  topic: {
    id: number;
    nameTopic: string;
    subtopic: {
      id: number;
      nameSubtopic: string;
      exercises: {
        id: number;
        labelExercises: string;
        descriptionExercises: string;
        answered: boolean;
        answerUser: string;

        alternative: {
          nameAlternative: string;
          descriptionAlternative: string;
          answer: boolean;
        }[];
      }[];
    }[];
  }[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const App: React.FC = () => {
  const [dataMock, setData] = useState<IData[]>(MockData);
  const [value, setValue] = useState(0);
  const [question, setQuestion] = useState({
    id: 0,
    labelExercises: "",
    descriptionExercises: "",
    answered: false,
    answerUser: "",
    alternative: [
      { nameAlternative: "", descriptionAlternative: "", answer: false },
    ],
  });
  const [amountQuestions, setAmountQuestions] = useState(0);
  const [topicSelected, setTopicSelected] = useState(0);
  const [subTopicSelected, setSubTopicSelected] = useState(0);
  const [exerciseSelected, setExerciseSelected] = useState(0);
  const [isSelected, setIsSelected] = useState(false);

  //FUNÇÃO QUE APOS O USUÁRIO ESCOLHER UMA ALTERNATIVA, SALVA A ALTERNATIVA ESCOLHIDA E MARCA COMO RESPONDIDA
  const answerUser = (answerUser: string, indexAlt: number) => {
    setIsSelected(true);
    const newData = dataMock.map((matter) => {
      const topics = matter.topic.map((topic, indexTopic) => {
        const subTopics = topic.subtopic.map((subtopic, indexSub) => {
          const exercises = subtopic.exercises.map(
            (exercises, indexExercises) => {
              if (
                matter.id === value &&
                indexTopic === topicSelected &&
                indexSub === subTopicSelected &&
                indexExercises === exerciseSelected
              ) {
                setQuestion({
                  ...exercises,
                  answered: true,
                  answerUser: answerUser,
                });
                return { ...exercises, answered: true, answerUser: answerUser };
              } else {
                return { ...exercises };
              }
            }
          );
          return { ...subtopic, exercises: exercises };
        });
        return { ...topic, subtopic: subTopics };
      });
      return { ...matter, topic: topics };
    });
    setData(newData);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //FUNÇÃO QUE APOS O USUÁRIO ESCOLHER UM EXERCICIO SALVA A POSIÇÃO DO EXERCICIO PARA USAR FUTURAMENTE (NO CASO USA PARA SALVAR A ALTERNATIVA)
  const chosenExercise = (
    posicaoTopico: number,
    posicaoSubTopico: number,
    posicaoExercises: number
  ) => {
    setTopicSelected(posicaoTopico);
    setSubTopicSelected(posicaoSubTopico);
    setExerciseSelected(posicaoExercises);
    setAmountQuestions(
      dataMock[value].topic[posicaoTopico].subtopic[posicaoSubTopico].exercises
        .length
    );
    setQuestion(
      dataMock[value].topic[posicaoTopico].subtopic[posicaoSubTopico].exercises[
        posicaoExercises
      ]
    );
  };

  return (
    <Container className="flex flex-col items-center">
      <>
        <Box sx={{ width: "100%" }}>
          {/* listagem das materias */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {dataMock.map((matter) => {
                return <Tab label={matter.nameMatter} {...a11yProps(0)} />;
              })}
            </Tabs>
          </Box>

          {dataMock[value].topic.map((topic, indexTopic) => {
            return (
              <TabPanel value={value} index={value}>
                {/* listagem dos topicos */}
                <Accordion key={topic.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="expand" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="text-lg font-medium" variant="h5">
                      {topic.nameTopic}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    {topic.subtopic.map((subtopic, indexSub) => {
                      return (
                        <div>
                          {/* listagem dos subtopicos */}
                          <Typography className="mb-4 text-base" variant="h6">
                            <AssignmentRoundedIcon
                              className="mr-2"
                              color="primary"
                            />
                            {subtopic.nameSubtopic}
                          </Typography>

                          <Grid container spacing={2}>
                            {subtopic.exercises.map(
                              (exercises, indexExercises) => {
                                return (
                                  //listagem dos exercicios
                                  <Grid item xs>
                                    <Button
                                      className="border-2 rounded-lg px-12"
                                      onClick={() => {
                                        chosenExercise(
                                          indexTopic,
                                          indexSub,
                                          indexExercises
                                        );
                                      }}
                                      variant="outlined"
                                    >
                                      {exercises.labelExercises}
                                    </Button>
                                  </Grid>
                                );
                              }
                            )}
                          </Grid>
                        </div>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              </TabPanel>
            );
          })}
        </Box>
        {question.alternative.length > 1 && (
          <Box className=" p-7" sx={{ width: "50%" }}>
            {/* listagem da pergunta */}
            <>
              <Typography className="text-sky-500 font-semibold">
                {question.labelExercises} / {amountQuestions}
              </Typography>
              <Typography className="font-semibold">
                {question.descriptionExercises}
              </Typography>
              {question.alternative.map((alt, indexAlt) => {
                return (
                  //listagem das alternativas
                  <div className="flex my-3">
                    <Button
                      onClick={() => {
                        answerUser(alt.nameAlternative, indexAlt);
                      }}
                      className={`py-1 px-[.7rem] font-semibold min-w-fit text-black ${
                        isSelected &&
                        question.answered &&
                        question.answerUser === alt.nameAlternative &&
                        "bg-sky-500 text-white"
                      } `}
                      variant="outlined"
                    >
                      {alt.nameAlternative}
                    </Button>
                    <Typography className="ml-4 font-semibold">
                      {alt.descriptionAlternative}
                    </Typography>
                  </div>
                );
              })}
            </>
          </Box>
        )}
      </>
    </Container>
  );
};

export default App;
