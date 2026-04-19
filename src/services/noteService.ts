import axios from "axios";
import type { Note } from "../types/note";

export interface CreateNoteBody {
  title: string;
  content: string;
  tag: Note["tag"];
}

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
  const { data } = await axios.get<FetchNotesResponse>("/notes", {
    params: { page, perPage: 12, search },
  });

  return data;
};

export const createNote = async (body: CreateNoteBody) => {
  const { data } = await axios.post<Note>("/notes", body);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
};
