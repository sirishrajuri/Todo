import { Category, Task } from "../types/user";
import { ReactNode, useContext, useEffect, useState } from "react";
import { calculateDateDifference, formatDate, getFontColorFromHex } from "../utils";
import {
  Close,
  Link,
  MoreVert,
  Search
} from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { EditTask } from ".";
import {
  CategoriesListContainer,
  CategoryChip,
  ColorPalette,
  DialogBtn,
  HighlightedText,
  NoTasks,
  RingAlarm,
  SearchInput,
  ShowMoreBtn,
  TaskComponent,
  TaskDate,
  TaskDescription,
  TaskHeader,
  TaskInfo,
  TaskName,
  TasksContainer,
  TimeLeft,
} from "../styles";

import { TaskMenu } from ".";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { DESCRIPTION_SHORT_LENGTH } from "../constants";

export const Tasks = (): JSX.Element => {
  const { user, setUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [search, setSearch] = useStorageState<string>("", "search", "sessionStorage");
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, taskId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMoreMenu = () => {
    setAnchorEl(null);
    document.body.style.overflow = "visible";
  };

  const reorderTasks = (tasks: Task[]): Task[] => {
    return tasks;
  };

  const handleMarkAsDone = () => {
    if (selectedTaskId) {
      const updatedTasks = user.tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, done: !task.done };
        }
        return task;
      });
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      const allTasksDone = updatedTasks.every((task) => task.done);

      if (allTasksDone) {
        toast.success(
          () => (
            <div>
              <b>All tasks done</b>
              <br />
              <span>You've checked off all your todos. Well done!</span>
            </div>
          ),
          {
            icon: <Emoji unified="1f60e" emojiStyle={user.emojisStyle} />,
          }
        );
      }
    }
  };

  const handleDeleteTask = () => {

    if (selectedTaskId) {
      setDeleteDialogOpen(true);
    }
  };
  const confirmDeleteTask = () => {

    if (selectedTaskId) {
      const updatedTasks = user.tasks.filter((task) => task.id !== selectedTaskId);
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      setDeleteDialogOpen(false);
      toast.success((t) => (
        <div onClick={() => toast.dismiss(t.id)}>
          Deleted Task - <b>{user.tasks.find((task) => task.id === selectedTaskId)?.name}</b>
        </div>
      ));
    }
  };
  const cancelDeleteTask = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditTask = (
    taskId: number,
    newName: string,
    newColor: string,
    newDescription?: string,
    newDeadline?: Date,
    newCategory?: Category[]
  ) => {
    const updatedTasks = user.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          name: newName,
          color: newColor,
          description: newDescription,
          deadline: newDeadline,
          category: newCategory,
          lastSave: new Date(),
        };
      }
      return task;
    });
    setUser((prevUser) => ({
      ...prevUser,
      tasks: updatedTasks,
    }));
  };


  const [categories, setCategories] = useState<Category[] | undefined>(undefined);

  const [selectedCatId, setSelectedCatId] = useStorageState<number | undefined>(
    undefined,
    "selectedCategory",
    "sessionStorage"
  );

  const [categoryCounts, setCategoryCounts] = useState<{
    [categoryId: number]: number;
  }>({});

  useEffect(() => {
    const tasks: Task[] = reorderTasks(user.tasks);
    const uniqueCategories: Category[] = [];

    tasks.forEach((task) => {
      if (task.category) {
        task.category.forEach((category) => {
          if (!uniqueCategories.some((c) => c.id === category.id)) {
            uniqueCategories.push(category);
          }
        });
      }
    });

    const counts: { [categoryId: number]: number } = {};
    uniqueCategories.forEach((category) => {
      const categoryTasks = tasks.filter((task) =>
        task.category?.some((cat) => cat.id === category.id)
      );
      counts[category.id] = categoryTasks.length;
    });

    uniqueCategories.sort((a, b) => {
      const countA = counts[a.id] || 0;
      const countB = counts[b.id] || 0;
      return countB - countA;
    });

    setCategories(uniqueCategories);
    setCategoryCounts(counts);
  }, [user.tasks, search]);

  const toggleShowMore = (taskId: number) => {
    setExpandedTasks((prevExpandedTasks) => {
      const newSet = new Set(prevExpandedTasks);
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
      return newSet;
    });
  };

  const highlightMatchingText = (text: string, search: string): ReactNode => {
    if (!search) {
      return text;
    }

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <HighlightedText key={index}>{part}</HighlightedText>
      ) : (
        part
      )
    );
  };
  const checkOverdueTasks = (tasks: Task[]) => {
    const overdueTasks = tasks.filter((task) => {
      return task.deadline && new Date() > new Date(task.deadline) && !task.done;
    });

    if (overdueTasks.length > 0) {
      const taskNames = overdueTasks.map((task) => task.name);
      const formatTasksArray = new Intl.ListFormat("en-US", {
        style: "long",
        type: "conjunction",
      });

      toast.error(
        (t) => (
          <div
            translate="no"
            onClick={() => toast.dismiss(t.id)}
            style={{ wordBreak: "break-word" }}
          >
            <b translate="yes">Overdue task{overdueTasks.length > 1 && "s"}: </b>
            {formatTasksArray.format(taskNames)}
          </div>
        ),
        {
          duration: 3400,
          icon: <RingAlarm animate sx={{ color: ColorPalette.red }} />,
        }
      );
    }
  };

  useEffect(() => {
    checkOverdueTasks(user.tasks);
  }, []);

  return (
    <>
      <TaskMenu
        selectedTaskId={selectedTaskId}
        setEditModalOpen={setEditModalOpen}
        anchorEl={anchorEl}
        handleMarkAsDone={handleMarkAsDone}
        handleDeleteTask={handleDeleteTask} 
        handleCloseMoreMenu={handleCloseMoreMenu}/>
      <TasksContainer>
        {user.tasks.length > 0 && (
          <SearchInput
            focused
            color="primary"
            placeholder="Search for task..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "white" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      transition: ".3s all",
                      color:
                        reorderTasks(user.tasks).length === 0 && user.tasks.length > 0
                          ? ColorPalette.red
                          : "white",
                    }}
                    onClick={() => setSearch("")}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
        )}
        {categories !== undefined &&
          categories?.length > 0 &&
          user.settings[0].enableCategories && (
            <CategoriesListContainer
            >
              {categories?.map((cat) => (
                <CategoryChip
                  translate="no"
                  label={
                    <div>
                      <span style={{ fontWeight: "bold" }}>{cat.name}</span>
                      <span
                        style={{
                          fontSize: "14px",
                          opacity: 0.9,
                          marginLeft: "4px",
                        }}
                      >
                        ({categoryCounts[cat.id] || 0})
                      </span>
                    </div>
                  }
                  glow={user.settings[0].enableGlow}
                  backgroundclr={cat.color}
                  onClick={() =>
                    selectedCatId !== cat.id
                      ? setSelectedCatId(cat.id)
                      : setSelectedCatId(undefined)
                  }
                  key={cat.id}
                  list
                  onDelete={
                    selectedCatId === cat.id ? () => setSelectedCatId(undefined) : undefined
                  }
                  style={{
                    boxShadow: "none",
                    display:
                      selectedCatId === undefined || selectedCatId === cat.id
                        ? "inline-flex"
                        : "none",
                    padding: "20px 14px",
                    fontSize: "16px",
                  }}
                  avatar={
                    cat.emoji ? (
                      <Avatar
                        alt={cat.name}
                        sx={{
                          background: "transparent",
                          borderRadius: "0px",
                        }}
                      >
                        {cat.emoji &&
                          (user.emojisStyle === EmojiStyle.NATIVE ? (
                            <div>
                              <Emoji size={20} unified={cat.emoji} emojiStyle={EmojiStyle.NATIVE} />
                            </div>
                          ) : (
                            <Emoji size={24} unified={cat.emoji} emojiStyle={user.emojisStyle} />
                          ))}
                      </Avatar>
                    ) : (
                      <></>
                    )
                  }
                />
              ))}
            </CategoriesListContainer>
          )}
        {search && reorderTasks(user.tasks).length > 0 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              opacity: 0.9,
              marginTop: "12px",
            }}
          >
            <b>
              Found {reorderTasks(user.tasks).length} task
              {reorderTasks(user.tasks).length > 1 ? "s" : ""}
            </b>
          </div>
        )}
        {user.tasks.length !== 0 ? (
          reorderTasks(user.tasks).map((task) => (
            <TaskComponent
              key={task.id}
              backgroundColor={task.color}
              clr={getFontColorFromHex(task.color)}
              glow={user.settings[0].enableGlow}
              done={task.done}
              blur={selectedTaskId !== task.id && open}
            >
              <TaskInfo translate="no">
                <TaskHeader>
                  <TaskName done={task.done}>{highlightMatchingText(task.name, search)}</TaskName>

                  <Tooltip
                    title={`Created at: ${new Date(task.date).toLocaleDateString()} • ${new Date(
                      task.date
                    ).toLocaleTimeString()}`}
                  >
                    <TaskDate>{formatDate(new Date(task.date))}</TaskDate>
                  </Tooltip>
                </TaskHeader>
                <TaskDescription done={task.done}>
                  {highlightMatchingText(
                    expandedTasks.has(task.id) || !task.description
                      ? task.description || ""
                      : task.description?.slice(0, DESCRIPTION_SHORT_LENGTH) || "",
                    search
                  )}
                  {task.description && task.description.length > DESCRIPTION_SHORT_LENGTH && (
                    <ShowMoreBtn onClick={() => toggleShowMore(task.id)} clr={task.color}>
                      {expandedTasks.has(task.id) ? "Show less" : "Show more"}
                    </ShowMoreBtn>
                  )}
                </TaskDescription>

                {task.deadline && (
                  <TimeLeft done={task.done} translate="yes">
                    <RingAlarm
                      fontSize="small"
                      animate={new Date() > new Date(task.deadline) && !task.done}
                      sx={{
                        color: `${getFontColorFromHex(task.color)} !important`,
                      }}
                    />{" "}
                    &nbsp;
                    {new Date(task.deadline).toLocaleDateString()} {" • "}
                    {new Date(task.deadline).toLocaleTimeString()}
                    {!task.done && (
                      <>
                        {" • "}
                        {calculateDateDifference(new Date(task.deadline))}
                      </>
                    )}
                  </TimeLeft>
                )}
                {task.sharedBy && (
                  <div style={{ opacity: 0.8, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Link /> Shared by {task.sharedBy}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px 6px",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  {task.category &&
                    user.settings[0].enableCategories !== undefined &&
                    user.settings[0].enableCategories &&
                    task.category.map((category) => (
                      <div key={category.id}>
                        <CategoryChip
                          backgroundclr={category.color}
                          borderclr={getFontColorFromHex(task.color)}
                          glow={user.settings[0].enableGlow}
                          label={category.name}
                          size="medium"
                          avatar={
                            category.emoji ? (
                              <Avatar
                                alt={category.name}
                                sx={{
                                  background: "transparent",
                                  borderRadius: "0px",
                                }}
                              >
                                {category.emoji &&
                                  (user.emojisStyle === EmojiStyle.NATIVE ? (
                                    <div>
                                      <Emoji
                                        size={18}
                                        unified={category.emoji}
                                        emojiStyle={EmojiStyle.NATIVE}
                                      />
                                    </div>
                                  ) : (
                                    <Emoji
                                      size={20}
                                      unified={category.emoji}
                                      emojiStyle={user.emojisStyle}
                                    />
                                  ))}
                              </Avatar>
                            ) : (
                              <></>
                            )
                          }
                        />
                      </div>
                    ))}
                </div>
              </TaskInfo>
              <IconButton
                aria-label="Task Menu"
                aria-controls={open ? "task-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(event) => handleClick(event, task.id)}
                sx={{
                  color: getFontColorFromHex(task.color),
                  margin: "4px",
                }}
              >
                <MoreVert />
              </IconButton>
            </TaskComponent>
          ))
        ) : (
          <NoTasks>
            <b>You don't have any tasks yet</b>
            <br />
            Click on the <b>+</b> button to add one
          </NoTasks>
        )}
        {search && reorderTasks(user.tasks).length === 0 && user.tasks.length > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              opacity: 0.9,
              marginTop: "18px",
            }}
          >
            <b>No tasks found</b>
            <br />
            Try searching with different keywords.
          </div>
        )}

        <EditTask
          open={editModalOpen}
          task={user.tasks.find((task) => task.id === selectedTaskId)}
          onClose={() => setEditModalOpen(false)}
          onSave={(editedTask) => {
            handleEditTask(
              editedTask.id,
              editedTask.name,
              editedTask.color,
              editedTask.description || undefined,
              editedTask.deadline || undefined,
              editedTask.category || undefined
            );
            setEditModalOpen(false);
          }}
        />
      </TasksContainer>
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteTask}
        PaperProps={{
          style: {
            borderRadius: "28px",
            padding: "10px",
          },
        }}
      >
        <DialogTitle>Are you sure you want to delete the task?</DialogTitle>
        <DialogContent>
          <p>
            <b>Task Name:</b> {user.tasks.find((task) => task.id === selectedTaskId)?.name}
          </p>
          {user.tasks.find((task) => task.id === selectedTaskId)?.description !== undefined && (
            <p>
              <b>Task Description:</b>{" "}
              {user.tasks.find((task) => task.id === selectedTaskId)?.description}
            </p>
          )}

          {selectedTaskId !== null &&
            user.tasks.find((task) => task.id === selectedTaskId)?.category?.[0]?.name !==
              undefined && (
              <p>
                <b>Category:</b>{" "}
                {user.tasks
                  .find((task) => task.id === selectedTaskId)
                  ?.category?.map((cat) => cat.name)
                  .join(", ")}
              </p>
            )}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={cancelDeleteTask} color="primary">
            Cancel
          </DialogBtn>
          <DialogBtn onClick={confirmDeleteTask} color="error">
            Delete
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};
