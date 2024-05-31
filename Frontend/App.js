import { TestTypeProvider } from "./context/TestContext";
import Navigation from "./Navigation";
export default function App() {
  return (
    <TestTypeProvider>
      <Navigation />
    </TestTypeProvider>
  );
}
