import { openNotificationWithIcon } from "./notification-helper";

export const showErrorNotification = (title: string, description: string | Error) => {
  if (description instanceof Error) {
    openNotificationWithIcon("error", title, description.reason || description.message);
  } else {
    openNotificationWithIcon("error", title, description);
  }
};
