// fetchNotes : має виконувати запит для отримання колекції нотаток із сервера. Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);
// createNote: має виконувати запит для створення нової нотатки на сервері. Приймає вміст нової нотатки та повертає створену нотатку у відповіді;
// deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором. Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.

import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string,
): Promise<FetchNotesResponse> => {
  const res = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
    },
  });

  return res.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt">,
): Promise<Note> => {
  const res = await axios.post("/notes", note);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await axios.delete(`/notes/${id}`);
  return res.data;
};
