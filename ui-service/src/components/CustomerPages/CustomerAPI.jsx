import { useAuth } from "../../AuthProvider";

import { useQuery } from "react-query";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";

function useGetActiveDeliveries() {
  const { axios } = useAuth();
  return useQuery("getActiveDeliveries", async () => {
    const { data } = await axios.get(
      "/delivery-service/delivery/active-deliveries"
    );
    return data;
  });
}

function useGetPastDeliveries() {
  const { axios } = useAuth();
  return useQuery("getPastDeliveries", async () => {
    const { data } = await axios.get(
      "/delivery-service/delivery/past-deliveries"
    );
    return data;
  });
}

function useTrackDelivery(trackingCode, setTrackOpened) {
  const { axios } = useAuth();
  return useQuery(
    ["getDeliveryStatus"],
    async () => {
      const { data } = await axios.get(
        "/delivery-service/delivery/tracking-code/" + trackingCode
      );
      return data;
    },
    {
      onError: (error) => {
        showNotification({
          id: "error-notification-track",
          autoClose: 5000,
          title: "Error",
          message: error.response?.data,
          color: "red",
          icon: <IconX />,
          className: "my-notification-class",
          loading: false,
        });
        setTrackOpened(false);
      },
      onSuccess: () => {
        setTrackOpened(true);
      },
      retry: false,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
}
export { useGetActiveDeliveries, useGetPastDeliveries, useTrackDelivery };
