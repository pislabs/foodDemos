import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { PropsWithChildren, useEffect, useState } from "react";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
  }, []);

  console.log("NotificationProvider -------> expoPushToken:", expoPushToken);

  return <>{children}</>;
};

export default NotificationProvider;
