import { notification } from "antd";

export type NotificationType = "success" | "info" | "warning" | "error";

export const openNotificationWithIcon = (
  type: NotificationType,
  title: string,
  description: string
) => {
  notification[type]({
    message: title,
    description: description,
  });
};
