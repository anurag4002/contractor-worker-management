import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/common/Toast.jsx";
import { SubscriptionProvider } from "./context/SubscriptionContext";

function App() {
  return (
    <>
      <SubscriptionProvider>
        <AppRoutes />
        <Toast />
      </SubscriptionProvider>
    </>
  );
}

export default App;