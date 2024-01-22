import { Task } from '../types/user';

type ResultStatus =
    | 'success'
    | 'error'
    | 'not found'
    | 'unauthorized'
    | 'forbid';

interface ITodoApiResult<T> {
    status: ResultStatus;
    data?: T;
}

export interface ITodoApi {
    createTodo(todo: Task): Promise<ITodoApiResult<Task>>;
    deleteTodo(id: number): Promise<ITodoApiResult<void>>;
    updateTodo(todo: Task): Promise<ITodoApiResult<void>>;
    getTodos(): Promise<ITodoApiResult<Task[]>>;
}

const todoApiPromise = <T>(
    status: ResultStatus,
    data?: T
): ITodoApiResult<T> => ({
    status,
    data,
});

export const todoApiFactory = (): ITodoApi => {
    const baseUrl = 'http://localhost:8000';

    const url = (url: string) => `${baseUrl}/${url}`;

    const headers = () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    };

    return {
        async createTodo(todo: Task) {
            const response = await fetch(url('v1/todoitems'), {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify(todo),
            });
            if (response.status !== 201) return todoApiPromise('error');
            const data = await response.json();
            return todoApiPromise('success', data);
        },
        async deleteTodo(id: number) {
            const response = await fetch(url(`v1/todoitems/${id}`), {
                method: 'DELETE',
                headers: headers(),
            });
            if (response.status === 403) return todoApiPromise('forbid');
            if (response.status >= 400) return todoApiPromise('error');
            return todoApiPromise('success');
        },
        async getTodos() {
            const response = await fetch(url(`v1/todoitems`), {
                method: 'GET',
                headers: headers(),
            });
            if (response.status !== 200) return todoApiPromise('error');
            const data = await response.json();
            return todoApiPromise('success', data);
        },
        async updateTodo(todo: Task) {
            const response = await fetch(url(`v1/todoitems/${todo.id}`), {
                method: 'PUT',
                headers: headers(),
                body: JSON.stringify(todo),
            });
            if (response.status === 403) return todoApiPromise('forbid');
            if (response.status >= 400) return todoApiPromise('error');
            return todoApiPromise('success');
        },
    };
};
