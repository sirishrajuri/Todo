import {
  AddRounded,
  CategoryRounded,
  GetAppRounded,
  PersonRounded,
  TaskAlt,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, css, styled } from "@mui/material";
import { ColorPalette, pulseAnimation, slideInBottom } from "../styles";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export const BottomNav = (): JSX.Element | null => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [value, setValue] = useState<number | undefined>();
  const n = useNavigate();

  const smallIconSize = "29px";

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "task") {
      setValue(0);
    } else {
      switch (location.pathname) {
        case "/categories":
          setValue(1);
          break;
        case "/add":
          setValue(2);
          break;
        case "/import-export":
          setValue(3);
          break;
        case "/user":
          setValue(4);
          break;
        case "/":
          setValue(0);
          break;
        default:
          setValue(undefined);
      }
    }
  }, [location.pathname]);

  return (
    <Container>
      <StyledBottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setValue(newValue);
        }}
      >
        <NavigationButton
          onClick={() => n("add")}
          showLabel={false}
          aria-label="Add"
          icon={
            <AddIcon
              fontSize="large"
              animate={user.tasks.length === 0 && value !== 2 ? true : undefined}
            />
          }
        />
      </StyledBottomNavigation>
    </Container>
  );
};

const AddIcon = styled(AddRounded)<{ animate?: boolean }>`
  border: 2px solid ${ColorPalette.purple};
  background-color: #232e58;
  font-size: 38px;
  border-radius: 100px;
  padding: 6px;
  margin: 14px;
  ${({ animate }) =>
    animate &&
    css`
      animation: ${pulseAnimation} 1.2s infinite;
    `}
`;

const Container = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0;
  animation: ${slideInBottom} 0.5s ease;
  z-index: 999; /*9999*/
`;

const StyledBottomNavigation = styled(BottomNavigation)`
  border-radius: 24px 24px 0 0;
  background: #232e58e1;
  backdrop-filter: blur(18px);
  margin: 0px 20px 0px -20px;
  padding: 18px 10px 32px 10px;
`;

const NavigationButton = styled(BottomNavigationAction)`
  border-radius: 18px;
  margin: 4px;
  color: white;

  &:disabled {
    opacity: 0.6;
    & .MuiBottomNavigationAction-label {
      text-shadow: none;
    }
  }
  & .MuiBottomNavigationAction-label {
    font-size: 13px;
    text-shadow: 0 0 12px #000000ce;
  }
  & .Mui-selected {
    /* text-shadow: 0 0 5px ${ColorPalette.purple}; */
  }
`;
