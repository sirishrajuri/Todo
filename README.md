# Todo List

Todo list web app built with [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.1),
[ReactJS](https://reactjs.org/) and [SQL Server](https://www.microsoft.com/en-us/sql-server)

<table>
    <tbody>
        <tr>
            <td><img src="Frontend/public/img1.png"  /></td>
            <td rowspan=2><img src="Frontend/public/img2.png" /></td>
        </tr>
        <tr>
            <td><img src="Frontend/public/img3.png" /></td>
        </tr>
    </tbody>
</table>

## Technologies

-   Backend
    -   C# - Code first apporach. 
    -   [ASP NET Core](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.1)
    -   Entity Framework Core
    -   [SQL Server](https://www.microsoft.com/en-us/sql-server): Microsoft Relational Database
    -   Entity Framework as an ORM Tool.
    -   SQL Server, LINQ, Dependency Injection.

-   Frontend
    -   [ReactJS](https://reactjs.org/)
-   [Docker](https://www.docker.com/)

## Features

- Create, Read, Update, and Delete operations for tasks.
- React frontend with a user-friendly interface.
- .NET backend API.
- MS SQL database integration.

## Approach

### Frontend Architecture

The frontend of this application uses a component-based architecture, to enhance reusability and separation of concerns. Key functionalities are embedded within dedicated components:

- `AddTaskBtn.tsx`: A button component to trigger the task addition flow.
- `CategorySelect.tsx`: Dropdown component for selecting task categories.
- `EditTask.tsx`: An interface for editing the details of tasks.
- `TaskMenu.tsx`: A context menu providing options to delete tasks or mark them as completed.
- `Tasks.tsx`: The main component that aggregates and displays the list of tasks.

This modular approach allows for scalable and maintainable code structure. 
For state management, We used React hooks to encapsulate local state and side effects, providing a clean and efficient way to handle the application's dynamic data.

### Page Components

The application has specific pages corresponding to major features, to improve user experience through clear navigation:

- `AddTask.tsx`: A page dedicated to creating new tasks, with form inputs to capture all necessary task information.
- `Categories.tsx`: This page allows users to manage their task categories, helping in the organization and filtering of tasks.
- `TaskDetails.tsx`: A detailed view for each task, offering an in-depth look at the task's properties and the ability to modify them.

### Backend Communication

The `services` directory contains all the methods required to interact with the backend, encapsulating the API logic:

- `createTodo`: POST request to `baseUrl/v1/todolist/items` to add a new task.
- `getTodos`: GET request to `baseUrl/v1/todolist/items` to retrieve all tasks.
- `updateTodo`: PUT request to `baseUrl/v1/todolist/items/{id}` to update an existing task.
- `deleteTodo`: DELETE request to `baseUrl/v1/todolist/items/{id}` to remove a task.

By abstracting these operations into service methods, the components remain clean and focused on the UI logic, delegating data operations to the service layer. 
The `todoService` provides a straightforward API for the components to interact with the backend, streamlining the process of sending and receiving data to and from the server.

### Backend Architecture

The backend architecture of our application is designed with a focus on maintainability and scalability. 
At its core, the controller classes inherit from a BaseController, which provides a structured approach to handling API requests.

These controllers are the entry points for the various CRUD operations, each defined as an endpoint that the client can invoke.

### Request Lifecycle

When a request arrives at the server:

**Endpoint Invocation:** The request is routed to the appropriate controller class endpoint. The controllers serve as an intermediary, orchestrating the flow of data between the frontend and the services layer.

**Service Layer Redirection:** Once in the controller, the request is delegated to a service class. This service class is part of a broader service layer designed to handle business logic and data manipulation. 
It adheres to an interface that defines the contract for all service operations, promoting a clean separation of concerns.

**Dependency Injection and DbContext Initialization:** The service class leverages dependency injection to utilize instances of DbContext. Upon construction of the service class, the DbContext is initialized, triggering Entity Framework Core's code-first approach. This process includes:

1) **Checking for the existence of the database:** Creating the database if it does not exist, using the migrations and configurations defined within the DbContext and by the settings in the ConfigureServices method in startup.cs.
2) **Business Logic Execution:**  With the DbContext prepared, the service class proceeds to execute the business logic. 
It communicates with the database to perform the necessary CRUD operations, translating the requests into data changes or retrievals.
3) **Response Generation:** After the service layer completes its data operations, a response is constructed and sent back to the client. 
This response contains  the requested data or the outcome of a data manipulation operation, or relevant error messages.

### Enhanced Features:

The backend is engineered to ensure robustness through:

**Clear Abstractions:** By isolating the business logic within the service layer, we maintain a clear abstraction that simplifies future enhancements and promotes testability.

**Efficient Data Handling:** The DbContext plays a pivotal role in efficiently managing data access, leveraging Entity Framework Core's capabilities to interact with the database in an optimized manner.

**Scalable Configuration:** The service configurations within startup.cs are designed to be scalable, making it straightforward to introduce new services as our application grows.

## Features Implemented

- Create, Read, Update and Delete the tasks.
- Real-time search functionality to quickly find tasks as the user types.
- Percentage completion based on the number of tasks completed.
- Added Categories to easily idenfify the priority ones.


## Front End Features:

Adding a task: 

<img src="Frontend/public/adding.png" width="350px" />

Updating a task:

<img src="Frontend/public/updating.png" width="350px" />

Editing a task:

<img src="Frontend/public/editing.png" width="350px" />

Deleting a task:

<img src="Frontend/public/deleting.png" width="350px" />

Percentage completion:

<img src="Frontend/public/per.png" width="350px" />

Searching for a task:

<img src="Frontend/public/search.png" width="350px" />

Catogories:

<img src="Frontend/public/catogories.png" width="350px" />

























