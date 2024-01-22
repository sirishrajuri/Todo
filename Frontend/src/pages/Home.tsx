import { useState, useEffect, useContext, useMemo } from "react";
import { AddTaskBtn, Tasks } from "../components";
import {
  ColorPalette,
  GreetingHeader,
  ProgressPercentageContainer,
  StyledProgress,
  TaskCompletionText,
  TaskCountHeader,
  TaskCountTextContainer,
  TasksCount,
  TasksCountContainer,
} from "../styles";

import { displayGreeting, getTaskCompletionText } from "../utils";
import { Emoji } from "emoji-picker-react";
import { Box, Typography } from "@mui/material";
import { UserContext } from "../contexts/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);

  const [tasksWithDeadlineTodayCount, setTasksWithDeadlineTodayCount] = useState<number>(0);
  const [tasksDueTodayNames, setTasksDueTodayNames] = useState<string[]>([]);

  const completedTaskPercentage = useMemo(
    () => (completedTasksCount / user.tasks.length) * 100,
    [completedTasksCount, user.tasks.length]
  );

  useEffect(() => {
    const completedCount = user.tasks.filter((task) => task.done).length;
    setCompletedTasksCount(completedCount);

    const today = new Date().setHours(0, 0, 0, 0);

    const dueTodayTasks = user.tasks.filter((task) => {
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline).setHours(0, 0, 0, 0);
        return taskDeadline === today && !task.done;
      }
      return false;
    });

    setTasksWithDeadlineTodayCount(dueTodayTasks.length);

    const taskNamesDueToday = dueTodayTasks.map((task) => task.name);
    setTasksDueTodayNames(taskNamesDueToday);
  }, [user.tasks]);

  return (
    <>
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={user.emojisStyle} /> &nbsp; {displayGreeting()}
        {user.name && <span translate="no">, {user.name}</span>}
      </GreetingHeader>
      {user.tasks.length > 0 && (
        <TasksCountContainer>
          <TasksCount glow={user.settings[0].enableGlow}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <StyledProgress
                variant="determinate"
                value={completedTaskPercentage}
                size={64}
                thickness={5}
                aria-label="Progress"
                style={{
                  filter: user.settings[0].enableGlow
                    ? `drop-shadow(0 0 6px ${ColorPalette.purple + "C8"})`
                    : "none",
                }}
              />

              <ProgressPercentageContainer>
                <Typography
                  variant="caption"
                  component="div"
                  color="white"
                  sx={{ fontSize: "16px", fontWeight: 600 }}
                >{`${Math.round(completedTaskPercentage)}%`}</Typography>
              </ProgressPercentageContainer>
            </Box>
            <TaskCountTextContainer>
              <TaskCountHeader>
                {}
                {completedTasksCount === 0
                  ? `You have ${user.tasks.length} task${
                      user.tasks.length > 1 ? "s" : ""
                    } to complete.`
                  : `You've completed ${completedTasksCount} out of ${user.tasks.length} tasks.`}
              </TaskCountHeader>
              <TaskCompletionText>
                {getTaskCompletionText(completedTaskPercentage)}
              </TaskCompletionText>
              {tasksWithDeadlineTodayCount > 0 && (
                <span style={{ opacity: 0.8 }}>
                  Tasks due today:{" "}
                  {new Intl.ListFormat("en", { style: "long" }).format(tasksDueTodayNames)}
                </span>
              )}
            </TaskCountTextContainer>
          </TasksCount>
        </TasksCountContainer>
      )}

      <Tasks />

      <AddTaskBtn animate={user.tasks.length === 0} />
    </>
  );
};

export default Home;
