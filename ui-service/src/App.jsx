import { Routes, Route } from "react-router-dom";
import { MantineProvider, AppShell, Box } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";

import CustomerSidebar from "./components/CustomerPages/CustomerSidebar";
import DispatcherSidebar from "./components/DispatcherPages/DispatcherSidebar";
import ActiveDeliveries from "./components/CustomerPages/ActiveDeliveries";
import PastDeliveries from "./components/CustomerPages/PastDeliveries";
import TrackDelivery from "./components/CustomerPages/TrackDelivery";
import CustomerLogin from "./components/CustomerPages/CustomerLogin";
import DispatcherLogin from "./components/DispatcherPages/DispatcherLogin";
import Deliverers from "./components/DispatcherPages/Deliverers";
import Customers from "./components/DispatcherPages/Customers";
import Dispatchers from "./components/DispatcherPages/Dispatchers";
import DispatcherBoxes from "./components/DispatcherPages/DispatcherBoxes";
import Deliveries from "./components/DispatcherPages/Deliveries";
import DeletedDeliveries from "./components/DispatcherPages/DeletedDeliveries";
import DelivererLogin from "./components/DelivererPages/DelivererLogin";
import DelivererBoxes from "./components/DelivererPages/DelivererBoxes";
import QRCodeScan from "./components/DelivererPages/QRCodeScan";
import Home from "./components/Home";
import Header from "./components/Header";
import DelivererSidebar from "./components/DelivererPages/DelivererSidebar";
import AuthProvider from "./AuthProvider";
import { Error404Page } from "./components/Error404Page";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <NotificationsProvider position="top-center" zIndex={2077}>
            <Box sx={{ display: "flex" }}>
              <Routes>
                <Route
                  path="/customer/active-deliveries"
                  element={
                    <>
                      <AppShell
                        navbar={<CustomerSidebar label="Active Deliveries" />}
                        header={<Header />}
                      >
                        <ActiveDeliveries sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/customer/past-deliveries"
                  element={
                    <>
                      <AppShell
                        navbar={<CustomerSidebar label="Past Deliveries" />}
                        header={<Header />}
                      >
                        <PastDeliveries sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/customer/track-delivery"
                  element={
                    <>
                      <AppShell
                        navbar={<CustomerSidebar label="Track Delivery" />}
                        header={<Header />}
                      >
                        <TrackDelivery sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/dispatcher/dispatchers"
                  element={
                    <>
                      <AppShell
                        navbar={<DispatcherSidebar label="Dispatchers" />}
                        header={<Header />}
                      >
                        <Dispatchers sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/dispatcher/deliverers"
                  element={
                    <>
                      <AppShell
                        navbar={<DispatcherSidebar label="Deliverers" />}
                        header={<Header />}
                      >
                        <Deliverers sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/dispatcher/customers"
                  element={
                    <>
                      <AppShell
                        navbar={<DispatcherSidebar label="Customers" />}
                        header={<Header />}
                      >
                        <Customers sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/dispatcher/boxes"
                  element={
                    <>
                      <AppShell
                        navbar={<DispatcherSidebar label="Boxes" />}
                        header={<Header />}
                      >
                        <DispatcherBoxes sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/dispatcher/deliveries"
                  element={
                    <>
                      <AppShell
                        navbar={<DispatcherSidebar label="Deliveries" />}
                        header={<Header />}
                      >
                        <Deliveries sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/dispatcher/deleted-deliveries"
                  element={
                    <>
                      <AppShell
                        navbar={
                          <DispatcherSidebar label="Deleted Deliveries" />
                        }
                        header={<Header />}
                      >
                        <DeletedDeliveries sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/deliverer/boxes"
                  element={
                    <>
                      <AppShell
                        navbar={<DelivererSidebar label="Boxes" />}
                        header={<Header />}
                      >
                        <DelivererBoxes sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/deliverer/scan-qr-code"
                  element={
                    <>
                      <AppShell
                        navbar={<DelivererSidebar label="QR Code" />}
                        header={<Header />}
                      >
                        <QRCodeScan sx={{ overflowY: "auto" }} />
                      </AppShell>
                    </>
                  }
                />
                <Route
                  path="/customer/login"
                  element={<CustomerLogin />}
                ></Route>
                <Route
                  path="/dispatcher/login"
                  element={<DispatcherLogin />}
                ></Route>
                <Route
                  path="/deliverer/login"
                  element={<DelivererLogin />}
                ></Route>
                <Route path="/" element={<Home />}></Route>
                <Route path="*" element={<Error404Page />}></Route>
              </Routes>
            </Box>
          </NotificationsProvider>
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
