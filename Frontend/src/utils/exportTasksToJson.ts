import { Task } from "../types/user";

export const exportTasksToJson = (selectedTasks: Task[]): void => {
  const timestamp = new Date().toLocaleString().replace(/[/:, ]/g, "_");
  const filename = `Tasks_${timestamp}.json`;

  const dataStr = JSON.stringify(selectedTasks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  const url = window.URL.createObjectURL(blob);

  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = filename;
  linkElement.click();
  console.log(`Exported tasks to ${filename}`);
  window.URL.revokeObjectURL(url);
};
