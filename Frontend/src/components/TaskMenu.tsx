import {
  DeleteRounded,
  Done,
  EditRounded,
  LaunchRounded,
  PushPinRounded,
} from "@mui/icons-material";
import {
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import styled from "@emotion/styled";
import "react-spring-bottom-sheet/dist/style.css";
import { ColorPalette } from "../styles";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

//TODO: Move all functions to TasksMenu component

interface TaskMenuProps {
  selectedTaskId: number | null;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: null | HTMLElement;
  handleMarkAsDone: () => void;
  handleDeleteTask: () => void;
  handleCloseMoreMenu: () => void;
}

export const TaskMenu = ({
  selectedTaskId,
  setEditModalOpen,
  anchorEl,
  handleMarkAsDone,
  handleDeleteTask,
  handleCloseMoreMenu,
}: TaskMenuProps) => {
  const { user } = useContext(UserContext);
  const n = useNavigate();

  const redirectToTaskDetails = () => {
    const selectedTask = user.tasks.find((task) => task.id === selectedTaskId);
    const taskId = selectedTask?.id.toString().replace(".", "");
    n(`/task/${taskId}`);
  };

  const menuItems: JSX.Element = (
    <div>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handleMarkAsDone();
        }}
      >
        <Done /> &nbsp;{" "}
        {user.tasks.find((task) => task.id === selectedTaskId)?.done
          ? "Mark as not done"
          : "Mark as done"}
      </StyledMenuItem>
      <StyledMenuItem onClick={redirectToTaskDetails}>
        <LaunchRounded /> &nbsp; Task details
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          setEditModalOpen(true);
        }}
      >
        <EditRounded /> &nbsp; Edit
      </StyledMenuItem>
      <StyledMenuItem
        clr={ColorPalette.red}
        onClick={() => {
          handleCloseMoreMenu();
          handleDeleteTask();
        }}
      >
        <DeleteRounded /> &nbsp; Delete
      </StyledMenuItem>
    </div>
  );
  return (
    <>
      {(
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreMenu}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "18px",
              minWidth: "200px",
              boxShadow: "none",
              padding: "6px 4px",
            },
          }}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
        >
          {menuItems}
        </Menu>
      )}
    </>
  );
};

const StyledMenuItem = styled(MenuItem)<{ clr?: string }>`
  margin: 0 6px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: none;
  gap: 2px;
  color: ${({ clr }) => clr || ColorPalette.fontDark};

  &:hover {
    background-color: #f0f0f0;
  }
`;
