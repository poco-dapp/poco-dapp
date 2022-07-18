import { openNotificationWithIcon } from "./notification-helper";

interface ErrorExt extends Error {
  reason?: string;
}

export const showErrorNotification = (title: string, description: string | ErrorExt) => {
  if (typeof description === "string") {
    openNotificationWithIcon("error", title, description);
  } else {
    openNotificationWithIcon("error", title, description.reason || description.message);
  }
};
