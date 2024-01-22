import { useStorageState } from "./hooks/useStorageState";
import { defaultUser } from "./constants/defaultUser";
import { User } from "./types/user";
import { ColorPalette, GlobalStyles, MuiTheme } from "./styles";
import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { ErrorBoundary } from "./components";
import { MainLayout } from "./layouts/MainLayout";
import AppRouter from "./router";
import { Toaster } from "react-hot-toast";
import { UserContext } from "./contexts/UserContext";

function App() {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");

  useEffect(() => {
    const updateNestedProperties = (userObject: any, defaultObject: any) => {
      if (!userObject) {
        return defaultObject;
      }

      Object.keys(defaultObject).forEach((key) => {
        const userValue = userObject[key];
        const defaultValue = defaultObject[key];

        if (typeof defaultValue === "object" && defaultValue !== null) {
          userObject[key] = updateNestedProperties(userValue, defaultValue);
        } else if (userValue === undefined) {
          userObject[key] = defaultValue;
        }
      });

      return userObject;
    };

    setUser((prevUser) => {
      if (
        JSON.stringify(prevUser) !==
        JSON.stringify(updateNestedProperties({ ...prevUser }, defaultUser))
      ) {
        return updateNestedProperties({ ...prevUser }, defaultUser);
      }
      return prevUser;
    });
  }, []);

  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStyles />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            marginBottom: "12px",
          }}
          toastOptions={{
            position: "bottom-center",
            duration: 4000,
            style: {
              padding: "14px 22px",
              borderRadius: "18px",
              fontSize: "17px",
              border: `2px solid ${ColorPalette.purple}`,
              background: "#141431e0",
              WebkitBackdropFilter: "blur(6px)",
              backdropFilter: "blur(6px)",
              color: ColorPalette.fontLight,
            },
            success: {
              iconTheme: {
                primary: ColorPalette.purple,
                secondary: "white",
              },
              style: {},
            },
            error: {
              iconTheme: {
                primary: ColorPalette.red,
                secondary: "white",
              },
              style: {
                borderColor: ColorPalette.red,
              },
            },
          }}
        />
        <UserContext.Provider value={{ user, setUser }}>
          <ErrorBoundary>
            <MainLayout>
              <AppRouter />
            </MainLayout>
          </ErrorBoundary>
        </UserContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
