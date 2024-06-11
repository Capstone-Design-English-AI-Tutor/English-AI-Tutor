import React from "react";
import { TestTypeProvider } from "./context/TestContext";
import Navigation from "./Navigation";
import Toast from "react-native-toast-message";

export default function App() {
  const toastRef = React.useRef();

  return (
    <TestTypeProvider>
      <Navigation />
      <Toast ref={toastRef} />
    </TestTypeProvider>
  );
}
