import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
  });

  const totalPages = data?.totalPages ?? 0;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // важливо: при новому пошуку завжди на 1 сторінку
  }, 500);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Error...</p>;
  if (data && data.notes.length === 0) {
    return <p>No notes found</p>;
  }

  return (
    <div className={css.app}>
      {/* HEADER */}
      <header className={css.toolbar}>
        {/* Пошук */}
        <SearchBox value={search} onChange={debouncedSearch} />

        {/* Пагінація */}
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        {/* КНОПКА (ОЦЕ СЮДИ) */}
        <button onClick={() => setIsOpen(true)}>Create note +</button>
      </header>

      {/* Список нотаток */}
      {data?.notes?.length > 0 && (
        <NoteList notes={data.notes} onDelete={deleteMutation.mutate} />
      )}

      {/* MODAL (ОЦЕ ТУТ, ВНИЗУ, НЕ В HEADER) */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
